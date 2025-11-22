import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

import { messageUnifiedMapper } from '../../src/instant-messages/message-unified-mapper.js'

import { MESSAGE_MEDIA_TYPE } from '../../src/instant-messages/message-types.js'
import { IM_PLATFORM } from '../../src/instant-messages/im-platform.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const MOCK_DIR_WHATSAPP = join(__dirname, './mock-messages/whatsapp')
const MOCK_DIR_TELEGRAM = join(__dirname, './mock-messages/telegram')

/**
 * Loads all mock JSON files from directory and returns:
 * [
 *   { application: 'whatsapp', file: 'x.json', json: {...} }
 * ]
 */
function loadMocks() {
  const list = []

  const whatsappFiles = readdirSync(MOCK_DIR_WHATSAPP).filter(
    (f) => extname(f) === '.json',
  )
  for (const file of whatsappFiles) {
    const raw = JSON.parse(readFileSync(join(MOCK_DIR_WHATSAPP, file), 'utf8'))
    list.push({
      application: IM_PLATFORM.WHATSAPP,
      file,
      raw,
    })
  }

  const telegramFiles = readdirSync(MOCK_DIR_TELEGRAM).filter(
    (f) => extname(f) === '.json',
  )
  for (const file of telegramFiles) {
    const raw = JSON.parse(readFileSync(join(MOCK_DIR_TELEGRAM, file), 'utf8'))
    list.push({
      application: IM_PLATFORM.TELEGRAM,
      file,
      raw,
    })
  }

  return list
}

describe('Unified message mapper – all platforms, all mock samples', () => {
  const samples = loadMocks()

  if (samples.length === 0) {
    throw new Error('No mock message files for unified mapper test.')
  }

  for (const sample of samples) {
    const { application, file, raw } = sample

    describe(`${application} – ${file}`, () => {
      it('should map unified message correctly', () => {
        const mapper = messageUnifiedMapper[application]
        expect(mapper).toBeTypeOf('function')

        const unified = mapper({ originalMessage: raw })

        expect(unified).toBeTypeOf('object')
        expect(unified).toHaveProperty('id')
        expect(unified).toHaveProperty('chatId')
        expect(unified).toHaveProperty('type')
        expect(unified).toHaveProperty('timestamp')
        expect(unified).toHaveProperty('chatter')
        expect(unified).toHaveProperty('imExtraInfo')

        expect(Object.values(MESSAGE_MEDIA_TYPE)).toContain(unified.type)

        expect(unified.chatter).toHaveProperty('id')
        expect(unified.chatter).toHaveProperty('name')

        if (application === IM_PLATFORM.WHATSAPP) {
          expect(unified.imExtraInfo).toHaveProperty('wbaid')
        }

        if (application === IM_PLATFORM.TELEGRAM) {
          expect(unified.imExtraInfo).toHaveProperty('tmId')
        }
      })
    })
  }
})
