/**
 * Normalize Utilities
 *
 * Small helpers to guarantee stable, predictable values from user/config inputs.
 * When an incoming value is missing, malformed, or in a different-but-supported
 * representation (e.g., number/boolean as string), these utilities either accept
 * it (after safe normalization) or return a default you control.
 *
 * Design highlights:
 * - Keep call sites compact and intention-revealing.
 * - Be strict for strings (no implicit type coercion).
 * - Be permissive for number/boolean when the input is a string in an accepted form.
 * - Fast, side-effect free, no deep cloning — values are returned by reference when valid.
 */
/**
 * Generic predicate-based normalization.
 *
 * Purpose:
 *  Ensure a value conforms to a caller-provided predicate; otherwise return a provided default.
 *  Useful when you need a single reusable pattern for custom shapes or policies
 *  (e.g., "must be a non-empty array of strings", "must be a plain object", etc.).
 *
 * Behavior:
 *  - Calls `isValid(value)`.
 *  - If the predicate returns true → returns `value` (as-is).
 *  - Otherwise → returns `defaultValue` (as-is).
 *
 * Performance & Safety:
 *  - O(1) aside from your predicate cost.
 *  - No cloning or sanitization is performed.
 *  - Ensure `isValid` is pure and fast; avoid throwing inside it.
 *
 * @template T
 * @param {any} value
 *   Candidate input to validate.
 * @param {(v:any)=>boolean} isValid
 *   Validation predicate. Return true iff the input is acceptable.
 * @param {T} defaultValue
 *   Fallback to return when `value` fails validation.
 * @returns {T}
 *   The original `value` when valid; otherwise `defaultValue`.
 *
 * @example
 * // Ensure a finite number
 * normalizeOrDefault(5, v => typeof v === 'number' && Number.isFinite(v), 0) // → 5
 * normalizeOrDefault('x', v => typeof v === 'number', 0)                     // → 0
 *
 * @example
 * // Ensure an object (non-null, non-array)
 * const cfg = normalizeOrDefault(
 *   maybeCfg,
 *   v => v && typeof v === 'object' && !Array.isArray(v),
 *   {}
 * )
 */
export function normalizeOrDefault<T>(
  value: any,
  isValid: (v: any) => boolean,
  defaultValue: T,
): T
/**
 * Normalize a value to a non-empty, trimmed string; otherwise return a default (also trimmed).
 *
 * Purpose:
 *  Guarantee that downstream code receives a usable, non-empty string
 *  without performing implicit type coercion.
 *
 * Acceptance Criteria:
 *  - Accept only actual strings whose `trim()` length is > 0.
 *  - Return `value.trim()` when valid.
 *  - Otherwise return `defaultValue.trim()`.
 *
 * Why strict for strings?
 *  - Silent coercion from non-strings to string can hide bugs.
 *  - If you need to stringify other types, do it explicitly at the call site.
 *
 * Edge Cases:
 *  - If `defaultValue` is empty or whitespace-only, the function returns an empty string.
 *    Prefer providing a meaningful, non-empty default for clarity.
 *
 * @param {any} value
 *   Candidate to normalize (must be a string to be accepted).
 * @param {string} defaultValue
 *   Fallback used when `value` is not a non-empty string. Will be `trim()`ed.
 * @returns {string}
 *   A trimmed non-empty string when `value` is valid; otherwise `defaultValue.trim()`.
 *
 * @example
 * normalizeStringOrDefault('  user-roles-management:edit  ', 'fallback')
 * // → 'user-roles-management:edit'
 *
 * @example
 * normalizeStringOrDefault('', 'user-roles-management:edit')
 * // → 'user-roles-management:edit'
 *
 * @example
 * normalizeStringOrDefault(42, 'user-roles-management:edit')
 * // → 'user-roles-management:edit'
 */
export function normalizeStringOrDefault(
  value: any,
  defaultValue: string,
): string
/**
 * Normalize a value to a valid number (with safe string coercion); otherwise return a default.
 *
 * Purpose:
 *  Accept numeric inputs that may arrive as strings (e.g., from env vars or config files)
 *  while keeping semantics explicit and predictable.
 *
 * Acceptance Criteria:
 *  - Accepts finite numbers (`typeof value === 'number' && Number.isFinite(value)`).
 *  - Accepts strings that become a finite number via `Number(trimmed)`.
 *    Examples: "42", "  3.14 ", "1e3", "-7", "0x10" (JS Number semantics).
 *  - Rejects non-numeric strings (e.g., "", "   ", "abc") and non-number types.
 *  - Returns `defaultValue` when not acceptable.
 *
 * Parsing Semantics:
 *  - Uses `Number(s)` which requires the whole trimmed string to be numeric.
 *  - Honors JavaScript numeric literal rules (including hex and scientific notation).
 *  - If you want base-10 only or looser parsing, do it explicitly before calling.
 *
 * @param {any} value
 *   Candidate to normalize (number or numeric string).
 * @param {number} defaultValue
 *   Fallback used when `value` is neither a finite number nor a numeric string.
 * @returns {number}
 *   A finite number derived from `value`, or `defaultValue`.
 *
 * @example
 * normalizeNumberOrDefault(42, 0)       // → 42
 * normalizeNumberOrDefault(' 3.14 ', 0) // → 3.14
 * normalizeNumberOrDefault('1e3', 0)    // → 1000
 * normalizeNumberOrDefault('-7', 0)     // → -7
 *
 * @example
 * normalizeNumberOrDefault('abc', 7)    // → 7
 * normalizeNumberOrDefault(NaN, 7)      // → 7
 * normalizeNumberOrDefault({}, 7)       // → 7
 */
export function normalizeNumberOrDefault(
  value: any,
  defaultValue: number,
): number
/**
 * Normalize a value to a boolean (with "true"/"false" string support); otherwise return a default.
 *
 * Purpose:
 *  Stabilize feature flags and binary config values that might be provided as either booleans
 *  or as canonical strings.
 *
 * Acceptance Criteria:
 *  - Accepts actual booleans (`true` / `false`) → returned as-is.
 *  - Accepts strings equal to "true" or "false" (case-insensitive, trimmed).
 *    "true"  → true
 *    "false" → false
 *  - Rejects other strings ("yes", "1", "0", etc.) and other types → returns `defaultValue`.
 *
 * Rationale:
 *  - Limiting string forms to the canonical words avoids accidental truthiness/falseyness.
 *  - If you need to accept "1"/"0" or other variants, coerce at the call site so intent is explicit.
 *
 * @param {any} value
 *   Candidate to normalize (boolean or "true"/"false" string).
 * @param {boolean} defaultValue
 *   Fallback used when `value` is neither a boolean nor an accepted string form.
 * @returns {boolean}
 *   A boolean derived from `value`, or `defaultValue`.
 *
 * @example
 * normalizeBooleanOrDefault(true,  false) // → true
 * normalizeBooleanOrDefault(false, true)  // → false
 *
 * @example
 * normalizeBooleanOrDefault('true',  false) // → true
 * normalizeBooleanOrDefault(' FALSE ', true) // → false
 *
 * @example
 * normalizeBooleanOrDefault('yes',  false) // → false  (rejected → default)
 * normalizeBooleanOrDefault(1,      true)  // → true   (rejected → default)
 */
export function normalizeBooleanOrDefault(
  value: any,
  defaultValue: boolean,
): boolean
