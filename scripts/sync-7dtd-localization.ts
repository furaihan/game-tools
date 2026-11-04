#!/usr/bin/env bun
/**
 * Regenerates src/features/sandbox-codec/core/localization.data.ts from a 7 Days
 * to Die installation.
 *
 * Every user-facing string the sandbox options UI shows comes from the game's
 * Localization.csv. The sandbox-specific subset is small enough to ship as a
 * plain object, which keeps the codec free of any runtime file access.
 *
 * Usage:
 *   bun run scripts/sync-7dtd-localization.ts "E:\SteamLibrary\steamapps\common\7 Days To Die"
 *
 * Only the `english` column is taken. Keys are kept when they are sandbox
 * options, their descriptions, the shared value-set labels, or the
 * sandbox/preset UI strings.
 *
 * A handful of shared labels live in a generic `xui*`/`lbl*` key rather than a
 * `go*` one (Yes/No, Instant, the durability modes...). Those are collected
 * automatically from the value sets, so a new value set that reuses them needs
 * no change here.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const gameDir = resolve(process.argv[2] ?? 'E:/SteamLibrary/steamapps/common/7 Days To Die')
const csvPath = join(gameDir, 'Data', 'Config', 'Localization.csv')
const outPath = join(here, '..', 'src', 'features', 'sandbox-codec', 'core', 'localization.data.ts')

import { SANDBOX_OPTION_DEFINITIONS } from '../src/features/sandbox-codec/core/sandbox-option-definitions.data'
import { SANDBOX_OPTION_VALUE_SETS } from '../src/features/sandbox-codec/core/sandbox-option-value-sets.data'
import { SandboxOption } from '../src/features/sandbox-codec/core/sandbox-option.enum'
import { SANDBOX_PRESETS } from '../src/features/sandbox-codec/core/sandbox-presets.data'

/**
 * Only the keys the codec can actually reach are emitted. That is every option
 * name and description (respecting the `override*` keys, which replace the
 * default `go<Option>` lookup) plus every label the value sets reference.
 *
 * Importing the real registries rather than duplicating a key list means a new
 * option or value set is picked up automatically on the next run.
 */
const enumNameByValue = new Map<number, string>(
  Object.entries(SandboxOption)
    .filter(([name, value]) => typeof value === 'number' && name !== 'Max')
    .map(([name, value]) => [value as number, name])
)

const reachableKeys = new Set<string>()
for (const def of SANDBOX_OPTION_DEFINITIONS) {
  const name = enumNameByValue.get(def.option)!
  reachableKeys.add(def.overrideOptionName ?? `go${name}`)
  reachableKeys.add(def.overrideDescriptionName ?? `go${name}Desc`)
}
for (const valueSet of Object.values(SANDBOX_OPTION_VALUE_SETS)) {
  for (const key of valueSet.displayValues ?? []) if (key) reachableKeys.add(key)
  for (const key of valueSet.alternateDisplayValues ?? []) if (key) reachableKeys.add(key)
  if (valueSet.displayFormat) reachableKeys.add(valueSet.displayFormat)
}
// The shipped presets are listed by name in the UI, so their own strings (and
// the group headings the picker sorts them under) are reachable too. They live
// under `xuiSandboxOfficial*` and `goDifficultyN`, none of which an option
// definition points at.
for (const preset of SANDBOX_PRESETS) {
  reachableKeys.add(preset.nameKey)
  reachableKeys.add(`${preset.nameKey}Desc`)
  reachableKeys.add(preset.group === 'official' ? 'sandboxPresetGroupOfficial' : 'sandboxPresetGroupDifficulty')
}
reachableKeys.add('sandboxPresetGroupOfficial')
reachableKeys.add('sandboxPresetGroupDifficulty')

/** Splits one CSV record, honouring double-quoted fields and doubled-quote escapes. */
function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          quoted = false
        }
      } else {
        current += ch
      }
    } else if (ch === '"') {
      quoted = true
    } else if (ch === ',') {
      fields.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current)
  return fields
}

const lines = readFileSync(csvPath, 'utf8').split(/\r?\n/)
const header = parseCsvLine(lines[0])
const englishIndex = header.indexOf('english')
if (englishIndex < 0) throw new Error('Localization.csv has no "english" column')

const entries = new Map<string, string>()
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue
  const fields = parseCsvLine(lines[i])
  if (fields.length <= englishIndex) continue
  const key = fields[0]
  if (!reachableKeys.has(key)) continue
  // The game stores line breaks as a literal \n inside the cell.
  entries.set(key, fields[englishIndex].replace(/\\n/g, '\n'))
}

const sorted = [...entries.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
const body = sorted.map(([key, value]) => '  ' + JSON.stringify(key) + ': ' + JSON.stringify(value) + ',').join('\n')

const headerText =
  '// Generated by scripts/sync-7dtd-localization.ts — do not edit by hand.\n' +
  '// Source: Data/Config/Localization.csv of 7 Days to Die V3.40 (b10).\n' +
  '// Re-run the script after a game update to pick up renamed or reworded strings.\n\n'

writeFileSync(outPath, headerText + 'export const localizationMap: Record<string, string> = {\n' + body + '\n}\n', 'utf8')

console.log('wrote ' + sorted.length + ' keys to ' + outPath)
