/**
 * Mask middle of a primitive value while keeping left/right edges.
 * @param {string|number|boolean|null|undefined} value
 * @param {string} [fill='•']
 * @param {number} [maskLen=3]
 * @param {number} [left=4]
 * @param {number} [right=4]
 * @returns {string}
 */
export const maskSingle = (
  value,
  fill = '•',
  maskLen = 3,
  left = 4,
  right = 4,
) => {
  if (value == null) {
    return ''
  }
  const str = String(value)
  if (str.length === 0) {
    return ''
  }
  const m = Math.max(1, maskLen)

  if (str.length <= left + right) {
    if (str.length === 1) {
      return fill
    }
    if (str.length === 2) {
      return str[0] + fill.repeat(2) // "ab" -> "a••"
    }
    return str.slice(0, 1) + fill.repeat(m) + str.slice(-1)
  }

  return str.slice(0, left) + fill.repeat(m) + str.slice(-right)
}

/**
 * Recursively mask values in strings, numbers, booleans, arrays, and objects.
 * @param {string|number|boolean|Array|Object|null|undefined} value
 * @param {string} [fill='•']
 * @param {number} [maskLen=3]
 * @param {number} [left=4]
 * @param {number} [right=4]
 * @returns {string|Array|Object}
 */
export const mask = (value, fill = '•', maskLen = 3, left = 4, right = 4) => {
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
