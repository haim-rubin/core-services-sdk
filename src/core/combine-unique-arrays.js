/**
 * Combines multiple arrays into a single flat array with unique values.
 *
 * Removes duplicate entries and preserves the order of first appearance.
 *
 * @param {...Array<any>} lists - One or more arrays to combine.
 * @returns {Array<any>} A new array containing unique values from all input arrays.
 *
 * @example
 * combineUniqueArrays([1, 2, 3], [3, 4], [5]) // [1, 2, 3, 4, 5]
 * combineUniqueArrays(['a', 'b'], ['b', 'c']) // ['a', 'b', 'c']
 */
export const combineUniqueArrays = (...lists) => {
  return Array.from(new Set(lists.flat()))
}
