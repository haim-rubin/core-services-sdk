export function normalizeMinMax(defaultMinMax: {
    min: number;
    max: number;
}, valuesMinMax: {
    min?: number;
    max?: number;
} | null | undefined): {
    min: number;
    max: number;
};
