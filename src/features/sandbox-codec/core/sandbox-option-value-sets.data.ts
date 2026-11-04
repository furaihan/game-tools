import { SandboxOption } from "./sandbox-option.enum";
import type { SandboxOptionValueSet } from "./sandbox-option-value-set.types";

/**
 * All registered value sets, keyed by name (matches the C# `SandboxOptionManager.ValueSets` dict).
 * Each value set defines the selectable steps for one or more options, plus how to
 * render each step (localization key / format string).
 */
export const SANDBOX_OPTION_VALUE_SETS: Record<string, SandboxOptionValueSet> = {
  DamageValues: {
    type: "float",
    values: [0, 0.25, 0.35, 0.5, 0.65, 0.75, 0.85, 1, 1.25, 1.5, 2, 2.5, 3],
    displayValues: ["none"],
    displayFormat: "goPercent",
  },
  DamageValuesNoNone: {
    type: "float",
    values: [0.25, 0.35, 0.5, 0.65, 0.75, 0.85, 1, 1.25, 1.5, 2, 2.5, 3],
    displayFormat: "goPercent",
  },
  PlayerSpeedValues: {
    type: "float",
    values: [0, 0.25, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 2, 3],
    displayValues: ["none"],
    displayFormat: "goPercent",
  },
  PlayerSpeedValuesWithNone: {
    type: "float",
    values: [0.25, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 2, 3],
    displayFormat: "goPercent",
  },
  SpeedValues: {
    type: "float",
    values: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3],
    displayValues: ["none"],
    displayFormat: "goPercent",
  },
  StaminaUsage: {
    type: "float",
    values: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    displayValues: ["none"],
    displayFormat: "goPercent",
  },
  LootAbundanceValues: {
    type: "float",
    values: [0, 0.25, 0.35, 0.5, 0.65, 0.75, 0.85, 1, 1.25, 1.5, 2, 3, 4, 5],
    displayValues: ["none"],
    displayFormat: "goPercent",
  },
  ZombieRageChance: {
    type: "float",
    values: [0, 0.15, 0.3, 0.35, 0.4, 0.5, 0.6, 0.75, 0.9, 1],
    displayValues: ["none"],
    displayFormat: "goPercent",
  },
  ZombieSpeeds: {
    type: "int",
    values: [0, 1, 2, 3, 4],
    displayValues: ["goZMWalk", "goZMJog", "goZMRun", "goZMSprint", "goZMNightmare"],
  },
  AISmellMode: {
    type: "int",
    values: [0, 1, 2, 3, 4, 5],
    displayValues: ["none", "goZMWalk", "goZMJog", "goZMRun", "goZMSprint", "goZMNightmare"],
  },
  JumpStrength: {
    type: "float",
    values: [0, 0.5, 1, 1.25, 1.5, 2, 3],
    displayValues: ["none"],
    displayFormat: "goPercent",
  },
  StaminaRegen: {
    type: "float",
    values: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3],
    displayFormat: "goPercent",
  },
  XPGain: {
    type: "float",
    values: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 5],
    displayValues: ["none"],
    displayFormat: "goPercent",
  },
  JarRefund: {
    type: "float",
    values: [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    displayValues: ["none"],
    displayFormat: "goPercent",
  },
  BarterValues: {
    type: "float",
    values: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4],
    displayValues: ["none"],
    displayFormat: "goPercent",
  },
  DisabledLowDefaultHigh: {
    type: "float",
    values: [0, 0.25, 0.5, 1, 1.5, 2],
    displayValues: ["goDisabled", "goVeryLow", "goLow", "goDefault", "goHigh", "goVeryHigh"],
  },
  LowDefaultHigh: {
    type: "float",
    values: [0.25, 0.5, 1, 1.5, 2],
    displayValues: ["goVeryLow", "goLow", "goDefault", "goHigh", "goVeryHigh"],
  },
  Encumbrance: {
    type: "float",
    values: [10, 1.35, 1, 0.7, 0.35, 0],
    displayValues: ["goDisabled", "goLow", "goDefault", "goHigh", "goVeryHigh", "xuiOptionsVideoTexQualityFull"],
  },
  SkillGainRate: {
    type: "int",
    values: [1, 2, 3, 4, 5],
  },
  PointsPer: {
    type: "int",
    values: [0, 1, 2, 3, 4, 5, 6, 7],
    displayValues: ["none"],
  },
  StarterSkillPoints: {
    type: "int",
    values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    displayValues: ["none"],
  },
  BloodMoonFrequency: {
    type: "int",
    values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 20, 30],
    displayValues: ["goDisabled", "goDay"],
    displayFormat: "goDays",
  },
  BloodMoonRange: {
    type: "int",
    values: [0, 1, 2, 3, 4, 7, 10, 14, 20],
    displayValues: ["goDays", "goDay"],
    displayFormat: "goDays",
  },
  BloodMoonWarning: {
    type: "int",
    values: [0, 1, 2],
    displayValues: ["goDisabled", "goMorning", "goEvening"],
  },
  BloodMoonCount: {
    type: "int",
    values: [4, 6, 8, 10, 12, 16, 24, 32, 64],
    displayFormat: "goEnemies",
  },
  AirDrops: {
    type: "int",
    values: [0, 1, 2, 3, 4, 5, 6],
    displayValues: ["goDisabled", "goAirDropValue"],
    alternateDisplayValues: ["", "1", "1-3", "3", "3-7", "7", "1-7"],
    displayFormat: "goDays",
  },
  AirDropRandomTime: {
    type: "int",
    values: [0, 1, 2, 3, 4, 5, 6],
    displayValues: ["none", "goMorning", "goMidDayOnly", "goEvening", "goNightOnly", "goAllDay", "goAnyValue"],
  },
  StormFrequency: {
    type: "float",
    values: [0, 0.5, 1, 1.5, 2, 3, 4, 5],
    displayValues: ["none"],
    displayFormat: "goPercent",
  },
  QuestPerTier: {
    type: "int",
    values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    displayValues: ["none"],
  },
  QuestPerDay: {
    type: "int",
    values: [-1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    displayValues: ["goUnlimited"],
  },
  TraderArea: {
    type: "int",
    values: [0, 1, 2],
    displayValues: ["xuiYes", "goClaimable", "goNotClaimable"],
  },
  TraderResetInterval: {
    type: "int",
    values: [-1, 1, 2, 3, 4, 5, 6, 7, 14],
    displayValues: ["xuiDefault", "goDay"],
    displayFormat: "goDays",
  },
  ItemTierOptions: {
    type: "int",
    values: [-1, 1, 2, 3, 4, 5, 6],
    displayValues: ["xuiDefault"],
  },
  DewCollectorInput: {
    type: "float",
    values: [0, 1, 2, 3],
    displayValues: ["none"],
    displayFormat: "goPercent",
  },
  ApiaryInput: {
    type: "float",
    values: [0, 0.2, 0.4, 0.6, 0.8, 1, 1.5, 2, 3],
    displayValues: ["none"],
    displayFormat: "goPercent",
  },
  CollectorOutput: {
    type: "float",
    values: [1, 2, 3, 4, 5],
    displayFormat: "goPercent",
  },
  BackpackCrafting: {
    type: "int",
    values: [0, 1, 2, 3],
    displayValues: ["xuiNo", "xuiYes", "goLimited", "goWorkbenchOnly"],
  },
  DeathPenalty: {
    type: "int",
    values: [0, 1, 2, 3],
    displayValues: ["none", "goXPOnly", "goInjured", "goPermaDeath"],
  },
  DropOnDeath: {
    type: "int",
    values: [0, 1, 2, 3, 4, 5, 6],
    displayValues: ["none", "lblAll", "goToolbelt", "goBackpack", "goEquipment", "goCarriedOnly", "goDeleteAll"],
  },
  DropOnQuit: {
    type: "int",
    values: [0, 1, 2, 3, 4, 5],
    displayValues: ["none", "lblAll", "goToolbelt", "goBackpack", "goEquipment", "goCarriedOnly"],
  },
  LoseItemsOnDeathType: {
    type: "int",
    values: [0, 1, 2, 3, 4, 5],
    displayValues: ["none", "lblAll", "goToolbelt", "goBackpack", "goEquipment", "goCarriedOnly"],
  },
  DegradeItemsOnDeath: {
    type: "int",
    values: [0, 1, 2, 3],
    displayValues: ["none", "xuiDurability", "xuiMaxDurability", "xuiBoth"],
  },
  TraderHourPresets: {
    type: "int",
    values: [0, 1, 2, 3, 4, 5, 6],
    displayValues: ["xuiDefault", "goMorning", "goMidDayOnly", "goEvening", "goNightOnly", "goOnlyClosedOnBM", "goAlwaysOpen"],
  },
  YesNo: {
    type: "bool",
    values: [false, true],
    displayValues: ["xuiNo", "xuiYes"],
  },
  Celebrate: {
    type: "int",
    values: [0, 1, 2],
    displayValues: ["xuiNo", "xuiYes", "goHeadshotOnly"],
  },
  ShowXP: {
    type: "int",
    values: [0, 1, 2, 3],
    displayValues: ["lblAll", "goBarOnly", "goNotificationsOnly", "none"],
  },
  HeadshotMode: {
    type: "int",
    values: [0, 1, 2],
    displayValues: ["none", "goHeadshotOnly", "goHeadshotFinisher"],
  },
  MaxEnemyType: {
    type: "int",
    values: [0, 1, 2, 3, 4, 5],
    displayValues: ["goNormals", "goStrongs", "goSpecials", "goFerals", "goRadiated", "goElites"],
  },
  MaxTechType: {
    type: "int",
    values: [0, 1, 2, 3, 4],
    displayValues: ["none", "goTech0", "goTech1", "goTech2", "goTech3"],
  },
  LoseItemCount: {
    type: "int",
    values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    displayValues: ["1-3", "1-5", "1-10", "1-20", "3-5", "5-7", "5-10", "7-10", "10-15", "15-20"],
  },
  DayNightLength: {
    type: "int",
    values: [10, 20, 30, 40, 50, 60, 90, 120],
  },
  DayLightLength: {
    type: "int",
    values: [0, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24],
    displayValues: ["goAlwaysNight", "4", "6", "8", "10", "12", "14", "16", "18", "20", "goAlwaysDay"],
  },
  LootRespawnDays: {
    type: "int",
    values: [-1, 5, 7, 10, 15, 20, 30, 40, 50],
    displayValues: ["goDisabled"],
  },
  MaxChunkAge: {
    type: "int",
    values: [-1, 1, 3, 5, 7, 10, 20, 30, 40, 50, 75, 100],
    displayValues: ["goDisabled"],
  },
  Gravity: {
    type: "float",
    values: [0.5, 0.6, 0.7, 0.8, 0.9, 1],
    displayFormat: "goPercent",
  },
  SlowToFast: {
    type: "int",
    values: [0, 1, 2, 3, 4, 5],
    displayValues: ["xuiDefault", "goVerySlow", "goSlow", "goNormal", "goFast", "goVeryFast"],
  },
  BiomeEnemyDensity: {
    type: "int",
    values: [-1, 0, 1, 2, 3, 4, 5],
    displayValues: ["none", "xuiDefault", "goVeryLow", "goLow", "goMedium", "goHigh", "goVeryHigh"],
  },
  SmeltingType: {
    type: "bool",
    values: [false, true],
    displayValues: ["goSmelter", "lblContextActionRecipes"],
  },
  RepairTypes: {
    type: "int",
    values: [0, 1, 2, 3],
    displayValues: ["none", "goRepairOnly", "goCombineOnly", "xuiBoth"],
  },
  MaxDegradationAmounts: {
    type: "float",
    values: [0, 0.05, 0.1, 0.15, 0.2, 0.25],
    displayValues: ["none"],
    displayFormat: "goPercent",
  },
  CropGrowthSpeed: {
    type: "float",
    values: [1000, 0, 0.2, 0.5, 0.75, 1, 1.5, 2, 3],
    displayValues: ["none", "xuiInstant"],
    displayFormat: "goPercent",
  },
  ZombieFeralSense: {
    type: "int",
    values: [0, 1, 2, 3],
    displayValues: ["goDisabled", "goZMDay", "goZMNight", "goZMAll"],
  },
  FullChickenStressEvent: {
    type: "int",
    values: [0, 1, 2, 3, 4, 5],
    displayValues: ["none", "goRandom", "goDropChicken", "goAngryChicken", "goZombieHorde", "goMurderChickens"],
  },
  ShowLocationTypes: {
    type: "int",
    values: [0, 1, 2],
    displayValues: ["xuiNo", "xuiYes", "goNameOnly"],
  },
  MaxStackSize: {
    type: "float",
    values: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5],
    displayFormat: "goPercent",
  },
};
