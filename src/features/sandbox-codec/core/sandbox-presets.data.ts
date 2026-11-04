import type { SandboxPresetValues } from "./sandbox-option-codec";
import { decodeCodeToPreset } from "./sandbox-option-codec";
import { localizationMap } from "./localization.data";
import { optionsByEnum, getDefaultIndex } from "./sandbox-option-registry";

/**
 * The sandbox presets shipped with 7 Days to Die V3.40 (b10), taken from the
 * `sandbox_presets` TextAsset in 7DaysToDie_Data/data.unity3d.
 *
 * These codes are produced by the game itself, which makes them the strongest
 * available check on the codec: every one must decode without dropping an
 * entry, and re-encoding must reproduce the exact same string. If an option id
 * or a value-set length ever drifts, the round-trip test breaks.
 *
 * They are also what the picker in the UI lists, so the game's own starting
 * points can be inspected (and copied) without typing a code by hand.
 */
export type SandboxPresetGroup = "official" | "difficulty";

export interface SandboxPreset {
  /** Stable id used by the picker and its `data-testid`s. */
  id: string;
  /** Localization key of the preset's display name, matching the game's own. */
  nameKey: string;
  /** The `sandboxPresetGroup*` the game files the preset under. */
  group: SandboxPresetGroup;
  code: string;
}

export const SANDBOX_PRESETS: SandboxPreset[] = [
  {
    id: "official.almost-creative",
    nameKey: "xuiSandboxOfficialAlmostCreative",
    group: "official",
    code: "ABEABTBGBBBWADFN",
  },
  {
    id: "official.chibi-mode",
    nameKey: "xuiSandboxOfficialAlmostChibiMode",
    group: "official",
    code: "AAAJABJACJADJAEIARFAGIAHJAFJAIEAKEAJDASGENDBAAAYBAZBBBABDCAUBAMJBUEBSEBTEGCEGAEGBEAQBBIBBKEBLEBMBBNCCVHBZDCACCLDCMDCXBCYCDMJDAIDXIDNIDYIDOIDPGDTGEBGEEGAVCEXFCNDETFFLGFMJFOGFQCFRBFSBFUB",
  },
  {
    id: "official.dumpster-diver",
    nameKey: "xuiSandboxOfficialDumpsterDiver",
    group: "official",
    code: "AAUABUCGCCCVLCABCXBDMKDALDFJDKDDXADNADYBDOAEABDVGDZFEXFFKA",
  },
  {
    id: "official.legacy-survival",
    nameKey: "xuiSandboxOfficialLegacySurvival",
    group: "official",
    code: "AAHIAJDBACAPAAUAAMLBREBUEBSCGCEGACBNCBPABOABVACDACVGCGACBACXBDDGDJIDNJDOJDSAELAEABEBGCNDFEDFIDFAFEOAFKAEPAEQA",
  },
  {
    id: "official.disaster-film",
    nameKey: "xuiSandboxOfficialDisasterFilm",
    group: "official",
    code: "AAXBAYDAZFBDFBVACFHDAKDDJDKFAVFEKFFOJ",
  },
  {
    id: "official.caveman-life",
    nameKey: "xuiSandboxOfficialCavemanLife",
    group: "official",
    code: "AAADABJBTFGBFCDACWBCAACQACRADNADOADWAEZAEWAFGAFKAFPA",
  },
  {
    id: "official.dying-world",
    nameKey: "xuiSandboxOfficialDyingWorld",
    group: "official",
    code: "AAMABTBGBBCAACXADMADOAEBAEJAFEAFIAFDIFHIFJAEOAEPA",
  },
  {
    id: "official.undead-matinee",
    nameKey: "xuiSandboxOfficialUndeadMatinee",
    group: "official",
    code: "AAAFABIACGADGAEIARJAGHAHEAFIAKEAJCBACAWBAXBAYDAZDBDGAPAAMFBUEBSEGCEGAEBFKBQEAQCBJABKABLBBMBBNCBPJCIDCJDCVEBZFCAGCFECYDDBDDCDDDDDEBDGDDHJDIBDKFAVEEKDFDFFHF",
  },
  {
    id: "official.sevendays-later",
    nameKey: "xuiSandboxOfficialSevendaysLater",
    group: "official",
    code: "AAAGABGACGADGARJBACAWFAXBAYDAPABUEBSEGCEGAEBICBJCBKCBLCBMCBPFBZFBYC",
  },
  {
    id: "official.madmoles-mayhem",
    nameKey: "xuiSandboxOfficialMadmolesMayhem",
    group: "official",
    code: "AAAGABGACGBACAWBAXCAZEAPAAMIBUEBSEGCEGAEBFIBGIBHIBIBBKEBLEBNFCIDCJDCVDBZFDCDDDDDEDDFDDGDDJFEXF",
  },
  {
    id: "official.bite-club",
    nameKey: "xuiSandboxOfficialBiteClub",
    group: "official",
    code: "AAAGABGACGADGARJAHJBADBDGBIBBMCBNEBPFBZFCFDCXADADEYA",
  },
  { id: "difficulty.scavenger", nameKey: "goDifficulty1", group: "difficulty", code: "AAAKABKARDBNB" },
  { id: "difficulty.adventurer", nameKey: "goDifficulty2", group: "difficulty", code: "AAAJABJARFBNC" },
  { id: "difficulty.warrior", nameKey: "goDifficulty4", group: "difficulty", code: "AAAGABGARJ" },
  { id: "difficulty.survivalist", nameKey: "goDifficulty5", group: "difficulty", code: "AAAEABEARKBNE" },
  { id: "difficulty.insane", nameKey: "goDifficulty6", group: "difficulty", code: "AAADABDARLBNF" },
];

export const SANDBOX_PRESETS_BY_ID: ReadonlyMap<string, SandboxPreset> = new Map(
  SANDBOX_PRESETS.map((preset) => [preset.id, preset]),
);

export function getSandboxPreset(id: string): SandboxPreset | undefined {
  return SANDBOX_PRESETS_BY_ID.get(id);
}

/** Decoded form of a preset: only the options it changes, keyed by value index. */
export function getPresetValues(preset: SandboxPreset): SandboxPresetValues {
  return decodeCodeToPreset(preset.code);
}

/**
 * Compares two codes by meaning rather than by text.
 *
 * A code only has to list the options that differ from their default, but the
 * game does not prune an entry whose value happens to equal the default, and
 * two codes may order their entries differently (the presets are dictionaries
 * on the game side). Comparing the decoded value maps, defaulted entries
 * removed, treats all of those as the same preset. Of the 15 shipped codes,
 * seven do not survive a naive string comparison with their own round-trip.
 */
export function isSamePresetCode(a: string, b: string): boolean {
  const left = presetCodeValues(a);
  const right = presetCodeValues(b);
  if (left.size !== right.size) return false;
  for (const [option, index] of left) {
    if (right.get(option) !== index) return false;
  }
  return true;
}

/** Decoded entries of a code with any value that equals its default dropped. */
function presetCodeValues(code: string): SandboxPresetValues {
  const values: SandboxPresetValues = new Map();
  for (const [option, index] of decodeCodeToPreset(code)) {
    const definition = optionsByEnum.get(option);
    if (!definition) continue;
    if (index !== getDefaultIndex(definition)) values.set(option, index);
  }
  return values;
}

/** The shipped preset a code describes, if it is equivalent to one of them. */
export function findPresetByCode(code: string): SandboxPreset | undefined {
  return SANDBOX_PRESETS.find((preset) => isSamePresetCode(preset.code, code));
}


/**
 * Resolves a localization key the way `Localization.Get` does: an unknown key
 * comes back as the key itself, so a preset whose string the sync script has
 * not picked up still renders something identifiable.
 */
function resolveLocalization(key: string): string {
  return localizationMap[key] ?? key;
}

/** Display name of a preset, e.g. "Chibi Mode!" or "Insane". */
export function getPresetName(preset: SandboxPreset): string {
  return resolveLocalization(preset.nameKey);
}

/**
 * The one-line description the game shows for a preset, or an empty string when
 * it has none. Only the `xuiSandboxOfficial*` presets are described; the five
 * difficulty levels are plain labels in the game's difficulty combobox, so
 * there is no `goDifficultyNDesc` to show and the UI hides the line.
 */
export function getPresetDescription(preset: SandboxPreset): string {
  return localizationMap[`${preset.nameKey}Desc`] ?? "";
}

/** Group heading, matching the `sandboxPresetGroup*` keys the game uses. */
export function getPresetGroupName(group: SandboxPresetGroup): string {
  const key = group === "official" ? "sandboxPresetGroupOfficial" : "sandboxPresetGroupDifficulty";
  return resolveLocalization(key);
}
