import { SandboxOption } from './sandbox-option.enum'
import type { SandboxOptionDefinition } from './sandbox-option-definition.types'
import { localizationMap } from './localization.data'

const enumNameByValue: Record<number, string> = {}
for (const [key, value] of Object.entries(SandboxOption)) {
  if (typeof value === 'number') {
    enumNameByValue[value] = key
  }
}

export function getEnumName(option: SandboxOption): string {
  return enumNameByValue[option] ?? ''
}

export function getDisplayName(def: SandboxOptionDefinition): string {
  if (def.overrideOptionName) {
    return localizationMap[def.overrideOptionName] ?? def.optionName
  }
  return def.optionName
}

export function getDescription(def: SandboxOptionDefinition): string {
  if (def.overrideDescriptionName) {
    return localizationMap[def.overrideDescriptionName] ?? ''
  }
  const enumName = getEnumName(def.option)
  return localizationMap[`go${enumName}Desc`] ?? ''
}
