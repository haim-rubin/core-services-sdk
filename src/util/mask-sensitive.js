/**
 * Mask middle of a primitive value while keeping left/right edges.
 * @param {string|number|boolean|null|undefined} value
 * @param {string} [fill='.']
 * @param {number} [maskLen=2]
 * @param {number} [left=4]
 * @param {number} [right=4]
 * @returns {string}
 */
export const maskSingle = (
  value,
  fill = '.',
  maskLen = null,
  left = 2,
  right = 2,
) => {
  if (value == null) {
    return ''
  }

  const str = String(value)

  if (str.length === 0) {
    return ''
  }

  if (typeof value === 'boolean') {
    return str
  }

  // default: max 3 mask characters
  const calculated = Math.max(1, str.length - (left + right))
  const m = maskLen == null ? Math.min(3, calculated) : Math.max(0, maskLen)

  if (str.length <= left + right) {
    if (str.length === 1) {
      return fill
    }

    if (str.length === 2) {
      return str[0] + fill
    }

    return str.slice(0, 1) + fill.repeat(m) + str.slice(-1)
  }

  return str.slice(0, left) + fill.repeat(m) + str.slice(-right)
}

/**
 * Recursively mask values in strings, numbers, booleans, arrays, and objects.
 * @param {string|number|boolean|Array|Object|null|undefined} value
 * @param {string} [fill='.']
 * @param {number} [maskLen=2]
 * @param {number} [left=4]
 * @param {number} [right=4]
 * @returns {string|Array|Object}
 */
export const mask = (
  value,
  fill = '.',
  maskLen = null,
  left = 2,
  right = 2,
) => {
  const type = typeof value

  if (value instanceof Date) {
    const isoDate = value.toISOString()
    return maskSingle(isoDate, '', isoDate.length, 0, 0)
  }

  if (value == null || (value && ['string', 'number'].includes(type))) {
    return maskSingle(value, fill, maskLen, left, right)
  }

  if (type === 'boolean') {
    return maskSingle(value, '', 0, 0, 0)
  }

  if (Array.isArray(value)) {
    return value.map((aValue) => mask(aValue, fill, maskLen, left, right))
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([prop, propValue]) => [
        prop,
        mask(propValue, fill, maskLen, left, right),
      ]),
    )
  }

  return value
}
