import { SandboxOption } from "./sandbox-option.enum";
import { SANDBOX_OPTION_DEFINITIONS } from "./sandbox-option-definitions.data";
import { SANDBOX_OPTION_VALUE_SETS } from "./sandbox-option-value-sets.data";
import type { SandboxOptionDefinition, SandboxOptionState } from "./sandbox-option-definition.types";
import { getValueIndex } from "./sandbox-option-value-set.types";

/** `SandboxOption -> definition`, equivalent to `SandboxOptionManager.SandboxOptionsDict`. */
export const optionsByEnum: ReadonlyMap<SandboxOption, SandboxOptionDefinition> = new Map(
  SANDBOX_OPTION_DEFINITIONS.map((def) => [def.option, def])
);

/** `category name -> definitions`, equivalent to `SandboxOptionManager.OptionsByCategory`. */
export const optionsByCategory: ReadonlyMap<string, SandboxOptionDefinition[]> = (() => {
  const map = new Map<string, SandboxOptionDefinition[]>();
  for (const def of SANDBOX_OPTION_DEFINITIONS) {
    const list = map.get(def.categoryName) ?? [];
    list.push(def);
    map.set(def.categoryName, list);
  }
  return map;
})();

export function getDefinition(option: SandboxOption): SandboxOptionDefinition | undefined {
  return optionsByEnum.get(option);
}

export function getValueSet(definition: SandboxOptionDefinition) {
  return SANDBOX_OPTION_VALUE_SETS[definition.valueSetName];
}

/** Index of a definition's default value within its own value set. */
export function getDefaultIndex(definition: SandboxOptionDefinition): number {
  const valueSet = getValueSet(definition);
  if (!valueSet) return -1;
  return getValueIndex(valueSet, definition.defaultValue);
}

/** Builds the full set of options at their default index — a fresh "Custom" preset baseline. */
export function createDefaultState(): Map<SandboxOption, SandboxOptionState> {
  const state = new Map<SandboxOption, SandboxOptionState>();
  for (const def of SANDBOX_OPTION_DEFINITIONS) {
    state.set(def.option, {
      definition: def,
      currentIndex: getDefaultIndex(def),
      isEnabled: true,
    });
  }
  return state;
}

/**
 * Applies `disabledOptions` cascades after `option`'s index changes: any option listed in
 * `definition.disabledOptions.disabledOptions` gets `isEnabled` toggled based on whether the
 * new value matches (or, if `inverted`, doesn't match) the trigger value.
 *
 * Mirrors the `SetOption(...)` disabled-cascade blocks in `SandboxOptionManager`.
 */
export function applyDisabledCascade(
  state: Map<SandboxOption, SandboxOptionState>,
  option: SandboxOption,
  newIndex: number
): void {
  const definition = getDefinition(option);
  const disabled = definition?.disabledOptions;
  if (!disabled) return;

  const valueSet = definition ? getValueSet(definition) : undefined;
  const newValue = valueSet?.values[newIndex];

  const matches = disabled.inverted ? newValue === disabled.value : newValue !== disabled.value;

  for (const target of disabled.disabledOptions) {
    const targetState = state.get(target);
    if (!targetState) continue;
    targetState.isEnabled = matches;
  }
}
