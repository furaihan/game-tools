export interface ValueSet {
    displayValues?: string[];
    floatValues?: number[];
    intValues?: number[];
    boolValues?: boolean[];
    displayFormat?: string;
    alternateDisplayValues?: string[];
}

export interface ResolvedValue {
    value: string;
    index: number;
}

import { localizationMap } from './localization';

export function getValueSetValues(valueSetName: string, type: string): ResolvedValue[] {
    const vs = valueSets[valueSetName];
    if (!vs) return [];
    const arr = vs.floatValues ?? vs.intValues ?? vs.boolValues ?? [];
    return arr.map((v, i) => ({ value: String(v), index: i }));
}

export function getValueSetDisplay(valueSetName: string, type: string, index: number): string {
    const vs = valueSets[valueSetName];
    if (!vs) return String(index);

    let rawValue: number | boolean;
    if (vs.floatValues) {
        if (index < 0 || index >= vs.floatValues.length) return String(index);
        rawValue = vs.floatValues[index];
    } else if (vs.intValues) {
        if (index < 0 || index >= vs.intValues.length) return String(index);
        rawValue = vs.intValues[index];
    } else if (vs.boolValues) {
        if (index < 0 || index >= vs.boolValues.length) return String(index);
        rawValue = vs.boolValues[index];
    } else {
        return String(index);
    }

    if (type === 'bool') {
        const key = vs.displayValues?.[index];
        return key ? (localizationMap[key] ?? key) : String(rawValue);
    }

    const altText = vs.alternateDisplayValues?.[index];
    const displayVal = altText ?? (
        type === 'float' ? (rawValue as number) * 100 : String(rawValue)
    );

    const formatKey = vs.displayValues?.[index] ?? vs.displayFormat;
    if (formatKey) {
        const fmt = localizationMap[formatKey] ?? formatKey;
        return fmt.includes('{0}') ? fmt.replace('{0}', String(displayVal)) : fmt;
    }

    return String(displayVal);
}

export const valueSets: Record<string, ValueSet> = {
    DamageValues: {
        displayValues: ["none"],
        floatValues: [0, 0.25, 0.35, 0.5, 0.65, 0.75, 0.85, 1, 1.25, 1.5, 2, 2.5, 3],
        displayFormat: "goPercent"
    },
    DamageValuesNoNone: {
        floatValues: [0.25, 0.35, 0.5, 0.65, 0.75, 0.85, 1, 1.25, 1.5, 2, 2.5, 3],
        displayFormat: "goPercent"
    },
    PlayerSpeedValues: {
        displayValues: ["none"],
        floatValues: [0, 0.25, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 2, 3],
        displayFormat: "goPercent"
    },
    PlayerSpeedValuesWithNone: {
        floatValues: [0.25, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 2, 3],
        displayFormat: "goPercent"
    },
    SpeedValues: {
        displayValues: ["none"],
        floatValues: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3],
        displayFormat: "goPercent"
    },
    StaminaUsage: {
        displayValues: ["none"],
        floatValues: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
        displayFormat: "goPercent"
    },
    LootAbundanceValues: {
        displayValues: ["none"],
        floatValues: [0, 0.25, 0.35, 0.5, 0.65, 0.75, 0.85, 1, 1.25, 1.5, 2, 3, 4, 5],
        displayFormat: "goPercent"
    },
    ZombieRageChance: {
        displayValues: ["none"],
        floatValues: [0, 0.15, 0.3, 0.35, 0.4, 0.5, 0.6, 0.75, 0.9, 1],
        displayFormat: "goPercent"
    },
    ZombieSpeeds: {
        displayValues: ["goZMWalk", "goZMJog", "goZMRun", "goZMSprint", "goZMNightmare"],
        intValues: [0, 1, 2, 3, 4]
    },
    AISmellMode: {
        displayValues: ["none", "goZMWalk", "goZMJog", "goZMRun", "goZMSprint", "goZMNightmare"],
        intValues: [0, 1, 2, 3, 4, 5]
    },
    JumpStrength: {
        displayValues: ["none"],
        floatValues: [0, 0.5, 1, 1.25, 1.5, 2, 3],
        displayFormat: "goPercent"
    },
    StaminaRegen: {
        floatValues: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3],
        displayFormat: "goPercent"
    },
    XPGain: {
        displayValues: ["none"],
        floatValues: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 5],
        displayFormat: "goPercent"
    },
    JarRefund: {
        displayValues: ["none"],
        floatValues: [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        displayFormat: "goPercent"
    },
    BarterValues: {
        displayValues: ["none"],
        floatValues: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4],
        displayFormat: "goPercent"
    },
    DisabledLowDefaultHigh: {
        displayValues: ["goDisabled", "goVeryLow", "goLow", "goDefault", "goHigh", "goVeryHigh"],
        floatValues: [0, 0.25, 0.5, 1, 1.5, 2]
    },
    LowDefaultHigh: {
        displayValues: ["goVeryLow", "goLow", "goDefault", "goHigh", "goVeryHigh"],
        floatValues: [0.25, 0.5, 1, 1.5, 2]
    },
    Encumbrance: {
        displayValues: ["goDisabled", "goLow", "goDefault", "goHigh", "goVeryHigh", "xuiOptionsVideoTexQualityFull"],
        floatValues: [10, 1.35, 1, 0.7, 0.35, 0]
    },
    SkillGainRate: {
        intValues: [1, 2, 3, 4, 5]
    },
    PointsPer: {
        displayValues: ["none"],
        intValues: [0, 1, 2, 3, 4, 5, 6, 7]
    },
    StarterSkillPoints: {
        displayValues: ["none"],
        intValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    BloodMoonFrequency: {
        displayValues: ["goDisabled", "goDay"],
        intValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 20, 30],
        displayFormat: "goDays"
    },
    BloodMoonRange: {
        displayValues: ["goDays", "goDay"],
        intValues: [0, 1, 2, 3, 4, 7, 10, 14, 20],
        displayFormat: "goDays"
    },
    BloodMoonWarning: {
        displayValues: ["goDisabled", "goMorning", "goEvening"],
        intValues: [0, 1, 2]
    },
    BloodMoonCount: {
        intValues: [4, 6, 8, 10, 12, 16, 24, 32, 64],
        displayFormat: "goEnemies"
    },
    AirDrops: {
        displayValues: ["goDisabled", "goAirDropValue"],
        alternateDisplayValues: ["", "1", "1-3", "3", "3-7", "7", "1-7"],
        intValues: [0, 1, 2, 3, 4, 5, 6],
        displayFormat: "goDays"
    },
    AirDropRandomTime: {
        displayValues: ["none", "goMorning", "goMidDayOnly", "goEvening", "goNightOnly", "goAllDay", "goAnyValue"],
        intValues: [0, 1, 2, 3, 4, 5, 6]
    },
    StormFrequency: {
        displayValues: ["none"],
        floatValues: [0, 0.5, 1, 1.5, 2, 3, 4, 5],
        displayFormat: "goPercent"
    },
    QuestPerTier: {
        displayValues: ["none"],
        intValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    },
    QuestPerDay: {
        displayValues: ["goUnlimited"],
        intValues: [-1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    TraderArea: {
        displayValues: ["xuiYes", "goClaimable", "goNotClaimable"],
        intValues: [0, 1, 2]
    },
    TraderResetInterval: {
        displayValues: ["xuiDefault", "goDay"],
        intValues: [-1, 1, 2, 3, 4, 5, 6, 7, 14],
        displayFormat: "goDays"
    },
    ItemTierOptions: {
        intValues: [1, 2, 3, 4, 5, 6]
    },
    DewCollectorInput: {
        displayValues: ["none"],
        floatValues: [0, 1, 2, 3],
        displayFormat: "goPercent"
    },
    ApiaryInput: {
        displayValues: ["none"],
        floatValues: [0, 0.2, 0.4, 0.6, 0.8, 1, 1.5, 2, 3],
        displayFormat: "goPercent"
    },
    CollectorOutput: {
        floatValues: [1, 2, 3, 4, 5],
        displayFormat: "goPercent"
    },
    BackpackCrafting: {
        displayValues: ["xuiNo", "xuiYes", "goLimited", "goWorkbenchOnly"],
        intValues: [0, 1, 2, 3]
    },
    DeathPenalty: {
        displayValues: ["none", "goXPOnly", "goInjured", "goPermaDeath"],
        intValues: [0, 1, 2, 3]
    },
    DropOnDeath: {
        displayValues: ["none", "lblAll", "goToolbelt", "goBackpack", "goEquipment", "goCarriedOnly", "goDeleteAll"],
        intValues: [0, 1, 2, 3, 4, 5, 6]
    },
    DropOnQuit: {
        displayValues: ["none", "lblAll", "goToolbelt", "goBackpack", "goEquipment", "goCarriedOnly"],
        intValues: [0, 1, 2, 3, 4, 5]
    },
    LoseItemsOnDeathType: {
        displayValues: ["none", "lblAll", "goToolbelt", "goBackpack", "goEquipment", "goCarriedOnly"],
        intValues: [0, 1, 2, 3, 4, 5]
    },
    DegradeItemsOnDeath: {
        displayValues: ["none", "xuiDurability", "xuiMaxDurability", "xuiBoth"],
        intValues: [0, 1, 2, 3]
    },
    TraderHourPresets: {
        displayValues: ["xuiDefault", "goMorning", "goMidDayOnly", "goEvening", "goNightOnly", "goOnlyClosedOnBM", "goAlwaysOpen"],
        intValues: [0, 1, 2, 3, 4, 5, 6]
    },
    YesNo: {
        displayValues: ["xuiNo", "xuiYes"],
        boolValues: [false, true]
    },
    Celebrate: {
        displayValues: ["xuiNo", "xuiYes", "goHeadshotOnly"],
        intValues: [0, 1, 2]
    },
    ShowXP: {
        displayValues: ["lblAll", "goBarOnly", "goNotificationsOnly", "none"],
        intValues: [0, 1, 2, 3]
    },
    HeadshotMode: {
        displayValues: ["none", "goHeadshotOnly", "goHeadshotFinisher"],
        intValues: [0, 1, 2]
    },
    MaxEnemyType: {
        displayValues: ["goNormals", "goStrongs", "goSpecials", "goFerals", "goRadiated", "goElites"],
        intValues: [0, 1, 2, 3, 4, 5]
    },
    MaxTechType: {
        displayValues: ["none", "goTech0", "goTech1", "goTech2", "goTech3"],
        intValues: [0, 1, 2, 3, 4]
    },
    LoseItemCount: {
        displayValues: ["1-3", "1-5", "1-10", "1-20", "3-5", "5-7", "5-10", "7-10", "10-15", "15-20"],
        intValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    DayNightLength: {
        intValues: [10, 20, 30, 40, 50, 60, 90, 120]
    },
    DayLightLength: {
        displayValues: ["goAlwaysNight", "4", "6", "8", "10", "12", "14", "16", "18", "20", "goAlwaysDay"],
        intValues: [0, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24]
    },
    LootRespawnDays: {
        displayValues: ["goDisabled"],
        intValues: [-1, 5, 7, 10, 15, 20, 30, 40, 50]
    },
    MaxChunkAge: {
        displayValues: ["goDisabled"],
        intValues: [-1, 1, 3, 5, 7, 10, 20, 30, 40, 50, 75, 100]
    },
    Gravity: {
        floatValues: [0.5, 0.6, 0.7, 0.8, 0.9, 1],
        displayFormat: "goPercent"
    },
    SlowToFast: {
        displayValues: ["xuiDefault", "goVerySlow", "goSlow", "goNormal", "goFast", "goVeryFast"],
        intValues: [0, 1, 2, 3, 4, 5]
    },
    BiomeEnemyDensity: {
        displayValues: ["xuiDefault", "goVeryLow", "goLow", "goMedium", "goHigh", "goVeryHigh"],
        intValues: [0, 1, 2, 3, 4, 5]
    },
    SmeltingType: {
        displayValues: ["goSmelter", "lblContextActionRecipes"],
        boolValues: [false, true]
    },
    RepairTypes: {
        displayValues: ["none", "goRepairOnly", "goCombineOnly", "xuiBoth"],
        intValues: [0, 1, 2, 3]
    },
    MaxDegradationAmounts: {
        displayValues: ["none"],
        floatValues: [0, 0.05, 0.1, 0.15, 0.2, 0.25],
        displayFormat: "goPercent"
    },
    CropGrowthSpeed: {
        displayValues: ["none", "xuiInstant"],
        floatValues: [1000, 0, 0.2, 0.5, 0.75, 1, 1.5, 2, 3],
        displayFormat: "goPercent"
    },
    ZombieFeralSense: {
        displayValues: ["goDisabled", "goZMDay", "goZMNight", "goZMAll"],
        intValues: [0, 1, 2, 3]
    },
    ShowLocationTypes: {
        displayValues: ["xuiNo", "xuiYes", "goNameOnly"],
        intValues: [0, 1, 2]
    }
};
