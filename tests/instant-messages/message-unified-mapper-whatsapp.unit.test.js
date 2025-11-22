import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import {
  getMessageType,
  mapMessageWhatsApp,
} from '../../src/instant-messages/message-unified-mapper.js'

import {
  MESSAGE_MEDIA_TYPE,
  MESSAGE_MEDIA_TYPE_MAPPER,
} from '../../src/instant-messages/message-types.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const MOCK_DIR_WHATSAPP = join(__dirname, './mock-messages/whatsapp')

describe('WhatsApp unified message mapper – all mock samples', () => {
  const files = readdirSync(MOCK_DIR_WHATSAPP).filter(
    (f) => extname(f) === '.json',
  )

  if (files.length === 0) {
    throw new Error('No WhatsApp mock message files found in directory.')
  }

  for (const file of files) {
    const filePath = join(MOCK_DIR_WHATSAPP, file)
    const raw = JSON.parse(readFileSync(filePath, 'utf8'))

    describe(`Message mock: ${file}`, () => {
      it('should map type correctly', () => {
        console.log(file)
        const unifiedType = getMessageType({ imMessage: raw })

        const unifiedMessage = mapMessageWhatsApp({
          imMessage: raw,
        })

        expect(unifiedMessage).toBeTypeOf('object')
        expect(unifiedType).toBeTypeOf('string')

        // Type must match mapper result
        expect(unifiedMessage.type).toBe(
          MESSAGE_MEDIA_TYPE_MAPPER[unifiedType] || unifiedType,
        )

        // All unified types must be supported values
        expect(Object.values(MESSAGE_MEDIA_TYPE)).toContain(unifiedType)
      })

      it('should include mandatory unified fields', () => {
        const unified = mapMessageWhatsApp({ imMessage: raw })

        expect(unified).toHaveProperty('id')
        expect(unified).toHaveProperty('chatId')
        expect(unified).toHaveProperty('type')
        expect(unified).toHaveProperty('timestamp')
        expect(unified).toHaveProperty('chatter')
        expect(unified).toHaveProperty('imExtraInfo')

        expect(unified.chatter).toHaveProperty('id')
        expect(unified.chatter).toHaveProperty('name')
        expect(unified.imExtraInfo).toHaveProperty('wbaid')
      })
    })
  }
})
