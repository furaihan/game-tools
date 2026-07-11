export type OptionType = 'float' | 'int' | 'bool';

export interface SandboxOptionValue {
    code: string;
    value: string;
    index: number;
}

export interface SandboxOptionDependency {
    sourceOptionId: number;
    triggerValueIndices: number[];
    targetOptionIds: number[];
}

export interface SandboxOption {
    id: number;
    enumName: string;
    displayName: string;
    category: string;
    type: OptionType;
    defaultCode: string;
    defaultValueIndex: number;
    valueSet: SandboxOptionValue[];
    uiSection: boolean;
    dependencies: SandboxOptionDependency[];
}

export const sandboxOptions: SandboxOption[] = [
    {
        "id": 0,
        "enumName": "RangedDamage",
        "displayName": "Ranged Damage",
        "category": "General",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "2.5",
                "index": 11
            },
            {
                "code": "M",
                "value": "3",
                "index": 12
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 1,
        "enumName": "MeleeDamage",
        "displayName": "Melee Damage",
        "category": "General",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "2.5",
                "index": 11
            },
            {
                "code": "M",
                "value": "3",
                "index": 12
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 2,
        "enumName": "BlockDamage",
        "displayName": "Block Damage",
        "category": "General",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "2.5",
                "index": 11
            },
            {
                "code": "M",
                "value": "3",
                "index": 12
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 3,
        "enumName": "TerrainDamage",
        "displayName": "Terrain Damage",
        "category": "General",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "2.5",
                "index": 11
            },
            {
                "code": "M",
                "value": "3",
                "index": 12
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 4,
        "enumName": "HeadshotMultiplier",
        "displayName": "Headshot Multiplier",
        "category": "General",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "2.5",
                "index": 11
            },
            {
                "code": "M",
                "value": "3",
                "index": 12
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 17,
        "enumName": "IncomingDamage",
        "displayName": "Incoming Damage",
        "category": "General",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "2.5",
                "index": 11
            },
            {
                "code": "M",
                "value": "3",
                "index": 12
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 6,
        "enumName": "WalkSpeed",
        "displayName": "Walk Speed",
        "category": "General",
        "type": "float",
        "defaultCode": "G",
        "defaultValueIndex": 6,
        "valueSet": [
            {
                "code": "A",
                "value": "0.25",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.5",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.6",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.7",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.8",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.9",
                "index": 5
            },
            {
                "code": "G",
                "value": "1",
                "index": 6
            },
            {
                "code": "H",
                "value": "1.1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.2",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.3",
                "index": 9
            },
            {
                "code": "K",
                "value": "1.4",
                "index": 10
            },
            {
                "code": "L",
                "value": "1.5",
                "index": 11
            },
            {
                "code": "M",
                "value": "2",
                "index": 12
            },
            {
                "code": "N",
                "value": "3",
                "index": 13
            }
        ],
        "uiSection": true,
        "dependencies": []
    },
    {
        "id": 7,
        "enumName": "RunSpeed",
        "displayName": "Run Speed",
        "category": "General",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.5",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.6",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.7",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.8",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.9",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.1",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.2",
                "index": 9
            },
            {
                "code": "K",
                "value": "1.3",
                "index": 10
            },
            {
                "code": "L",
                "value": "1.4",
                "index": 11
            },
            {
                "code": "M",
                "value": "1.5",
                "index": 12
            },
            {
                "code": "N",
                "value": "2",
                "index": 13
            },
            {
                "code": "O",
                "value": "3",
                "index": 14
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 5,
        "enumName": "CrouchSpeed",
        "displayName": "Crouch Speed",
        "category": "General",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.5",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.6",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.7",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.8",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.9",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.1",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.2",
                "index": 9
            },
            {
                "code": "K",
                "value": "1.3",
                "index": 10
            },
            {
                "code": "L",
                "value": "1.4",
                "index": 11
            },
            {
                "code": "M",
                "value": "1.5",
                "index": 12
            },
            {
                "code": "N",
                "value": "2",
                "index": 13
            },
            {
                "code": "O",
                "value": "3",
                "index": 14
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 112,
        "enumName": "CrouchRunSpeed",
        "displayName": "Crouch Run Speed",
        "category": "General",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.5",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.6",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.7",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.8",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.9",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.1",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.2",
                "index": 9
            },
            {
                "code": "K",
                "value": "1.3",
                "index": 10
            },
            {
                "code": "L",
                "value": "1.4",
                "index": 11
            },
            {
                "code": "M",
                "value": "1.5",
                "index": 12
            },
            {
                "code": "N",
                "value": "2",
                "index": 13
            },
            {
                "code": "O",
                "value": "3",
                "index": 14
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 8,
        "enumName": "JumpStrength",
        "displayName": "Jump Height",
        "category": "General",
        "type": "float",
        "defaultCode": "C",
        "defaultValueIndex": 2,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.5",
                "index": 1
            },
            {
                "code": "C",
                "value": "1",
                "index": 2
            },
            {
                "code": "D",
                "value": "1.25",
                "index": 3
            },
            {
                "code": "E",
                "value": "1.5",
                "index": 4
            },
            {
                "code": "F",
                "value": "2",
                "index": 5
            },
            {
                "code": "G",
                "value": "3",
                "index": 6
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 10,
        "enumName": "StaminaRegen",
        "displayName": "Stamina Regen",
        "category": "General",
        "type": "float",
        "defaultCode": "D",
        "defaultValueIndex": 3,
        "valueSet": [
            {
                "code": "A",
                "value": "0.25",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.5",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.75",
                "index": 2
            },
            {
                "code": "D",
                "value": "1",
                "index": 3
            },
            {
                "code": "E",
                "value": "1.25",
                "index": 4
            },
            {
                "code": "F",
                "value": "1.5",
                "index": 5
            },
            {
                "code": "G",
                "value": "2",
                "index": 6
            },
            {
                "code": "H",
                "value": "3",
                "index": 7
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 9,
        "enumName": "StaminaUsage",
        "displayName": "Stamina Usage",
        "category": "General",
        "type": "float",
        "defaultCode": "E",
        "defaultValueIndex": 4,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.5",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.75",
                "index": 3
            },
            {
                "code": "E",
                "value": "1",
                "index": 4
            },
            {
                "code": "F",
                "value": "1.25",
                "index": 5
            },
            {
                "code": "G",
                "value": "1.5",
                "index": 6
            },
            {
                "code": "H",
                "value": "1.75",
                "index": 7
            },
            {
                "code": "I",
                "value": "2",
                "index": 8
            }
        ],
        "uiSection": false,
        "dependencies": [
            {
                "sourceOptionId": 9,
                "triggerValueIndices": [
                    0
                ],
                "targetOptionIds": [
                    10
                ]
            }
        ]
    },
    {
        "id": 18,
        "enumName": "XPMultiplier",
        "displayName": "XP Multiplier",
        "category": "General",
        "type": "float",
        "defaultCode": "E",
        "defaultValueIndex": 4,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.5",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.75",
                "index": 3
            },
            {
                "code": "E",
                "value": "1",
                "index": 4
            },
            {
                "code": "F",
                "value": "1.25",
                "index": 5
            },
            {
                "code": "G",
                "value": "1.5",
                "index": 6
            },
            {
                "code": "H",
                "value": "1.75",
                "index": 7
            },
            {
                "code": "I",
                "value": "2",
                "index": 8
            },
            {
                "code": "J",
                "value": "3",
                "index": 9
            },
            {
                "code": "K",
                "value": "5",
                "index": 10
            }
        ],
        "uiSection": true,
        "dependencies": [
            {
                "sourceOptionId": 18,
                "triggerValueIndices": [
                    0
                ],
                "targetOptionIds": [
                    19
                ]
            }
        ]
    },
    {
        "id": 19,
        "enumName": "ShowXP",
        "displayName": "Show XP",
        "category": "General",
        "type": "int",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 11,
        "enumName": "PlayerLevelBonusApplied",
        "displayName": "Level Health/Stam Bonus",
        "category": "General",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 116,
        "enumName": "SkillGainRate",
        "displayName": "Skill Gain Rate",
        "category": "General",
        "type": "int",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "1",
                "index": 0
            },
            {
                "code": "B",
                "value": "2",
                "index": 1
            },
            {
                "code": "C",
                "value": "3",
                "index": 2
            },
            {
                "code": "D",
                "value": "4",
                "index": 3
            },
            {
                "code": "E",
                "value": "5",
                "index": 4
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 117,
        "enumName": "SkillPointsPerLevel",
        "displayName": "Skill Gain Amount",
        "category": "General",
        "type": "int",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            },
            {
                "code": "G",
                "value": "6",
                "index": 6
            },
            {
                "code": "H",
                "value": "7",
                "index": 7
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 26,
        "enumName": "DeathPenalty",
        "displayName": "Death Penalty",
        "category": "General",
        "type": "int",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            }
        ],
        "uiSection": true,
        "dependencies": []
    },
    {
        "id": 22,
        "enumName": "LoseItemsOnDeathType",
        "displayName": "Lose Items Death Type",
        "category": "General",
        "type": "int",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            }
        ],
        "uiSection": false,
        "dependencies": [
            {
                "sourceOptionId": 22,
                "triggerValueIndices": [
                    0
                ],
                "targetOptionIds": [
                    23
                ]
            }
        ]
    },
    {
        "id": 23,
        "enumName": "LoseItemsOnDeathCount",
        "displayName": "Lose Items Death Count",
        "category": "General",
        "type": "int",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "1",
                "index": 0
            },
            {
                "code": "B",
                "value": "2",
                "index": 1
            },
            {
                "code": "C",
                "value": "3",
                "index": 2
            },
            {
                "code": "D",
                "value": "4",
                "index": 3
            },
            {
                "code": "E",
                "value": "5",
                "index": 4
            },
            {
                "code": "F",
                "value": "6",
                "index": 5
            },
            {
                "code": "G",
                "value": "7",
                "index": 6
            },
            {
                "code": "H",
                "value": "8",
                "index": 7
            },
            {
                "code": "I",
                "value": "9",
                "index": 8
            },
            {
                "code": "J",
                "value": "10",
                "index": 9
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 24,
        "enumName": "DegradeItemsOnDeath",
        "displayName": "Degrade Items On Death",
        "category": "General",
        "type": "int",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            }
        ],
        "uiSection": false,
        "dependencies": [
            {
                "sourceOptionId": 24,
                "triggerValueIndices": [
                    0
                ],
                "targetOptionIds": [
                    25
                ]
            }
        ]
    },
    {
        "id": 25,
        "enumName": "DegradeAmountOnDeath",
        "displayName": "Degrade Amount On Death",
        "category": "General",
        "type": "float",
        "defaultCode": "C",
        "defaultValueIndex": 2,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.05",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.1",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.15",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.2",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.25",
                "index": 5
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 27,
        "enumName": "DropOnDeath",
        "displayName": "Drop On Death",
        "category": "General",
        "type": "int",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            },
            {
                "code": "G",
                "value": "6",
                "index": 6
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 28,
        "enumName": "DropOnQuit",
        "displayName": "Drop On Quit",
        "category": "General",
        "type": "int",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 29,
        "enumName": "InfectionRate",
        "displayName": "Infection Rate",
        "category": "General",
        "type": "float",
        "defaultCode": "E",
        "defaultValueIndex": 4,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.5",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.75",
                "index": 3
            },
            {
                "code": "E",
                "value": "1",
                "index": 4
            },
            {
                "code": "F",
                "value": "1.25",
                "index": 5
            },
            {
                "code": "G",
                "value": "1.5",
                "index": 6
            },
            {
                "code": "H",
                "value": "2",
                "index": 7
            },
            {
                "code": "I",
                "value": "3",
                "index": 8
            }
        ],
        "uiSection": true,
        "dependencies": []
    },
    {
        "id": 15,
        "enumName": "NewbieCoat",
        "displayName": "Allow Newbie Coat",
        "category": "General",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 20,
        "enumName": "EncumbranceModifier",
        "displayName": "Encumbrance Modifier",
        "category": "General",
        "type": "float",
        "defaultCode": "C",
        "defaultValueIndex": 2,
        "valueSet": [
            {
                "code": "A",
                "value": "10",
                "index": 0
            },
            {
                "code": "B",
                "value": "1.35",
                "index": 1
            },
            {
                "code": "C",
                "value": "1",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.7",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.35",
                "index": 4
            },
            {
                "code": "F",
                "value": "0",
                "index": 5
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 12,
        "enumName": "JarRefund",
        "displayName": "Jar Refund",
        "category": "General",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.05",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.1",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.2",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.3",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.4",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.5",
                "index": 6
            },
            {
                "code": "H",
                "value": "0.6",
                "index": 7
            },
            {
                "code": "I",
                "value": "0.7",
                "index": 8
            },
            {
                "code": "J",
                "value": "0.8",
                "index": 9
            },
            {
                "code": "K",
                "value": "0.9",
                "index": 10
            },
            {
                "code": "L",
                "value": "1",
                "index": 11
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 30,
        "enumName": "EnemySpawnMode",
        "displayName": "Enemy Spawn",
        "category": "Entities",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": [
            {
                "sourceOptionId": 30,
                "triggerValueIndices": [
                    0
                ],
                "targetOptionIds": [
                    43,
                    46,
                    44,
                    45,
                    31,
                    42,
                    32,
                    33,
                    16,
                    13,
                    14,
                    34,
                    35,
                    36,
                    37,
                    38,
                    39,
                    41
                ]
            }
        ]
    },
    {
        "id": 43,
        "enumName": "MaxEnemyTier",
        "displayName": "Max Enemy Type",
        "category": "Entities",
        "type": "int",
        "defaultCode": "F",
        "defaultValueIndex": 5,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 46,
        "enumName": "BiomeEnemyDensity",
        "displayName": "Biome Enemy Density",
        "category": "Entities",
        "type": "int",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 44,
        "enumName": "BiomeZombieRespawn",
        "displayName": "Biome Enemy Respawn",
        "category": "Entities",
        "type": "int",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 45,
        "enumName": "BiomeAnimalRespawn",
        "displayName": "Biome Animal Respawn",
        "category": "Entities",
        "type": "int",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 31,
        "enumName": "EntityDamage",
        "displayName": "Entity Damage",
        "category": "Entities",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "2.5",
                "index": 11
            },
            {
                "code": "M",
                "value": "3",
                "index": 12
            }
        ],
        "uiSection": true,
        "dependencies": []
    },
    {
        "id": 42,
        "enumName": "EntityIncomingDamage",
        "displayName": "Entity Incoming Damage",
        "category": "Entities",
        "type": "float",
        "defaultCode": "G",
        "defaultValueIndex": 6,
        "valueSet": [
            {
                "code": "A",
                "value": "0.25",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.35",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.5",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.65",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.75",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.85",
                "index": 5
            },
            {
                "code": "G",
                "value": "1",
                "index": 6
            },
            {
                "code": "H",
                "value": "1.25",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.5",
                "index": 8
            },
            {
                "code": "J",
                "value": "2",
                "index": 9
            },
            {
                "code": "K",
                "value": "2.5",
                "index": 10
            },
            {
                "code": "L",
                "value": "3",
                "index": 11
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 32,
        "enumName": "BlockDamageAI",
        "displayName": "Entity Block Damage",
        "category": "Entities",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "2.5",
                "index": 11
            },
            {
                "code": "M",
                "value": "3",
                "index": 12
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 33,
        "enumName": "BloodDamageAIBM",
        "displayName": "Blood Moon Block Damage",
        "category": "Entities",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "2.5",
                "index": 11
            },
            {
                "code": "M",
                "value": "3",
                "index": 12
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 16,
        "enumName": "HeadshotMode",
        "displayName": "Headshot Mode",
        "category": "Entities",
        "type": "int",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 13,
        "enumName": "ShowHealthBars",
        "displayName": "Entity Health Bars",
        "category": "Entities",
        "type": "bool",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 14,
        "enumName": "ShowEnemyDamage",
        "displayName": "Show Entity Damage",
        "category": "Entities",
        "type": "bool",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 34,
        "enumName": "ZombieMove",
        "displayName": "Zombie Day Speed",
        "category": "Entities",
        "type": "int",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            }
        ],
        "uiSection": true,
        "dependencies": []
    },
    {
        "id": 35,
        "enumName": "ZombieMoveNight",
        "displayName": "Zombie Night Speed",
        "category": "Entities",
        "type": "int",
        "defaultCode": "D",
        "defaultValueIndex": 3,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 36,
        "enumName": "ZombieFeralMove",
        "displayName": "Zombie Feral Speed",
        "category": "Entities",
        "type": "int",
        "defaultCode": "D",
        "defaultValueIndex": 3,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 37,
        "enumName": "ZombieBMMove",
        "displayName": "Zombie Blood Moon Speed",
        "category": "Entities",
        "type": "int",
        "defaultCode": "D",
        "defaultValueIndex": 3,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 38,
        "enumName": "ZombieFeralSense",
        "displayName": "Zombie Feral Sense",
        "category": "Entities",
        "type": "int",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            }
        ],
        "uiSection": true,
        "dependencies": []
    },
    {
        "id": 39,
        "enumName": "AISmellMode",
        "displayName": "Zombie AI Smell Mode",
        "category": "Entities",
        "type": "int",
        "defaultCode": "D",
        "defaultValueIndex": 3,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 41,
        "enumName": "ZombieRageChance",
        "displayName": "Zombie Rage Chance",
        "category": "Entities",
        "type": "float",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.15",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.3",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.35",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.4",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.5",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.6",
                "index": 6
            },
            {
                "code": "H",
                "value": "0.75",
                "index": 7
            },
            {
                "code": "I",
                "value": "0.9",
                "index": 8
            },
            {
                "code": "J",
                "value": "1",
                "index": 9
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 40,
        "enumName": "AllowZombieDigging",
        "displayName": "Allow Zombie Digging",
        "category": "Entities",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 47,
        "enumName": "ZombiesEatAnimals",
        "displayName": "Zombies Eat Animals",
        "category": "Entities",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 60,
        "enumName": "GlobalGSModifier",
        "displayName": "Global GameStage",
        "category": "World",
        "type": "float",
        "defaultCode": "C",
        "defaultValueIndex": 2,
        "valueSet": [
            {
                "code": "A",
                "value": "0.25",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.5",
                "index": 1
            },
            {
                "code": "C",
                "value": "1",
                "index": 2
            },
            {
                "code": "D",
                "value": "1.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "2",
                "index": 4
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 61,
        "enumName": "BiomeGSModifier",
        "displayName": "Biome GameStage",
        "category": "World",
        "type": "float",
        "defaultCode": "C",
        "defaultValueIndex": 2,
        "valueSet": [
            {
                "code": "A",
                "value": "0.25",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.5",
                "index": 1
            },
            {
                "code": "C",
                "value": "1",
                "index": 2
            },
            {
                "code": "D",
                "value": "1.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "2",
                "index": 4
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 55,
        "enumName": "BiomeProgression",
        "displayName": "Biome Progression",
        "category": "World",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 56,
        "enumName": "TemperatureSurvival",
        "displayName": "Temperature Survival",
        "category": "World",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 74,
        "enumName": "MaxTechType",
        "displayName": "Max Tech Type",
        "category": "World",
        "type": "int",
        "defaultCode": "E",
        "defaultValueIndex": 4,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 73,
        "enumName": "WorkstationsInTheWild",
        "displayName": "Workstations in the Wild",
        "category": "World",
        "type": "float",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.05",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.1",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.2",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.3",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.4",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.5",
                "index": 6
            },
            {
                "code": "H",
                "value": "0.6",
                "index": 7
            },
            {
                "code": "I",
                "value": "0.7",
                "index": 8
            },
            {
                "code": "J",
                "value": "0.8",
                "index": 9
            },
            {
                "code": "K",
                "value": "0.9",
                "index": 10
            },
            {
                "code": "L",
                "value": "1",
                "index": 11
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 48,
        "enumName": "BloodMoonFrequency",
        "displayName": "Blood Moon Frequency",
        "category": "World",
        "type": "int",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            },
            {
                "code": "G",
                "value": "6",
                "index": 6
            },
            {
                "code": "H",
                "value": "7",
                "index": 7
            },
            {
                "code": "I",
                "value": "8",
                "index": 8
            },
            {
                "code": "J",
                "value": "9",
                "index": 9
            },
            {
                "code": "K",
                "value": "10",
                "index": 10
            },
            {
                "code": "L",
                "value": "14",
                "index": 11
            },
            {
                "code": "M",
                "value": "20",
                "index": 12
            },
            {
                "code": "N",
                "value": "30",
                "index": 13
            }
        ],
        "uiSection": true,
        "dependencies": [
            {
                "sourceOptionId": 48,
                "triggerValueIndices": [
                    0
                ],
                "targetOptionIds": [
                    49,
                    51,
                    50
                ]
            }
        ]
    },
    {
        "id": 49,
        "enumName": "BloodMoonRange",
        "displayName": "Blood Moon Range",
        "category": "World",
        "type": "int",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "7",
                "index": 5
            },
            {
                "code": "G",
                "value": "10",
                "index": 6
            },
            {
                "code": "H",
                "value": "14",
                "index": 7
            },
            {
                "code": "I",
                "value": "20",
                "index": 8
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 51,
        "enumName": "BloodMoonEnemyCount",
        "displayName": "Blood Moon Count",
        "category": "World",
        "type": "int",
        "defaultCode": "C",
        "defaultValueIndex": 2,
        "valueSet": [
            {
                "code": "A",
                "value": "4",
                "index": 0
            },
            {
                "code": "B",
                "value": "6",
                "index": 1
            },
            {
                "code": "C",
                "value": "8",
                "index": 2
            },
            {
                "code": "D",
                "value": "10",
                "index": 3
            },
            {
                "code": "E",
                "value": "12",
                "index": 4
            },
            {
                "code": "F",
                "value": "16",
                "index": 5
            },
            {
                "code": "G",
                "value": "24",
                "index": 6
            },
            {
                "code": "H",
                "value": "32",
                "index": 7
            },
            {
                "code": "I",
                "value": "64",
                "index": 8
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 50,
        "enumName": "BloodMoonWarning",
        "displayName": "Blood Moon Warning",
        "category": "World",
        "type": "int",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 52,
        "enumName": "AirDropFrequency",
        "displayName": "Air Drops",
        "category": "World",
        "type": "int",
        "defaultCode": "D",
        "defaultValueIndex": 3,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            },
            {
                "code": "G",
                "value": "6",
                "index": 6
            }
        ],
        "uiSection": false,
        "dependencies": [
            {
                "sourceOptionId": 52,
                "triggerValueIndices": [
                    0
                ],
                "targetOptionIds": [
                    54,
                    53
                ]
            }
        ]
    },
    {
        "id": 54,
        "enumName": "AirDropRandomTime",
        "displayName": "Air Drop Random Time",
        "category": "World",
        "type": "int",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            },
            {
                "code": "G",
                "value": "6",
                "index": 6
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 57,
        "enumName": "StormFreq",
        "displayName": "Storm Frequency",
        "category": "World",
        "type": "float",
        "defaultCode": "C",
        "defaultValueIndex": 2,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.5",
                "index": 1
            },
            {
                "code": "C",
                "value": "1",
                "index": 2
            },
            {
                "code": "D",
                "value": "1.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "2",
                "index": 4
            },
            {
                "code": "F",
                "value": "3",
                "index": 5
            },
            {
                "code": "G",
                "value": "4",
                "index": 6
            },
            {
                "code": "H",
                "value": "5",
                "index": 7
            }
        ],
        "uiSection": true,
        "dependencies": [
            {
                "sourceOptionId": 57,
                "triggerValueIndices": [
                    0
                ],
                "targetOptionIds": [
                    58
                ]
            }
        ]
    },
    {
        "id": 58,
        "enumName": "StormWarning",
        "displayName": "Storm Warning",
        "category": "World",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 59,
        "enumName": "HeatMapSensitivity",
        "displayName": "Heatmap Sensitivity",
        "category": "World",
        "type": "float",
        "defaultCode": "D",
        "defaultValueIndex": 3,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.5",
                "index": 2
            },
            {
                "code": "D",
                "value": "1",
                "index": 3
            },
            {
                "code": "E",
                "value": "1.5",
                "index": 4
            },
            {
                "code": "F",
                "value": "2",
                "index": 5
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 66,
        "enumName": "DayNightLength",
        "displayName": "24 Day Cycle",
        "category": "World",
        "type": "int",
        "defaultCode": "F",
        "defaultValueIndex": 5,
        "valueSet": [
            {
                "code": "A",
                "value": "10",
                "index": 0
            },
            {
                "code": "B",
                "value": "20",
                "index": 1
            },
            {
                "code": "C",
                "value": "30",
                "index": 2
            },
            {
                "code": "D",
                "value": "40",
                "index": 3
            },
            {
                "code": "E",
                "value": "50",
                "index": 4
            },
            {
                "code": "F",
                "value": "60",
                "index": 5
            },
            {
                "code": "G",
                "value": "90",
                "index": 6
            },
            {
                "code": "H",
                "value": "120",
                "index": 7
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 67,
        "enumName": "DayLightLength",
        "displayName": "Day Light Length",
        "category": "World",
        "type": "int",
        "defaultCode": "I",
        "defaultValueIndex": 8,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "4",
                "index": 1
            },
            {
                "code": "C",
                "value": "6",
                "index": 2
            },
            {
                "code": "D",
                "value": "8",
                "index": 3
            },
            {
                "code": "E",
                "value": "10",
                "index": 4
            },
            {
                "code": "F",
                "value": "12",
                "index": 5
            },
            {
                "code": "G",
                "value": "14",
                "index": 6
            },
            {
                "code": "H",
                "value": "16",
                "index": 7
            },
            {
                "code": "I",
                "value": "18",
                "index": 8
            },
            {
                "code": "J",
                "value": "20",
                "index": 9
            },
            {
                "code": "K",
                "value": "24",
                "index": 10
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 53,
        "enumName": "AirDropMarker",
        "displayName": "Mark Air Drops",
        "category": "World",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": true,
        "dependencies": []
    },
    {
        "id": 68,
        "enumName": "AllowMap",
        "displayName": "Allow Map",
        "category": "World",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 69,
        "enumName": "AllowCompass",
        "displayName": "Allow Compass",
        "category": "World",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 70,
        "enumName": "AllowScreenMarkers",
        "displayName": "Allow Screen Markers",
        "category": "World",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 71,
        "enumName": "ShowLocationInfo",
        "displayName": "Show Location Info",
        "category": "World",
        "type": "int",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 72,
        "enumName": "ShowDayTime",
        "displayName": "Show Day/Time",
        "category": "World",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": [
            {
                "sourceOptionId": 72,
                "triggerValueIndices": [
                    0
                ],
                "targetOptionIds": [
                    50
                ]
            }
        ]
    },
    {
        "id": 77,
        "enumName": "LootMaxTier",
        "displayName": "Loot Max Tier",
        "category": "Resources",
        "type": "int",
        "defaultCode": "F",
        "defaultValueIndex": 5,
        "valueSet": [
            {
                "code": "A",
                "value": "1",
                "index": 0
            },
            {
                "code": "B",
                "value": "2",
                "index": 1
            },
            {
                "code": "C",
                "value": "3",
                "index": 2
            },
            {
                "code": "D",
                "value": "4",
                "index": 3
            },
            {
                "code": "E",
                "value": "5",
                "index": 4
            },
            {
                "code": "F",
                "value": "6",
                "index": 5
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 62,
        "enumName": "GlobalLSModifier",
        "displayName": "Global LootStage",
        "category": "Resources",
        "type": "float",
        "defaultCode": "C",
        "defaultValueIndex": 2,
        "valueSet": [
            {
                "code": "A",
                "value": "0.25",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.5",
                "index": 1
            },
            {
                "code": "C",
                "value": "1",
                "index": 2
            },
            {
                "code": "D",
                "value": "1.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "2",
                "index": 4
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 63,
        "enumName": "BiomeLSModifier",
        "displayName": "Biome LootStage",
        "category": "Resources",
        "type": "float",
        "defaultCode": "C",
        "defaultValueIndex": 2,
        "valueSet": [
            {
                "code": "A",
                "value": "0.25",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.5",
                "index": 1
            },
            {
                "code": "C",
                "value": "1",
                "index": 2
            },
            {
                "code": "D",
                "value": "1.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "2",
                "index": 4
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 64,
        "enumName": "POITierLSModifier",
        "displayName": "POI Tier LootStage",
        "category": "Resources",
        "type": "float",
        "defaultCode": "C",
        "defaultValueIndex": 2,
        "valueSet": [
            {
                "code": "A",
                "value": "0.25",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.5",
                "index": 1
            },
            {
                "code": "C",
                "value": "1",
                "index": 2
            },
            {
                "code": "D",
                "value": "1.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "2",
                "index": 4
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 75,
        "enumName": "LootRespawnDays",
        "displayName": "Loot Respawn Days",
        "category": "Resources",
        "type": "int",
        "defaultCode": "C",
        "defaultValueIndex": 2,
        "valueSet": [
            {
                "code": "A",
                "value": "-1",
                "index": 0
            },
            {
                "code": "B",
                "value": "5",
                "index": 1
            },
            {
                "code": "C",
                "value": "7",
                "index": 2
            },
            {
                "code": "D",
                "value": "10",
                "index": 3
            },
            {
                "code": "E",
                "value": "15",
                "index": 4
            },
            {
                "code": "F",
                "value": "20",
                "index": 5
            },
            {
                "code": "G",
                "value": "30",
                "index": 6
            },
            {
                "code": "H",
                "value": "40",
                "index": 7
            },
            {
                "code": "I",
                "value": "50",
                "index": 8
            }
        ],
        "uiSection": true,
        "dependencies": []
    },
    {
        "id": 76,
        "enumName": "LootTimer",
        "displayName": "Loot Time",
        "category": "Resources",
        "type": "float",
        "defaultCode": "E",
        "defaultValueIndex": 4,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.5",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.75",
                "index": 3
            },
            {
                "code": "E",
                "value": "1",
                "index": 4
            },
            {
                "code": "F",
                "value": "1.25",
                "index": 5
            },
            {
                "code": "G",
                "value": "1.5",
                "index": 6
            },
            {
                "code": "H",
                "value": "2",
                "index": 7
            },
            {
                "code": "I",
                "value": "3",
                "index": 8
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 90,
        "enumName": "LootBagChance",
        "displayName": "Loot Bag Chance",
        "category": "Resources",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "3",
                "index": 11
            },
            {
                "code": "M",
                "value": "4",
                "index": 12
            },
            {
                "code": "N",
                "value": "5",
                "index": 13
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 78,
        "enumName": "GlobalLootCount",
        "displayName": "Global Loot Abundance",
        "category": "Resources",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "3",
                "index": 11
            },
            {
                "code": "M",
                "value": "4",
                "index": 12
            },
            {
                "code": "N",
                "value": "5",
                "index": 13
            }
        ],
        "uiSection": true,
        "dependencies": [
            {
                "sourceOptionId": 78,
                "triggerValueIndices": [
                    0
                ],
                "targetOptionIds": [
                    79,
                    80,
                    81,
                    82,
                    83,
                    84,
                    85,
                    86,
                    87,
                    88,
                    111
                ]
            }
        ]
    },
    {
        "id": 79,
        "enumName": "FoodLootCount",
        "displayName": "Food Abundance",
        "category": "Resources",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "3",
                "index": 11
            },
            {
                "code": "M",
                "value": "4",
                "index": 12
            },
            {
                "code": "N",
                "value": "5",
                "index": 13
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 80,
        "enumName": "DrinkLootCount",
        "displayName": "Drink Abundance",
        "category": "Resources",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "3",
                "index": 11
            },
            {
                "code": "M",
                "value": "4",
                "index": 12
            },
            {
                "code": "N",
                "value": "5",
                "index": 13
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 81,
        "enumName": "MedicalLootCount",
        "displayName": "Medical Abundance",
        "category": "Resources",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "3",
                "index": 11
            },
            {
                "code": "M",
                "value": "4",
                "index": 12
            },
            {
                "code": "N",
                "value": "5",
                "index": 13
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 82,
        "enumName": "AmmoLootCount",
        "displayName": "Ammo Abundance",
        "category": "Resources",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "3",
                "index": 11
            },
            {
                "code": "M",
                "value": "4",
                "index": 12
            },
            {
                "code": "N",
                "value": "5",
                "index": 13
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 83,
        "enumName": "ResourceLootCount",
        "displayName": "Resource Abundance",
        "category": "Resources",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "3",
                "index": 11
            },
            {
                "code": "M",
                "value": "4",
                "index": 12
            },
            {
                "code": "N",
                "value": "5",
                "index": 13
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 84,
        "enumName": "ArmorLootCount",
        "displayName": "Armor Abundance",
        "category": "Resources",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "3",
                "index": 11
            },
            {
                "code": "M",
                "value": "4",
                "index": 12
            },
            {
                "code": "N",
                "value": "5",
                "index": 13
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 85,
        "enumName": "MeleeLootCount",
        "displayName": "Melee Abundance",
        "category": "Resources",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "3",
                "index": 11
            },
            {
                "code": "M",
                "value": "4",
                "index": 12
            },
            {
                "code": "N",
                "value": "5",
                "index": 13
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 86,
        "enumName": "RangedLootCount",
        "displayName": "Ranged Abundance",
        "category": "Resources",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "3",
                "index": 11
            },
            {
                "code": "M",
                "value": "4",
                "index": 12
            },
            {
                "code": "N",
                "value": "5",
                "index": 13
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 87,
        "enumName": "DukesLootCount",
        "displayName": "Dukes Abundance",
        "category": "Resources",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "3",
                "index": 11
            },
            {
                "code": "M",
                "value": "4",
                "index": 12
            },
            {
                "code": "N",
                "value": "5",
                "index": 13
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 88,
        "enumName": "CraftingMagazinesLootCount",
        "displayName": "Magazines Abundance",
        "category": "Resources",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "3",
                "index": 11
            },
            {
                "code": "M",
                "value": "4",
                "index": 12
            },
            {
                "code": "N",
                "value": "5",
                "index": 13
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 111,
        "enumName": "BookLootCount",
        "displayName": "Book Abundance",
        "category": "Resources",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "3",
                "index": 11
            },
            {
                "code": "M",
                "value": "4",
                "index": 12
            },
            {
                "code": "N",
                "value": "5",
                "index": 13
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 89,
        "enumName": "TreasureMapChance",
        "displayName": "Treasure Map Chance",
        "category": "Resources",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.5",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.6",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.7",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.8",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.9",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.1",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.2",
                "index": 9
            },
            {
                "code": "K",
                "value": "1.3",
                "index": 10
            },
            {
                "code": "L",
                "value": "1.4",
                "index": 11
            },
            {
                "code": "M",
                "value": "1.5",
                "index": 12
            },
            {
                "code": "N",
                "value": "2",
                "index": 13
            },
            {
                "code": "O",
                "value": "3",
                "index": 14
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 101,
        "enumName": "MiningOutput",
        "displayName": "Mining Output",
        "category": "Resources",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "3",
                "index": 11
            },
            {
                "code": "M",
                "value": "4",
                "index": 12
            },
            {
                "code": "N",
                "value": "5",
                "index": 13
            }
        ],
        "uiSection": true,
        "dependencies": []
    },
    {
        "id": 91,
        "enumName": "CropOutput",
        "displayName": "Crop Output",
        "category": "Resources",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "3",
                "index": 11
            },
            {
                "code": "M",
                "value": "4",
                "index": 12
            },
            {
                "code": "N",
                "value": "5",
                "index": 13
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 92,
        "enumName": "SeedDropOutput",
        "displayName": "Seed Drop Output",
        "category": "Resources",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "3",
                "index": 11
            },
            {
                "code": "M",
                "value": "4",
                "index": 12
            },
            {
                "code": "N",
                "value": "5",
                "index": 13
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 102,
        "enumName": "HarvestingOutput",
        "displayName": "Harvesting Output",
        "category": "Resources",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "3",
                "index": 11
            },
            {
                "code": "M",
                "value": "4",
                "index": 12
            },
            {
                "code": "N",
                "value": "5",
                "index": 13
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 93,
        "enumName": "CropGrowthSpeed",
        "displayName": "Crop Growth",
        "category": "Resources",
        "type": "float",
        "defaultCode": "F",
        "defaultValueIndex": 5,
        "valueSet": [
            {
                "code": "A",
                "value": "1000",
                "index": 0
            },
            {
                "code": "B",
                "value": "0",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.2",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.75",
                "index": 4
            },
            {
                "code": "F",
                "value": "1",
                "index": 5
            },
            {
                "code": "G",
                "value": "1.5",
                "index": 6
            },
            {
                "code": "H",
                "value": "2",
                "index": 7
            },
            {
                "code": "I",
                "value": "3",
                "index": 8
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 96,
        "enumName": "CraftingProgression",
        "displayName": "Crafting Progression",
        "category": "Crafting",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 100,
        "enumName": "CraftingMaxTier",
        "displayName": "Crafting Max Tier",
        "category": "Crafting",
        "type": "int",
        "defaultCode": "F",
        "defaultValueIndex": 5,
        "valueSet": [
            {
                "code": "A",
                "value": "1",
                "index": 0
            },
            {
                "code": "B",
                "value": "2",
                "index": 1
            },
            {
                "code": "C",
                "value": "3",
                "index": 2
            },
            {
                "code": "D",
                "value": "4",
                "index": 3
            },
            {
                "code": "E",
                "value": "5",
                "index": 4
            },
            {
                "code": "F",
                "value": "6",
                "index": 5
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 115,
        "enumName": "PointsPerMagazine",
        "displayName": "Magazine Points",
        "category": "Crafting",
        "type": "int",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            },
            {
                "code": "G",
                "value": "6",
                "index": 6
            },
            {
                "code": "H",
                "value": "7",
                "index": 7
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 94,
        "enumName": "BackpackCrafting",
        "displayName": "Backpack Crafting",
        "category": "Crafting",
        "type": "int",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 95,
        "enumName": "WorkstationCrafting",
        "displayName": "Workstation Crafting",
        "category": "Crafting",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 104,
        "enumName": "SmeltingType",
        "displayName": "Smelter Type",
        "category": "Crafting",
        "type": "bool",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 97,
        "enumName": "CraftingTime",
        "displayName": "Crafting Time",
        "category": "Crafting",
        "type": "float",
        "defaultCode": "E",
        "defaultValueIndex": 4,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.5",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.75",
                "index": 3
            },
            {
                "code": "E",
                "value": "1",
                "index": 4
            },
            {
                "code": "F",
                "value": "1.25",
                "index": 5
            },
            {
                "code": "G",
                "value": "1.5",
                "index": 6
            },
            {
                "code": "H",
                "value": "2",
                "index": 7
            },
            {
                "code": "I",
                "value": "3",
                "index": 8
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 98,
        "enumName": "CraftingInput",
        "displayName": "Crafting Input",
        "category": "Crafting",
        "type": "float",
        "defaultCode": "E",
        "defaultValueIndex": 4,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.5",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.75",
                "index": 3
            },
            {
                "code": "E",
                "value": "1",
                "index": 4
            },
            {
                "code": "F",
                "value": "1.25",
                "index": 5
            },
            {
                "code": "G",
                "value": "1.5",
                "index": 6
            },
            {
                "code": "H",
                "value": "2",
                "index": 7
            },
            {
                "code": "I",
                "value": "3",
                "index": 8
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 99,
        "enumName": "CraftingOutput",
        "displayName": "Crafting Output",
        "category": "Crafting",
        "type": "float",
        "defaultCode": "D",
        "defaultValueIndex": 3,
        "valueSet": [
            {
                "code": "A",
                "value": "0.25",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.5",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.75",
                "index": 2
            },
            {
                "code": "D",
                "value": "1",
                "index": 3
            },
            {
                "code": "E",
                "value": "1.25",
                "index": 4
            },
            {
                "code": "F",
                "value": "1.5",
                "index": 5
            },
            {
                "code": "G",
                "value": "2",
                "index": 6
            },
            {
                "code": "H",
                "value": "3",
                "index": 7
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 103,
        "enumName": "ScrappingOutput",
        "displayName": "Scrapping Output",
        "category": "Crafting",
        "type": "float",
        "defaultCode": "E",
        "defaultValueIndex": 4,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.5",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.75",
                "index": 3
            },
            {
                "code": "E",
                "value": "1",
                "index": 4
            },
            {
                "code": "F",
                "value": "1.25",
                "index": 5
            },
            {
                "code": "G",
                "value": "1.5",
                "index": 6
            },
            {
                "code": "H",
                "value": "2",
                "index": 7
            },
            {
                "code": "I",
                "value": "3",
                "index": 8
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 105,
        "enumName": "DewCollectorTime",
        "displayName": "Dew Collector Time",
        "category": "Crafting",
        "type": "float",
        "defaultCode": "E",
        "defaultValueIndex": 4,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.5",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.75",
                "index": 3
            },
            {
                "code": "E",
                "value": "1",
                "index": 4
            },
            {
                "code": "F",
                "value": "1.25",
                "index": 5
            },
            {
                "code": "G",
                "value": "1.5",
                "index": 6
            },
            {
                "code": "H",
                "value": "2",
                "index": 7
            },
            {
                "code": "I",
                "value": "3",
                "index": 8
            }
        ],
        "uiSection": true,
        "dependencies": []
    },
    {
        "id": 106,
        "enumName": "DewCollectorOutput",
        "displayName": "Dew Collector Output",
        "category": "Crafting",
        "type": "float",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "1",
                "index": 0
            },
            {
                "code": "B",
                "value": "2",
                "index": 1
            },
            {
                "code": "C",
                "value": "3",
                "index": 2
            },
            {
                "code": "D",
                "value": "4",
                "index": 3
            },
            {
                "code": "E",
                "value": "5",
                "index": 4
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 107,
        "enumName": "DewCollectorInput",
        "displayName": "Dew Collector Input",
        "category": "Crafting",
        "type": "float",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 108,
        "enumName": "ApiaryTime",
        "displayName": "Apiary Time",
        "category": "Crafting",
        "type": "float",
        "defaultCode": "E",
        "defaultValueIndex": 4,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.5",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.75",
                "index": 3
            },
            {
                "code": "E",
                "value": "1",
                "index": 4
            },
            {
                "code": "F",
                "value": "1.25",
                "index": 5
            },
            {
                "code": "G",
                "value": "1.5",
                "index": 6
            },
            {
                "code": "H",
                "value": "2",
                "index": 7
            },
            {
                "code": "I",
                "value": "3",
                "index": 8
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 109,
        "enumName": "ApiaryOutput",
        "displayName": "Apiary Output",
        "category": "Crafting",
        "type": "float",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "1",
                "index": 0
            },
            {
                "code": "B",
                "value": "2",
                "index": 1
            },
            {
                "code": "C",
                "value": "3",
                "index": 2
            },
            {
                "code": "D",
                "value": "4",
                "index": 3
            },
            {
                "code": "E",
                "value": "5",
                "index": 4
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 110,
        "enumName": "ApiaryInput",
        "displayName": "Apiary Input",
        "category": "Crafting",
        "type": "float",
        "defaultCode": "F",
        "defaultValueIndex": 5,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.2",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.4",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.6",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.8",
                "index": 4
            },
            {
                "code": "F",
                "value": "1",
                "index": 5
            },
            {
                "code": "G",
                "value": "1.5",
                "index": 6
            },
            {
                "code": "H",
                "value": "2",
                "index": 7
            },
            {
                "code": "I",
                "value": "3",
                "index": 8
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 21,
        "enumName": "ItemDegradation",
        "displayName": "Item Degradation",
        "category": "Crafting",
        "type": "float",
        "defaultCode": "D",
        "defaultValueIndex": 3,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.5",
                "index": 2
            },
            {
                "code": "D",
                "value": "1",
                "index": 3
            },
            {
                "code": "E",
                "value": "1.5",
                "index": 4
            },
            {
                "code": "F",
                "value": "2",
                "index": 5
            }
        ],
        "uiSection": true,
        "dependencies": []
    },
    {
        "id": 113,
        "enumName": "RepairTypes",
        "displayName": "Item Repair Types",
        "category": "Crafting",
        "type": "int",
        "defaultCode": "D",
        "defaultValueIndex": 3,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 114,
        "enumName": "MaxDegradationAmount",
        "displayName": "Max Degrade Amount",
        "category": "Crafting",
        "type": "float",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.05",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.1",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.15",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.2",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.25",
                "index": 5
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 128,
        "enumName": "TradersEnabled",
        "displayName": "Trading Enabled",
        "category": "Traders",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": [
            {
                "sourceOptionId": 128,
                "triggerValueIndices": [
                    0
                ],
                "targetOptionIds": [
                    136,
                    134,
                    133,
                    130,
                    131,
                    135,
                    65
                ]
            }
        ]
    },
    {
        "id": 129,
        "enumName": "VendingEnabled",
        "displayName": "Vending Machines Enabled",
        "category": "Traders",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": [
            {
                "sourceOptionId": 129,
                "triggerValueIndices": [
                    0
                ],
                "targetOptionIds": [
                    138,
                    137
                ]
            }
        ]
    },
    {
        "id": 127,
        "enumName": "TraderHours",
        "displayName": "Trader Hours",
        "category": "Traders",
        "type": "int",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            },
            {
                "code": "G",
                "value": "6",
                "index": 6
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 132,
        "enumName": "TraderProtection",
        "displayName": "Trader Protection",
        "category": "Traders",
        "type": "int",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 126,
        "enumName": "TraderDialog",
        "displayName": "Trading Dialog",
        "category": "Traders",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 65,
        "enumName": "GlobalTSModifier",
        "displayName": "Global TraderStage",
        "category": "Traders",
        "type": "float",
        "defaultCode": "C",
        "defaultValueIndex": 2,
        "valueSet": [
            {
                "code": "A",
                "value": "0.25",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.5",
                "index": 1
            },
            {
                "code": "C",
                "value": "1",
                "index": 2
            },
            {
                "code": "D",
                "value": "1.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "2",
                "index": 4
            }
        ],
        "uiSection": true,
        "dependencies": []
    },
    {
        "id": 136,
        "enumName": "TraderMaxTier",
        "displayName": "Trader Max Tier",
        "category": "Traders",
        "type": "int",
        "defaultCode": "F",
        "defaultValueIndex": 5,
        "valueSet": [
            {
                "code": "A",
                "value": "1",
                "index": 0
            },
            {
                "code": "B",
                "value": "2",
                "index": 1
            },
            {
                "code": "C",
                "value": "3",
                "index": 2
            },
            {
                "code": "D",
                "value": "4",
                "index": 3
            },
            {
                "code": "E",
                "value": "5",
                "index": 4
            },
            {
                "code": "F",
                "value": "6",
                "index": 5
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 134,
        "enumName": "TraderItemAbundance",
        "displayName": "Trader Item Abundance",
        "category": "Traders",
        "type": "float",
        "defaultCode": "C",
        "defaultValueIndex": 2,
        "valueSet": [
            {
                "code": "A",
                "value": "0.25",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.5",
                "index": 1
            },
            {
                "code": "C",
                "value": "1",
                "index": 2
            },
            {
                "code": "D",
                "value": "1.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "2",
                "index": 4
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 138,
        "enumName": "VendingItemAbundance",
        "displayName": "Vending Item Abundance",
        "category": "Traders",
        "type": "float",
        "defaultCode": "C",
        "defaultValueIndex": 2,
        "valueSet": [
            {
                "code": "A",
                "value": "0.25",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.5",
                "index": 1
            },
            {
                "code": "C",
                "value": "1",
                "index": 2
            },
            {
                "code": "D",
                "value": "1.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "2",
                "index": 4
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 133,
        "enumName": "TraderResetInterval",
        "displayName": "Trader Reset Interval",
        "category": "Traders",
        "type": "int",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "-1",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            },
            {
                "code": "G",
                "value": "6",
                "index": 6
            },
            {
                "code": "H",
                "value": "7",
                "index": 7
            },
            {
                "code": "I",
                "value": "14",
                "index": 8
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 137,
        "enumName": "VendingResetInterval",
        "displayName": "Vending Reset Interval",
        "category": "Traders",
        "type": "int",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "-1",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            },
            {
                "code": "G",
                "value": "6",
                "index": 6
            },
            {
                "code": "H",
                "value": "7",
                "index": 7
            },
            {
                "code": "I",
                "value": "14",
                "index": 8
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 130,
        "enumName": "TraderSellPrices",
        "displayName": "Traders Sell Price",
        "category": "Traders",
        "type": "float",
        "defaultCode": "E",
        "defaultValueIndex": 4,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.5",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.75",
                "index": 3
            },
            {
                "code": "E",
                "value": "1",
                "index": 4
            },
            {
                "code": "F",
                "value": "1.25",
                "index": 5
            },
            {
                "code": "G",
                "value": "1.5",
                "index": 6
            },
            {
                "code": "H",
                "value": "1.75",
                "index": 7
            },
            {
                "code": "I",
                "value": "2",
                "index": 8
            },
            {
                "code": "J",
                "value": "3",
                "index": 9
            },
            {
                "code": "K",
                "value": "4",
                "index": 10
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 131,
        "enumName": "TraderBuyPrices",
        "displayName": "Traders Buy Price",
        "category": "Traders",
        "type": "float",
        "defaultCode": "E",
        "defaultValueIndex": 4,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.5",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.75",
                "index": 3
            },
            {
                "code": "E",
                "value": "1",
                "index": 4
            },
            {
                "code": "F",
                "value": "1.25",
                "index": 5
            },
            {
                "code": "G",
                "value": "1.5",
                "index": 6
            },
            {
                "code": "H",
                "value": "1.75",
                "index": 7
            },
            {
                "code": "I",
                "value": "2",
                "index": 8
            },
            {
                "code": "J",
                "value": "3",
                "index": 9
            },
            {
                "code": "K",
                "value": "4",
                "index": 10
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 135,
        "enumName": "TraderBuyLimit",
        "displayName": "Trader Buy Limit",
        "category": "Traders",
        "type": "int",
        "defaultCode": "D",
        "defaultValueIndex": 3,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            },
            {
                "code": "G",
                "value": "6",
                "index": 6
            },
            {
                "code": "H",
                "value": "7",
                "index": 7
            },
            {
                "code": "I",
                "value": "8",
                "index": 8
            },
            {
                "code": "J",
                "value": "9",
                "index": 9
            },
            {
                "code": "K",
                "value": "10",
                "index": 10
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 139,
        "enumName": "ChallengesEnabled",
        "displayName": "Challenges Enabled",
        "category": "Tasks",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": [
            {
                "sourceOptionId": 139,
                "triggerValueIndices": [
                    0
                ],
                "targetOptionIds": [
                    140
                ]
            }
        ]
    },
    {
        "id": 118,
        "enumName": "QuestsEnabled",
        "displayName": "Quests Enabled",
        "category": "Tasks",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 140,
        "enumName": "IntroChallengesEnabled",
        "displayName": "Intro Challenges Enabled",
        "category": "Tasks",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 119,
        "enumName": "IntroQuestEnabled",
        "displayName": "Intro Quest Enabled",
        "category": "Tasks",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 120,
        "enumName": "TraderToTraderQuestsEnabled",
        "displayName": "Trader to Trader Quests",
        "category": "Tasks",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 124,
        "enumName": "BuriedQuestsEnabled",
        "displayName": "Buried Quests Enabled",
        "category": "Tasks",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 125,
        "enumName": "POIQuestsEnabled",
        "displayName": "POI Quests Enabled",
        "category": "Tasks",
        "type": "bool",
        "defaultCode": "B",
        "defaultValueIndex": 1,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 122,
        "enumName": "QuestsPerTier",
        "displayName": "Quests per Tier",
        "category": "Tasks",
        "type": "int",
        "defaultCode": "K",
        "defaultValueIndex": 10,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            },
            {
                "code": "G",
                "value": "6",
                "index": 6
            },
            {
                "code": "H",
                "value": "7",
                "index": 7
            },
            {
                "code": "I",
                "value": "8",
                "index": 8
            },
            {
                "code": "J",
                "value": "9",
                "index": 9
            },
            {
                "code": "K",
                "value": "10",
                "index": 10
            },
            {
                "code": "L",
                "value": "11",
                "index": 11
            },
            {
                "code": "M",
                "value": "12",
                "index": 12
            },
            {
                "code": "N",
                "value": "13",
                "index": 13
            },
            {
                "code": "O",
                "value": "14",
                "index": 14
            },
            {
                "code": "P",
                "value": "15",
                "index": 15
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 123,
        "enumName": "QuestProgressionDailyLimit",
        "displayName": "Quests per Day",
        "category": "Tasks",
        "type": "int",
        "defaultCode": "E",
        "defaultValueIndex": 4,
        "valueSet": [
            {
                "code": "A",
                "value": "-1",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            },
            {
                "code": "G",
                "value": "6",
                "index": 6
            },
            {
                "code": "H",
                "value": "7",
                "index": 7
            },
            {
                "code": "I",
                "value": "8",
                "index": 8
            },
            {
                "code": "J",
                "value": "9",
                "index": 9
            },
            {
                "code": "K",
                "value": "10",
                "index": 10
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 121,
        "enumName": "StarterSkillPoints",
        "displayName": "Starter Skill Points",
        "category": "Tasks",
        "type": "int",
        "defaultCode": "E",
        "defaultValueIndex": 4,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            },
            {
                "code": "D",
                "value": "3",
                "index": 3
            },
            {
                "code": "E",
                "value": "4",
                "index": 4
            },
            {
                "code": "F",
                "value": "5",
                "index": 5
            },
            {
                "code": "G",
                "value": "6",
                "index": 6
            },
            {
                "code": "H",
                "value": "7",
                "index": 7
            },
            {
                "code": "I",
                "value": "8",
                "index": 8
            },
            {
                "code": "J",
                "value": "9",
                "index": 9
            },
            {
                "code": "K",
                "value": "10",
                "index": 10
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 141,
        "enumName": "VehicleFuelUsage",
        "displayName": "Vehicle Fuel Usage",
        "category": "Misc",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "2.5",
                "index": 11
            },
            {
                "code": "M",
                "value": "3",
                "index": 12
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 142,
        "enumName": "VehicleEntityDamage",
        "displayName": "Vehicle Entity Damage",
        "category": "Misc",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "2.5",
                "index": 11
            },
            {
                "code": "M",
                "value": "3",
                "index": 12
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 143,
        "enumName": "VehicleBlockDamage",
        "displayName": "Vehicle Block Damage",
        "category": "Misc",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "2.5",
                "index": 11
            },
            {
                "code": "M",
                "value": "3",
                "index": 12
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 144,
        "enumName": "VehicleSelfDamage",
        "displayName": "Vehicle Self Damage",
        "category": "Misc",
        "type": "float",
        "defaultCode": "H",
        "defaultValueIndex": 7,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.25",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.35",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.5",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.65",
                "index": 4
            },
            {
                "code": "F",
                "value": "0.75",
                "index": 5
            },
            {
                "code": "G",
                "value": "0.85",
                "index": 6
            },
            {
                "code": "H",
                "value": "1",
                "index": 7
            },
            {
                "code": "I",
                "value": "1.25",
                "index": 8
            },
            {
                "code": "J",
                "value": "1.5",
                "index": 9
            },
            {
                "code": "K",
                "value": "2",
                "index": 10
            },
            {
                "code": "L",
                "value": "2.5",
                "index": 11
            },
            {
                "code": "M",
                "value": "3",
                "index": 12
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 145,
        "enumName": "ElectricalOutput",
        "displayName": "Electrical Output",
        "category": "Misc",
        "type": "float",
        "defaultCode": "D",
        "defaultValueIndex": 3,
        "valueSet": [
            {
                "code": "A",
                "value": "0.25",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.5",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.75",
                "index": 2
            },
            {
                "code": "D",
                "value": "1",
                "index": 3
            },
            {
                "code": "E",
                "value": "1.25",
                "index": 4
            },
            {
                "code": "F",
                "value": "1.5",
                "index": 5
            },
            {
                "code": "G",
                "value": "2",
                "index": 6
            },
            {
                "code": "H",
                "value": "3",
                "index": 7
            }
        ],
        "uiSection": true,
        "dependencies": []
    },
    {
        "id": 146,
        "enumName": "SillyCelebrate",
        "displayName": "Celebrate Kills",
        "category": "Misc",
        "type": "int",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "0",
                "index": 0
            },
            {
                "code": "B",
                "value": "1",
                "index": 1
            },
            {
                "code": "C",
                "value": "2",
                "index": 2
            }
        ],
        "uiSection": true,
        "dependencies": []
    },
    {
        "id": 147,
        "enumName": "SillyBigHeads",
        "displayName": "Big Heads",
        "category": "Misc",
        "type": "bool",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 148,
        "enumName": "SillyTinyZombies",
        "displayName": "Tiny Zombies",
        "category": "Misc",
        "type": "bool",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 150,
        "enumName": "SillyLowGravity",
        "displayName": "Gravity",
        "category": "Misc",
        "type": "float",
        "defaultCode": "F",
        "defaultValueIndex": 5,
        "valueSet": [
            {
                "code": "A",
                "value": "0.5",
                "index": 0
            },
            {
                "code": "B",
                "value": "0.6",
                "index": 1
            },
            {
                "code": "C",
                "value": "0.7",
                "index": 2
            },
            {
                "code": "D",
                "value": "0.8",
                "index": 3
            },
            {
                "code": "E",
                "value": "0.9",
                "index": 4
            },
            {
                "code": "F",
                "value": "1",
                "index": 5
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 149,
        "enumName": "SillySounds",
        "displayName": "Silly Sounds",
        "category": "Misc",
        "type": "bool",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    },
    {
        "id": 151,
        "enumName": "SillyBlackandWhite",
        "displayName": "Black and White",
        "category": "Misc",
        "type": "bool",
        "defaultCode": "A",
        "defaultValueIndex": 0,
        "valueSet": [
            {
                "code": "A",
                "value": "false",
                "index": 0
            },
            {
                "code": "B",
                "value": "true",
                "index": 1
            }
        ],
        "uiSection": false,
        "dependencies": []
    }
];

export const optionsById = new Map(sandboxOptions.map(o => [o.id, o]));
