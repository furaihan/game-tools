import { sandboxOptions, optionsById, getDisplayName } from './sandboxOptions';
import { valueSets } from './valueSets';

// Value index (0-25) -> single char A-Z
export function indexToAlpha(index: number): string {
    if (index < 0 || index > 26) {
        throw new Error(`Value index out of bounds: ${index}`);
    }
    // Replicate bug: 26 % 26 = 0, so 26 wraps to 'A'
    return String.fromCharCode(65 + (index % 26));
}

// Option enum index (0-675) -> 2-char string AA-ZZ
export function indexToAlpha2(index: number): string {
    if (index < 0 || index >= 676) {
        throw new Error(`Option index out of bounds: ${index}`);
    }
    const c1 = String.fromCharCode(65 + Math.floor(index / 26));
    const c2 = String.fromCharCode(65 + (index % 26));
    return `${c1}${c2}`;
}

// Single char A-Z -> value index (0-25)
export function alphaToIndex(value: string): number {
    value = value.toUpperCase();
    if (value < 'A' || value > 'Z') {
        throw new Error("Value must contain only A-Z.");
    }
    return value.charCodeAt(0) - 65;
}

// 2-char string AA-ZZ -> option enum index (0-675)
export function alpha2ToIndex(value: string): number {
    if (!value || value.length !== 2) {
        throw new Error("Value must be exactly 2 letters.");
    }
    value = value.toUpperCase();
    if (value[0] < 'A' || value[0] > 'Z' || value[1] < 'A' || value[1] > 'Z') {
        throw new Error("Value must contain only A-Z.");
    }
    return (value.charCodeAt(0) - 65) * 26 + (value.charCodeAt(1) - 65);
}

const CURRENT_VERSION = 'A';

/**
 * Encodes a map of option IDs to value indices into a Sandbox Code string.
 * @param values Map of option ID to its current value index.
 * @returns Sandbox Code string.
 */
export function encodeSandboxCode(values: Record<number, number>): string {
    let code = CURRENT_VERSION;
    
    // Iterate over the keys (option IDs)
    // To match the game, we should iterate over all changed options.
    // The game uses a dictionary `PresetValues` which only contains changed options.
    
    for (const optionIdStr of Object.keys(values)) {
        const optionId = Number(optionIdStr);
        const valueIdx = values[optionId];
        const option = optionsById.get(optionId);
        if (!option) continue;
        
        // Only encode if it differs from default
        if (valueIdx !== option.defaultValueIndex) {
            code += indexToAlpha2(optionId) + indexToAlpha(valueIdx);
        }
    }
    
    return code;
}

/**
 * Decodes a Sandbox Code string into a map of option IDs and their value indices.
 * @param code The sandbox code to decode.
 * @returns Decoded values and any warnings generated during decoding.
 */
export function decodeSandboxCode(code: string): { values: Record<number, number>, warnings: string[] } {
    const values: Record<number, number> = {};
    const warnings: string[] = [];
    
    // Initialize with all defaults so we have a complete state
    for (const option of sandboxOptions) {
        values[option.id] = option.defaultValueIndex;
    }
    
    if (!code) {
        return { values, warnings }; // Just return defaults
    }
    
    if (code[0] !== CURRENT_VERSION) {
        warnings.push(`Invalid code: Must start with version prefix '${CURRENT_VERSION}'`);
        return { values, warnings };
    }
    
    code = code.substring(1);
    const num = Math.floor(code.length / 3);
    
    for (let i = 0; i < num; i++) {
        const start = i * 3;
        const optionKey = code.substring(start, start + 2);
        const valueChar = code[start + 2];
        
        // Check case sensitivity
        if (optionKey !== optionKey.toUpperCase() || valueChar !== valueChar.toUpperCase()) {
            warnings.push(`Entry ${i + 1} (${optionKey}${valueChar}) contains invalid lowercase characters.`);
            continue;
        }
        
        let key: number;
        let valueIdx: number;
        
        try {
            key = alpha2ToIndex(optionKey);
            valueIdx = alphaToIndex(valueChar);
        } catch (e: any) {
            warnings.push(`Entry ${i + 1} (${optionKey}${valueChar}) is malformed: ${e.message}`);
            continue;
        }
        
        const option = optionsById.get(key);
        if (!option) {
            warnings.push(`Skipped unknown option index ${key} (code ${optionKey}).`);
            continue;
        }
        
        const vs = valueSets[option.valueSetName];
        const vsValues = vs?.floatValues ?? vs?.intValues ?? vs?.boolValues ?? [];
        if (valueIdx < 0 || valueIdx >= vsValues.length) {
            warnings.push(`Skipped invalid value index ${valueIdx} (code ${valueChar}) for option '${getDisplayName(option.enumName)}'.`);
            continue;
        }
        
        values[key] = valueIdx;
    }
    
    return { values, warnings };
}

/**
 * Derives a set of visually disabled option IDs based on the current state.
 */
export function getDisabledOptionIds(values: Record<number, number>): Set<number> {
    const disabled = new Set<number>();
    
    for (const option of sandboxOptions) {
        const currentValue = values[option.id] ?? option.defaultValueIndex;
        for (const dep of option.dependencies) {
            if (dep.triggerValueIndices.includes(currentValue)) {
                for (const target of dep.targetOptionIds) {
                    disabled.add(target);
                }
            }
        }
    }
    
    return disabled;
}
