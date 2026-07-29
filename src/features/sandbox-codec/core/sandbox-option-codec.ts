import { SandboxOption } from "./sandbox-option.enum";
import { SANDBOX_OPTION_DEFINITIONS } from "./sandbox-option-definitions.data";
import { SANDBOX_OPTION_VALUE_SETS } from "./sandbox-option-value-sets.data";

/** Bump when the code format changes, same role as C# `currentVersion` ('A'). */
export const CODEC_VERSION = "A";

/**
 * A saved sandbox preset: only the options that differ from their default are stored,
 * each as an index into that option's value set.
 *
 * Mirrors `SandboxOptionPreset.PresetValues` (a `Dictionary<SandboxOptions, int>`).
 */
export type SandboxPresetValues = Map<SandboxOption, number>;

const definitionByOption = new Map(
  SANDBOX_OPTION_DEFINITIONS.map((def) => [def.option, def])
);

function getValueSetForOption(option: SandboxOption) {
  const def = definitionByOption.get(option);
  if (!def) return undefined;
  return SANDBOX_OPTION_VALUE_SETS[def.valueSetName];
}

function isValidIndex(option: SandboxOption, index: number): boolean {
  const valueSet = getValueSetForOption(option);
  if (!valueSet) return false;
  return index >= 0 && index < valueSet.values.length;
}

/** 0 -> 'A', 25 -> 'Z' (wraps past 26, matches the C# `% 26` behavior). */
export function indexToAlpha(index: number): string {
  if (index < 0 || index > 26) {
    throw new RangeError(`Index out of range of the code conversion: ${index}`);
  }
  return String.fromCharCode(65 + (index % 26));
}

/** 0 -> 'AA', 675 -> 'ZZ'. Used to encode a SandboxOption's numeric id as 2 letters. */
export function indexToAlpha2(index: number): string {
  if (index < 0 || index >= 676) {
    throw new RangeError(`Index out of range of the code conversion: ${index}`);
  }
  const hi = String.fromCharCode(65 + Math.floor(index / 26));
  const lo = String.fromCharCode(65 + (index % 26));
  return `${hi}${lo}`;
}

/** Inverse of {@link indexToAlpha}. */
export function alphaToIndex(char: string): number {
  const c = char.toUpperCase();
  if (c < "A" || c > "Z") {
    throw new Error("Value must contain only A-Z.");
  }
  return c.charCodeAt(0) - 65;
}

/** Inverse of {@link indexToAlpha2}. */
export function alpha2ToIndex(pair: string): number {
  const p = pair.toUpperCase();
  if (p.length !== 2 || p[0] < "A" || p[0] > "Z" || p[1] < "A" || p[1] > "Z") {
    throw new Error("Value must be exactly 2 letters, A-Z.");
  }
  return (p.charCodeAt(0) - 65) * 26 + (p.charCodeAt(1) - 65);
}

/**
 * Serializes changed preset values into a share-able code string, e.g. "AABCDE...".
 * First char is the format version; every following 3 chars are
 * `[option id as 2 letters][value index as 1 letter]`.
 *
 * Mirrors `SandboxOptionPreset.saveOptionsToCode()`.
 */
export function encodePresetToCode(values: SandboxPresetValues): string {
  let code = CODEC_VERSION;
  values.forEach((index, option) => {
    code += `${indexToAlpha2(option)}${indexToAlpha(index)}`;
  });
  return code;
}

/**
 * Parses a code string produced by {@link encodePresetToCode} back into preset values.
 * Silently skips entries referencing an unknown option or an out-of-range index,
 * same as the C# `StoreOptionsInPresetFromCode` / `LoadOptionsFromCode`.
 */
export function decodeCodeToPreset(code: string): SandboxPresetValues {
  const values: SandboxPresetValues = new Map();
  if (!code || code[0] !== CODEC_VERSION) return values;

  const body = code.slice(1);
  const entryCount = Math.floor(body.length / 3);
  for (let i = 0; i < entryCount; i++) {
    const chunk = body.slice(i * 3, i * 3 + 3);
    const option = alpha2ToIndex(chunk.slice(0, 2)) as SandboxOption;
    const index = alphaToIndex(chunk[2]);
    if (definitionByOption.has(option) && isValidIndex(option, index)) {
      values.set(option, index);
    }
  }
  return values;
}
