import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

import { loadJson } from '../../src/json/load-json.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('loadJson', () => {
  it('loads and parses a JSON file relative to module URL', () => {
    const moduleUrl = new URL(`file://${__dirname}/dummy.js`)

    const result = loadJson(moduleUrl, './fixtures/valid.json')

    expect(result).toEqual({
      foo: 'bar',
      answer: 42,
    })
  })

  it('throws if file does not exist', () => {
    const moduleUrl = new URL(`file://${__dirname}/dummy.js`)

    expect(() => {
      loadJson(moduleUrl, './fixtures/missing.json')
    }).toThrow()
  })

  it('throws if JSON is invalid', () => {
    const moduleUrl = new URL(`file://${__dirname}/dummy.js`)

    expect(() => {
      loadJson(moduleUrl, './fixtures/invalid.json')
    }).toThrow(SyntaxError)
  })
})
