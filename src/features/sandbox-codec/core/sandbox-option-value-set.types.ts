/**
 * A "value set" is the ordered list of selectable steps behind a slider/dropdown
 * in the sandbox options UI (e.g. 0%, 25%, 50%, 75%, 100%...). Options don't store
 * free-form values — they store an *index* into one of these sets.
 *
 * Mirrors `SandboxOptions.SandboxOptionValueSet` and its Int/Float/Bool subclasses.
 */
export type SandboxValueType = "int" | "float" | "bool";

interface BaseValueSet {
  /** Localization key (or literal label, per-index) shown instead of the formatted value. */
  displayValues?: string[];
  /** Optional literal text shown instead of the numeric value at a given index. */
  alternateDisplayValues?: string[];
  /** Localization key for a `string.Format`-style template, e.g. "goPercent" -> "{0}%". */
  displayFormat?: string;
}

export interface SandboxOptionValueSetInt extends BaseValueSet {
  type: "int";
  values: number[];
}

export interface SandboxOptionValueSetFloat extends BaseValueSet {
  type: "float";
  values: number[];
}

export interface SandboxOptionValueSetBool extends BaseValueSet {
  type: "bool";
  values: boolean[];
}

export type SandboxOptionValueSet =
  | SandboxOptionValueSetInt
  | SandboxOptionValueSetFloat
  | SandboxOptionValueSetBool;

import { localizationMap } from "./localization.data";

/** Index of `value` within a value set's `values` array, or -1 if not found. */
export function getValueIndex(
  valueSet: SandboxOptionValueSet,
  value: number | boolean
): number {
  return valueSet.values.indexOf(value as never);
}

/**
 * Resolves a localization key the way `Localization.Get` does: an unknown key
 * comes back as the key itself. That matters because several value sets use
 * literal strings (e.g. the ranges in `LoseItemCount`) as display values.
 */
function resolveLocalization(key: string): string {
  return localizationMap[key] ?? key;
}

/**
 * Rounds away binary-float noise before rendering (`1.1 * 100` is
 * `110.00000000000001` in JS). The game prints the float itself, so a handful
 * of its own percentages read as "60.000004%"; that is a float artefact rather
 * than intent, so we render the value the setting is meant to have.
 */
function formatNumber(value: number): string {
  return String(Number(value.toFixed(4)));
}

/**
 * Formats the display text for a given index.
 *
 * Mirrors `SandboxOptionValueSet.GetDisplayAtIndex`:
 * - the format is `DisplayValues[index]` when present, otherwise
 *   `DisplayFormat`, otherwise the bare `"{0}"` template;
 * - `AlternateDisplayValues[index]` is the `{0}` *argument*, not the whole
 *   string, so "Every Day" is how index 1 of AirDrops reads;
 * - floats are shown as percentages, everything else as its raw value.
 */
export function getDisplayAtIndex(valueSet: SandboxOptionValueSet, index: number): string {
  if (index < 0 || index >= valueSet.values.length) return "";

  if (valueSet.type === "bool") {
    const key = valueSet.displayValues?.[index];
    return key ? resolveLocalization(key) : valueSet.values[index] ? "Yes" : "No";
  }

  const displayValue = valueSet.displayValues?.[index] ?? null;
  const template = resolveLocalization(
    displayValue !== null ? displayValue : (valueSet.displayFormat ?? "{0}")
  );

  const alternate = valueSet.alternateDisplayValues?.[index];
  const usesAlternate =
    valueSet.type === "float" ? alternate !== undefined && alternate !== "" : alternate !== undefined;

  const raw = valueSet.values[index] as number;
  let argument: string | number;
  if (usesAlternate && alternate !== undefined) {
    argument = alternate;
  } else {
    argument = valueSet.type === "float" ? raw * 100 : raw;
  }

  return template.replace(
    "{0}",
    typeof argument === "number" ? formatNumber(argument) : argument
  );
}
