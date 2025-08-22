import * as fs from 'fs/promises'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { loadTemplates } from '../../src/templates/template-loader.js'

vi.mock('fs/promises')

describe('loadTemplates', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should compile inline template strings correctly', async () => {
    const templates = {
      subject: 'Hello {{=it.name}}',
      html: '<div>{{=it.body}}</div>',
    }

    const compiled = await loadTemplates(templates)

    expect(typeof compiled.subject).toBe('function')
    expect(typeof compiled.html).toBe('function')

    // test compiled output
    const result = compiled.subject({ name: 'Haim' })
    expect(result).toBe('Hello Haim')
  })

  it('should read from file path if input is a file', async () => {
    const fakeFileContent = 'Welcome {{=it.username}}'

    // @ts-ignore
    fs.lstat.mockResolvedValueOnce({
      isFile: () => true,
    })
    // @ts-ignore
    fs.readFile.mockResolvedValueOnce(fakeFileContent)

    const compiled = await loadTemplates({
      subject: '/path/to/template.dot',
    })

    expect(fs.readFile).toHaveBeenCalledWith('/path/to/template.dot', 'utf-8')
    expect(typeof compiled.subject).toBe('function')
    expect(compiled.subject({ username: 'DotUser' })).toBe('Welcome DotUser')
  })

  it('should treat string as content if path is invalid', async () => {
    // @ts-ignore
    fs.lstat.mockRejectedValueOnce(new Error('File not found'))

    const compiled = await loadTemplates({
      subject: 'Hi {{=it.x}}',
    })

    expect(typeof compiled.subject).toBe('function')
    expect(compiled.subject({ x: 'there' })).toBe('Hi there')
  })
})
