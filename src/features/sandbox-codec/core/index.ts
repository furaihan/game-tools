export { SandboxOption } from "./sandbox-option.enum";

export type {
  SandboxValueType,
  SandboxOptionValueSet,
  SandboxOptionValueSetInt,
  SandboxOptionValueSetFloat,
  SandboxOptionValueSetBool,
} from "./sandbox-option-value-set.types";
export { getValueIndex, getDisplayAtIndex } from "./sandbox-option-value-set.types";

export type {
  DisabledOptionsOnValue,
  SandboxOptionDefinition,
  SandboxOptionIntDefinition,
  SandboxOptionFloatDefinition,
  SandboxOptionBoolDefinition,
  SandboxOptionState,
} from "./sandbox-option-definition.types";

export { SANDBOX_OPTION_VALUE_SETS } from "./sandbox-option-value-sets.data";
export { SANDBOX_OPTION_DEFINITIONS } from "./sandbox-option-definitions.data";

export {
  optionsByEnum,
  optionsByCategory,
  getDefinition,
  getValueSet,
  getDefaultIndex,
  createDefaultState,
  applyDisabledCascade,
} from "./sandbox-option-registry";

export type { SandboxPresetValues } from "./sandbox-option-codec";
export {
  CODEC_VERSION,
  indexToAlpha,
  indexToAlpha2,
  alphaToIndex,
  alpha2ToIndex,
  encodePresetToCode,
  decodeCodeToPreset,
} from "./sandbox-option-codec";

export { localizationMap } from "./localization.data";
export { getEnumName, getDisplayName, getDescription } from "./localization";
