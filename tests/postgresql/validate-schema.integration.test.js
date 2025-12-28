import { describe, it, beforeAll, afterAll, expect } from 'vitest'

import {
  startPostgres,
  stopPostgres,
  buildPostgresUri,
} from '../../src/postgresql/start-stop-postgres-docker.js'
import { connectToPg } from '../../src/postgresql/connect-to-pg.js'
import { validateSchema } from '../../src/postgresql/validate-schema.js'

const PG_OPTIONS = {
  port: 5431,
  containerName: 'postgres-validate-schema-test-5431',
  user: 'testuser',
  pass: 'testpass',
  db: 'testdb',
}

const DATABASE_URI = buildPostgresUri(PG_OPTIONS)

describe('validateSchema', () => {
  beforeAll(async () => {
    startPostgres(PG_OPTIONS)

    const db = connectToPg(DATABASE_URI)

    // create one table only
    await db.schema.createTable('files', (table) => {
      table.string('id').primary()
    })

    await db.destroy()
  })

  afterAll(() => {
    stopPostgres(PG_OPTIONS.containerName)
  })

  it('does not throw when all required tables exist', async () => {
    await expect(
      validateSchema({ connection: DATABASE_URI, tables: ['files'] }),
    ).resolves.not.toThrow()
  })

  it('throws a single error listing missing tables', async () => {
    await expect(
      validateSchema({
        connection: DATABASE_URI,
        tables: ['files', 'documents', 'attachments'],
      }),
    ).rejects.toThrow('Missing the following tables: documents, attachments')
  })

  it('throws when all tables are missing', async () => {
    await expect(
      validateSchema({
        connection: DATABASE_URI,
        tables: ['missing_a', 'missing_b'],
      }),
    ).rejects.toThrow('Missing the following tables: missing_a, missing_b')
  })
})
