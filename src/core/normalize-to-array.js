/**
 * Normalizes an input value to an array of trimmed, non-empty strings.
 *
 * - If the input is `undefined` or `null`, returns an empty array.
 * - If the input is an array, it trims each string element and filters out empty values.
 * - If the input is a string (or coercible to string), it splits it by commas,
 *   trims each item, and filters out empty values.
 *
 * @param {any} value - The value to normalize. Can be a string, array, or any other type.
 * @returns {string[]} An array of trimmed, non-empty strings.
 *
 * @example
 * normalizeToArray('a,b, c , ,d') // ['a', 'b', 'c', 'd']
 * normalizeToArray([' a ', 'b', '', '   ']) // ['a', 'b']
 * normalizeToArray(null) // []
 * normalizeToArray(123) // ['123']
 */
export const normalizeToArray = (value) => {
  if (value === undefined || value === null) {
    return []
  }

  const isArray = Array.isArray(value)
  const rawArray = isArray ? value : String(value).split(',')

  const arrayFiltered = rawArray
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)

  return arrayFiltered
}
