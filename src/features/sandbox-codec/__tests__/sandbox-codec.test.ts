/**
 * Guards the sandbox code format against game updates.
 *
 * A code is `'A'` followed by 3-character groups of `[option id as 2 letters]
 * `[value index as 1 letter]`. That means the option enum's numeric values and
 * every value set's length are part of the wire format: renaming an option is
 * harmless, but reordering the enum or resizing a value set silently corrupts
 * every preset ever shared.
 *
 * The fixture holds codes produced by the game itself, so decoding and
 * re-encoding them is an end-to-end check of the shipped data.
 */
import { describe, expect, test } from 'bun:test'
import {
  alpha2ToIndex,
  alphaToIndex,
  decodeCodeToPreset,
  encodePresetToCode,
  indexToAlpha,
  indexToAlpha2,
} from '../core/sandbox-option-codec'
import { SandboxOption } from '../core/sandbox-option.enum'
import { SANDBOX_OPTION_DEFINITIONS } from '../core/sandbox-option-definitions.data'
import { SANDBOX_OPTION_VALUE_SETS } from '../core/sandbox-option-value-sets.data'
import { getDefaultIndex } from '../core/sandbox-option-registry'
import { getDisplayAtIndex } from '../core/sandbox-option-value-set.types'
import { getDisplayName, getDescription } from '../core/localization'
import {
  SANDBOX_PRESETS,
  SANDBOX_PRESETS_BY_ID,
  findPresetByCode,
  getPresetDescription,
  getPresetName,
  getSandboxPreset,
} from '../core/sandbox-presets.data'
import { createStateFromValues } from '../core/sandbox-option-registry'

/**
 * `SandboxOption.Max` is the enum's sentinel one-past-the-end marker, not a
 * real option, so it is left out of every registry comparison below.
 */
const enumNameByValue = new Map<number, string>(
  Object.entries(SandboxOption)
    .filter(([name, value]) => typeof value === 'number' && name !== 'Max')
    .map(([name, value]) => [value as number, name])
)

const definitionByName = new Map(
  SANDBOX_OPTION_DEFINITIONS.map((def) => [enumNameByValue.get(def.option)!, def])
)

describe('codec round-trip against shipped presets', () => {
  test('every official preset decodes without dropping an entry', () => {
    for (const preset of SANDBOX_PRESETS) {
      const expectedEntries = Math.floor((preset.code.length - 1) / 3)
      const decoded = decodeCodeToPreset(preset.code)
      expect({ preset: getPresetName(preset), size: decoded.size }).toEqual({
        preset: getPresetName(preset),
        size: expectedEntries,
      })
    }
  })

  test('re-encoding reproduces the exact game-issued code', () => {
    for (const preset of SANDBOX_PRESETS) {
      expect({ preset: getPresetName(preset), code: encodePresetToCode(decodeCodeToPreset(preset.code)) }).toEqual({
        preset: getPresetName(preset),
        code: preset.code,
      })
    }
  })

  test('every decoded index is a valid step of its value set', () => {
    for (const preset of SANDBOX_PRESETS) {
      for (const [option, index] of decodeCodeToPreset(preset.code)) {
        const def = SANDBOX_OPTION_DEFINITIONS.find((d) => d.option === option)
        expect(def).toBeDefined()
        const valueSet = SANDBOX_OPTION_VALUE_SETS[def!.valueSetName]
        expect(valueSet).toBeDefined()
        expect(index).toBeGreaterThanOrEqual(0)
        expect(index).toBeLessThan(valueSet.values.length)
      }
    }
  })
})

describe('shipped preset catalogue', () => {
  test('every preset has a unique id and a real name and description', () => {
    expect(SANDBOX_PRESETS.length).toBeGreaterThan(0)
    expect(SANDBOX_PRESETS_BY_ID.size).toBe(SANDBOX_PRESETS.length)
    for (const preset of SANDBOX_PRESETS) {
      expect({ id: preset.id, unique: getSandboxPreset(preset.id) === preset }).toEqual({
        id: preset.id,
        unique: true,
      })
      // A key the sync script missed would come back as the raw key.
      expect({ id: preset.id, named: !getPresetName(preset).startsWith('xui') }).toEqual({
        id: preset.id,
        named: true,
      })
      // Official presets carry a description; the difficulty levels do not, and
      // an absent one must read as empty rather than as the raw key.
      const description = getPresetDescription(preset)
      expect({ id: preset.id, keyLeaked: description.startsWith(preset.nameKey) || description.startsWith('go') }).toEqual({
        id: preset.id,
        keyLeaked: false,
      })
      expect({ id: preset.id, described: preset.group === 'official' ? description.length > 0 : description === '' }).toEqual({
        id: preset.id,
        described: true,
      })
    }
  })

  test('looking a preset up by its code finds the same preset', () => {
    for (const preset of SANDBOX_PRESETS) {
      expect({ id: preset.id, found: findPresetByCode(preset.code)?.id }).toEqual({
        id: preset.id,
        found: preset.id,
      })
    }
    expect(findPresetByCode('A')).toBeUndefined()
  })

  test('a preset is still recognised on a code that lost its default-valued entries', () => {
    // The URL carries the canonical code the live state produces, which is not
    // always textually the shipped one: seven of the fifteen codes contain an
    // entry at its default value, and the game does not order them. Looking a
    // preset up by string equality silently reports "custom" for those.
    for (const preset of SANDBOX_PRESETS) {
      const state = createStateFromValues(decodeCodeToPreset(preset.code))
      const canonical = encodePresetToCode(
        new Map(
          [...state]
            .filter(([, entry]) => entry.currentIndex !== getDefaultIndex(entry.definition))
            .map(([option, entry]) => [option, entry.currentIndex] as const),
        ),
      )
      expect({ id: preset.id, found: findPresetByCode(canonical)?.id }).toEqual({
        id: preset.id,
        found: preset.id,
      })
    }
  })

  test('building state from a preset applies every entry it carries', () => {
    // A few shipped presets list an option at the value it already has by
    // default (Caveman Life does it for the crafting and trader tiers), so the
    // changed set can be smaller than the decoded one. What must hold is that
    // every entry is applied and nothing else is touched.
    for (const preset of SANDBOX_PRESETS) {
      const decoded = decodeCodeToPreset(preset.code)
      const state = createStateFromValues(decoded)
      const changed = new Map(
        [...state]
          .filter(([, entry]) => entry.currentIndex !== getDefaultIndex(entry.definition))
          .map(([option, entry]) => [option, entry.currentIndex] as const),
      )

      for (const [option, index] of decoded) {
        expect({ id: preset.id, option, index: state.get(option)?.currentIndex }).toEqual({
          id: preset.id,
          option,
          index,
        })
        // Whatever the preset states, in a code it can only appear if non-default.
        if (index !== getDefaultIndex(state.get(option)!.definition)) {
          expect({ id: preset.id, option, changed: changed.get(option) }).toEqual({
            id: preset.id,
            option,
            changed: index,
          })
        }
      }
      for (const option of changed.keys()) {
        expect({ id: preset.id, option, inCode: decoded.has(option) }).toEqual({
          id: preset.id,
          option,
          inCode: true,
        })
      }
    }
  })

  test('every option carries a value index inside its own value set', () => {
    for (const preset of SANDBOX_PRESETS) {
      for (const [option, entry] of createStateFromValues(decodeCodeToPreset(preset.code))) {
        const valueSet = SANDBOX_OPTION_VALUE_SETS[entry.definition.valueSetName]
        expect({ id: preset.id, option, ok: entry.currentIndex >= 0 }).toEqual({
          id: preset.id,
          option,
          ok: true,
        })
        expect(entry.currentIndex).toBeLessThan(valueSet.values.length)
      }
    }
  })
})

describe('option registry', () => {
  test('every option has a definition and every definition an option', () => {
    expect(SANDBOX_OPTION_DEFINITIONS.length).toBe(enumNameByValue.size)
    const seen = new Set(SANDBOX_OPTION_DEFINITIONS.map((d) => d.option))
    expect(seen.size).toBe(SANDBOX_OPTION_DEFINITIONS.length)
    for (const [value, name] of enumNameByValue) {
      expect({ name, defined: definitionByName.has(name) }).toEqual({ name, defined: true })
      expect(value).toBeGreaterThanOrEqual(0)
    }
  })

  test('every default value resolves to a real step', () => {
    for (const def of SANDBOX_OPTION_DEFINITIONS) {
      const index = getDefaultIndex(def)
      const valueSet = SANDBOX_OPTION_VALUE_SETS[def.valueSetName]
      expect({ option: enumNameByValue.get(def.option), index: index >= 0 }).toEqual({
        option: enumNameByValue.get(def.option),
        index: true,
      })
      expect(index).toBeLessThan(valueSet.values.length)
    }
  })

  test('every value set referenced by an option exists', () => {
    for (const def of SANDBOX_OPTION_DEFINITIONS) {
      expect({ option: enumNameByValue.get(def.option), exists: def.valueSetName in SANDBOX_OPTION_VALUE_SETS }).toEqual({
        option: enumNameByValue.get(def.option),
        exists: true,
      })
    }
  })
})

describe('letter conversion', () => {
  test('alpha and alpha2 round-trip across the whole range', () => {
    for (let i = 0; i < 26; i++) expect(alphaToIndex(indexToAlpha(i))).toBe(i)
    // Index 26 is allowed and wraps to 'A', same as the C# `65 + index % 26`.
    expect(indexToAlpha(26)).toBe('A')
    expect(() => indexToAlpha(27)).toThrow()
    expect(() => indexToAlpha(-1)).toThrow()

    for (let i = 0; i < 676; i++) expect(alpha2ToIndex(indexToAlpha2(i))).toBe(i)
    expect(indexToAlpha2(0)).toBe('AA')
    expect(indexToAlpha2(675)).toBe('ZZ')
    expect(() => indexToAlpha2(676)).toThrow()
    expect(() => alpha2ToIndex('A')).toThrow()
    expect(() => alpha2ToIndex('A1')).toThrow()
  })

  test('the option id of every option fits in two letters', () => {
    for (const option of enumNameByValue.keys()) {
      expect(() => indexToAlpha2(option)).not.toThrow()
    }
  })
})

describe('decoding invalid input', () => {
  test('a code with the wrong version letter decodes to nothing', () => {
    expect(decodeCodeToPreset('BAAAH').size).toBe(0)
    expect(decodeCodeToPreset('').size).toBe(0)
  })

  test('malformed groups are skipped rather than thrown', () => {
    expect(decodeCodeToPreset('A').size).toBe(0)
    expect(decodeCodeToPreset('AAA').size).toBe(0)
  })
})

describe('display text', () => {
  test('unknown keys fall back to the key, matching Localization.Get', () => {
    const valueSet = { type: 'int' as const, values: [1, 2], displayValues: ['notAKey', 'none'] }
    expect(getDisplayAtIndex(valueSet, 0)).toBe('notAKey')
    expect(getDisplayAtIndex(valueSet, 1)).toBe('None')
  })

  test('alternate display values replace the {0} argument, not the whole label', () => {
    const airDrops = SANDBOX_OPTION_VALUE_SETS.AirDrops
    const shown = airDrops.values.map((_, i) => getDisplayAtIndex(airDrops, i))
    expect(shown).toEqual(['Disabled', 'Every Day', '1-3 Days', '3 Days', '3-7 Days', '7 Days', '1-7 Days'])
  })

  test('floats render as clean percentages', () => {
    const damage = SANDBOX_OPTION_VALUE_SETS.DamageValues
    const shown = damage.values.map((_, i) => getDisplayAtIndex(damage, i))
    expect(shown[0]).toBe('None')
    expect(shown[7]).toBe('100%')
    expect(shown).not.toContain('0%')
  })

  test('the item tier options expose the Default step the game has', () => {
    const tiers = SANDBOX_OPTION_VALUE_SETS.ItemTierOptions
    expect(tiers.values).toEqual([-1, 1, 2, 3, 4, 5, 6])
    expect(getDisplayAtIndex(tiers, 0)).toBe('Default')

    for (const name of ['LootMaxTier', 'TraderMaxTier', 'CraftingMaxTier']) {
      const def = definitionByName.get(name)!
      expect({ name, valueSet: def.valueSetName }).toEqual({ name, valueSet: 'ItemTierOptions' })
      expect(getDefaultIndex(def)).toBe(0)
    }
  })
})

describe('localization coverage', () => {
  test('every option resolves to a display name and the game wording', () => {
    for (const def of SANDBOX_OPTION_DEFINITIONS) {
      expect(getDisplayName(def).length).toBeGreaterThan(0)
      expect(getDisplayName(def)).not.toStartWith('*')
      expect(getDescription(def).length).toBeGreaterThan(0)
    }
  })

  test('the wording matches 7 Days to Die V3.40', () => {
    expect(getDisplayName(definitionByName.get('JumpStrength')!)).toBe('Jump Strength')
    expect(getDisplayName(definitionByName.get('MaxEnemyTier')!)).toBe('Max Enemy Tier')
    expect(getDisplayName(definitionByName.get('StarterSkillPoints')!)).toBe('Base Skill Points')
    expect(getDisplayName(definitionByName.get('DayNightLength')!)).toBe('24 Hour Cycle')
    expect(getDisplayName(definitionByName.get('TraderToTraderQuestsEnabled')!)).toBe('Trade Routes')
  })
})
