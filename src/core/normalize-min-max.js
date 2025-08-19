/**
 * Normalize minimum and maximum numeric policy values against defaults.
 *
 * This utility ensures:
 * - Fallback to `defaultMinMax` if `valuesMinMax` is not provided or invalid.
 * - Both `min` and `max` are clamped to stay within the default range.
 * - Guarantees `min <= max` by adjusting `max` when necessary.
 *
 * @param {{ min: number, max: number }} defaultMinMax
 *        The default minimum and maximum values. These act as the allowed range boundaries.
 *
 * @param {{ min?: number, max?: number } | null | undefined} valuesMinMax
 *        Custom minimum and/or maximum values. May be partial, null, or undefined.
 *        Non-numeric inputs are ignored in favor of the default values.
 *
 * @returns {{ min: number, max: number }}
 *          Normalized min and max values that respect the defaults and guarantee a valid range.
 *
 * @example
 * // Within range, keeps given values
 * normalizeMinMax({ min: 8, max: 64 }, { min: 10, max: 32 })
 * // → { min: 10, max: 32 }
 *
 * @example
 * // If min > max, coerces max to be at least min
 * normalizeMinMax({ min: 8, max: 64 }, { min: 60, max: 20 })
 * // → { min: 60, max: 60 }
 *
 * @example
 * // Values outside default range are clamped
 * normalizeMinMax({ min: 8, max: 64 }, { min: 4, max: 100 })
 * // → { min: 8, max: 64 }
 *
 * @example
 * // Missing or invalid input falls back to defaults
 * normalizeMinMax({ min: 8, max: 64 }, null)
 * // → { min: 8, max: 64 }
 */
export const normalizeMinMax = (defaultMinMax, valuesMinMax) => {
  if (!valuesMinMax || typeof valuesMinMax !== 'object') {
    return { ...defaultMinMax }
  }

  const { min, max } = valuesMinMax
  const valuesMinMaxFixed = {
    min: typeof min === 'number' ? min : defaultMinMax.min,
    max: typeof max === 'number' ? max : defaultMinMax.max,
  }

  const minMax = {
    min: Math.min(
      Math.max(valuesMinMaxFixed.min, defaultMinMax.min),
      defaultMinMax.max,
    ),
    max: Math.min(valuesMinMaxFixed.max, defaultMinMax.max),
  }

  return {
    min: minMax.min,
    max: minMax.min > minMax.max ? minMax.min : minMax.max,
  }
}
