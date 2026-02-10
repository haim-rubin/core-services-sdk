import fs from 'node:fs'

/**
 * Loads and parses a JSON file relative to a module URL.
 *
 * @param {string|URL} moduleUrl
 * @param {string} relativePath
 * @returns {any}
 */
export function loadJson(moduleUrl, relativePath) {
  const fileUrl = new URL(relativePath, moduleUrl)
  const raw = fs.readFileSync(fileUrl, 'utf8')

  return JSON.parse(raw)
}
