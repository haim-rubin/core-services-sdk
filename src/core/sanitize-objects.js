/**
 * Creates a new object containing only the key-value pairs that pass the provided filter function.
 *
 * @param {Object} obj - The object to sanitize.
 * @param {(entry: [string, any]) => boolean} filter - A function that determines whether to include each `[key, value]` entry.
 * @returns {Object} A new object with only the filtered entries.
 *
 * @example
 * sanitizeObject({ a: 1, b: undefined }, ([, v]) => v !== undefined) // { a: 1 }
 */
export const sanitizeObject = (obj, filter) =>
  Object.fromEntries(Object.entries(obj).filter(filter))

/**
 * Removes all properties from the object whose values are `undefined`.
 *
 * @param {Object} obj - The object to sanitize.
 * @returns {Object} A new object without `undefined` values.
 *
 * @example
 * sanitizeUndefinedFields({ a: 1, b: undefined }) // { a: 1 }
 */
export const sanitizeUndefinedFields = (obj) =>
  sanitizeObject(obj, ([, value]) => value !== undefined)

/**
 * Returns a new object containing only the specified allowed properties.
 *
 * @param {Object} obj - The original object.
 * @param {string[]} [allowedFields=[]] - An array of property names to retain.
 * @returns {Object} A new object containing only the allowed properties.
 *
 * @example
 * sanitizeObjectAllowProps({ a: 1, b: 2 }, ['a']) // { a: 1 }
 */
export const sanitizeObjectAllowProps = (obj, allowedFields = []) =>
  sanitizeObject(obj, ([key]) => allowedFields.includes(key))

/**
 * Returns a new object excluding the specified disallowed properties.
 *
 * @param {Object} obj - The original object.
 * @param {string[]} [disallowedFields=[]] - An array of property names to exclude.
 * @returns {Object} A new object without the disallowed properties.
 *
 * @example
 * sanitizeObjectDisallowProps({ a: 1, b: 2 }, ['b']) // { a: 1 }
 */
export const sanitizeObjectDisallowProps = (obj, disallowedFields = []) =>
  sanitizeObject(obj, ([key]) => !disallowedFields.includes(key))
