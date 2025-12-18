/**
 * Parses a value that may be a JSON string or already a parsed object.
 *
 * @param {any} value
 *   The value to parse.
 *
 * @returns {any}
 *   Parsed JSON if value is a string, otherwise the original value.
 *
 * @throws {Error}
 *   Throws if the string is not valid JSON.
 */
export const parseJsonIfString = (value) => {
  if (typeof value === 'string') {
    return JSON.parse(value)
  }

  return value
}
