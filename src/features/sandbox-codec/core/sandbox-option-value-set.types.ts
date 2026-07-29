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

/** Formats the display text for a given index (percent/day/etc. templating included). */
export function getDisplayAtIndex(valueSet: SandboxOptionValueSet, index: number): string {
  if (index < 0 || index >= valueSet.values.length) return "";

  const alternate = valueSet.alternateDisplayValues?.[index];
  if (alternate) return alternate;

  const key = valueSet.displayValues?.[index];
  if (key) {
    const resolved = localizationMap[key];
    if (resolved) {
      if (resolved.includes("{0}")) {
        const raw = valueSet.values[index];
        const displayValue = valueSet.type === "float" ? String((raw as number) * 100) : String(raw);
        return resolved.replace("{0}", displayValue);
      }
      return resolved;
    }
  }

  const raw = valueSet.values[index];
  const displayValue = valueSet.type === "float" ? String((raw as number) * 100) : String(raw);

  if (valueSet.displayFormat) {
    const template = localizationMap[valueSet.displayFormat] ?? valueSet.displayFormat;
    return template.replace("{0}", displayValue);
  }

  if (valueSet.type === "bool") return raw ? "Yes" : "No";
  return displayValue;
}
