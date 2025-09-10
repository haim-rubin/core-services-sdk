export const normalizeOperators = (obj) => {
  const arrayOps = ['in', 'nin', 'or', 'and']

  function normalize(value) {
    if (Array.isArray(value)) {
      return value.map(normalize)
    } else if (typeof value === 'object' && value !== null) {
      // Handle objects with numeric keys (e.g. {0: {...}, 1: {...}})
      const keys = Object.keys(value)
      if (keys.every((k) => /^\d+$/.test(k))) {
        return keys.sort().map((k) => normalize(value[k]))
      }
      for (const [k, v] of Object.entries(value)) {
        value[k] = normalize(v)
        if (arrayOps.includes(k)) {
          value[k] = Array.isArray(value[k]) ? value[k] : [value[k]]
        }
      }
    }
    return value
  }

  return normalize(obj)
}
