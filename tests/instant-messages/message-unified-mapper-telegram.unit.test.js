import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { mapMessageTelegram } from '../../src/instant-messages/message-unified-mapper.js'

import { getTelegramMessageType } from '../../src/instant-messages/message-type.js'

import {
  MESSAGE_MEDIA_TYPE,
  MESSAGE_MEDIA_TYPE_MAPPER,
} from '../../src/instant-messages/message-types.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const MOCK_DIR_TELEGRAM = join(__dirname, './mock-messages/telegram')

describe('Telegram unified message mapper – all mock samples', () => {
  const files = readdirSync(MOCK_DIR_TELEGRAM).filter(
    (f) => extname(f) === '.json',
  )

  if (files.length === 0) {
    throw new Error('No Telegram mock message files found in directory.')
  }

  for (const file of files) {
    const filePath = join(MOCK_DIR_TELEGRAM, file)
    const raw = JSON.parse(readFileSync(filePath, 'utf8'))

    describe(`Message mock: ${file}`, () => {
      it('should map type correctly', () => {
        const unifiedType = getTelegramMessageType({ imMessage: raw })

        const unifiedMessage = mapMessageTelegram({
          imMessage: raw,
        })

        expect(unifiedMessage).toBeTypeOf('object')
        expect(unifiedType).toBeTypeOf('string')

        expect(unifiedMessage.type).toBe(
          MESSAGE_MEDIA_TYPE_MAPPER[unifiedType] || unifiedType,
        )

        expect(Object.values(MESSAGE_MEDIA_TYPE)).toContain(unifiedType)
      })

      it('should include mandatory unified fields', () => {
        const unified = mapMessageTelegram({ imMessage: raw })

        expect(unified).toHaveProperty('id')
        expect(unified).toHaveProperty('chatId')
        expect(unified).toHaveProperty('type')
        expect(unified).toHaveProperty('timestamp')
        expect(unified).toHaveProperty('chatter')
        expect(unified).toHaveProperty('imExtraInfo')

        expect(unified.chatter).toHaveProperty('id')
        expect(unified.chatter).toHaveProperty('name')
        expect(unified.imExtraInfo).toHaveProperty('tmId')
      })
    })
  }
})
