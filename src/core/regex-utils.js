/**
 * Checks whether the given input is a valid regular expression.
 *
 * - If the input is an instance of `RegExp`, returns `true`.
 * - If the input is a string, attempts to create a `RegExp` object from it and returns `true` if valid.
 * - Returns `false` for any other types or if the string is an invalid regex pattern.
 *
 * @param {string | RegExp} pattern - The regex pattern to validate, either as a string or a RegExp object.
 * @returns {boolean} `true` if the pattern is a valid regular expression, otherwise `false`.
 *
 * @example
 * isValidRegex('^[a-z]+$')       // true
 * isValidRegex(/^[a-z]+$/)       // true
 * isValidRegex('[')              // false
 * isValidRegex(123)              // false
 */

export const isValidRegex = (pattern) => {
  if (pattern instanceof RegExp) return true
  if (typeof pattern !== 'string') return false
  try {
    new RegExp(pattern)
    return true
  } catch {
    return false
  }
}
