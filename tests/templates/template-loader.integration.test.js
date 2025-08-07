import { join } from 'path'
import { tmpdir } from 'os'
import { writeFile, rm, mkdir } from 'fs/promises'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

import { loadTemplates } from '../../src/templates/template-loader.js'

const tempDir = join(tmpdir(), 'template-tests')

const createTempTemplateFile = async (filename, content) => {
  const filePath = join(tempDir, filename)
  await writeFile(filePath, content, 'utf-8')
  return filePath
}

describe('loadTemplates with real files', () => {
  let subjectPath, htmlPath

  beforeAll(async () => {
    await rm(tempDir, { recursive: true, force: true }).catch(() => {})
    await mkdir(tempDir, { recursive: true })

    subjectPath = await createTempTemplateFile(
      'subject.dot',
      'Hello {{=it.name}}',
    )
    htmlPath = await createTempTemplateFile(
      'body.dot',
      '<div>{{=it.body}}</div>',
    )
  })

  afterAll(async () => {
    await rm(tempDir, { recursive: true, force: true })
  })

  it('should correctly read and compile templates from file paths', async () => {
    const templates = await loadTemplates({
      subject: subjectPath,
      html: htmlPath,
    })

    const subjectResult = templates.subject({ name: 'Alice' })
    const htmlResult = templates.html({ body: 'Welcome!' })

    expect(subjectResult).toBe('Hello Alice')
    expect(htmlResult).toBe('<div>Welcome!</div>')
  })
})
