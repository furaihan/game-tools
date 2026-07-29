import type { SandboxOption } from "./sandbox-option.enum";

/**
 * Disables a set of other options while this option's current value matches
 * (or doesn't match, if `inverted`) `value`.
 *
 * Mirrors the nested `DisabledOptionsOnValue` class in each C# option type.
 */
export interface DisabledOptionsOnValue<TValue extends number | boolean> {
  value: TValue;
  disabledOptions: SandboxOption[];
  inverted?: boolean;
  alwaysShowValuesOnEnabled?: boolean;
}

interface BaseOptionDefinition {
  option: SandboxOption;
  /** Fallback display name if no localization entry exists for `go${option}`. */
  optionName: string;
  categoryName: string;
  /** Key into `SANDBOX_OPTION_VALUE_SETS`. */
  valueSetName: string;
  newUISection?: boolean;
  overrideOptionName?: string;
  overrideDescriptionName?: string;
}

export interface SandboxOptionIntDefinition extends BaseOptionDefinition {
  type: "int";
  defaultValue: number;
  disabledOptions?: DisabledOptionsOnValue<number>;
}

export interface SandboxOptionFloatDefinition extends BaseOptionDefinition {
  type: "float";
  defaultValue: number;
  disabledOptions?: DisabledOptionsOnValue<number>;
}

export interface SandboxOptionBoolDefinition extends BaseOptionDefinition {
  type: "bool";
  defaultValue: boolean;
  disabledOptions?: DisabledOptionsOnValue<boolean>;
}

export type SandboxOptionDefinition =
  | SandboxOptionIntDefinition
  | SandboxOptionFloatDefinition
  | SandboxOptionBoolDefinition;

/**
 * Runtime state for one option: its static definition plus the currently
 * selected index into its value set. This is the piece that actually changes
 * as the user edits a preset.
 */
export interface SandboxOptionState {
  definition: SandboxOptionDefinition;
  /** Index into the option's value set. -1 means "unset / use default". */
  currentIndex: number;
  isEnabled: boolean;
  disabledByText?: string;
}
