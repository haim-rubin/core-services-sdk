// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getTelegramApiUrls,
  telegramApis,
} from '../../src/instant-messages/telegram-apis/telegram-apis.js'
import * as httpModule from '../../src/http/http.js'

describe('getTelegramApiUrls', () => {
  it('builds correct Telegram API URLs', () => {
    const token = 'TEST_TOKEN'
    const urls = getTelegramApiUrls({ token })

    expect(urls.SEND_MESSAGE).toBe(
      `https://api.telegram.org/bot${token}/sendMessage`,
    )
    expect(urls.FORWARD_MESSAGE).toBe(
      `https://api.telegram.org/bot${token}/forwardMessage`,
    )
    expect(urls.SEND_PHOTO).toBe(
      `https://api.telegram.org/bot${token}/sendPhoto`,
    )
    expect(urls.GET_FILE).toBe(`https://api.telegram.org/bot${token}/getFile`)
  })

  it('supports custom base URL', () => {
    const token = 'X'
    const baseUrl = 'http://localhost:9999'
    const urls = getTelegramApiUrls({ token, telegramBaseUrl: baseUrl })

    expect(urls.SEND_MESSAGE).toBe(`${baseUrl}/bot${token}/sendMessage`)
  })
})

describe('telegramApis', () => {
  const token = 'MOCK_TOKEN'
  let postMock

  beforeEach(() => {
    postMock = vi.spyOn(httpModule, 'post').mockResolvedValue({
      ok: true,
      result: 'mock-response',
    })
  })

  it('sends text message with correct body', async () => {
    const api = telegramApis({ token })
    await api.sendMessage({ text: 'hello', chatId: 123 })

    expect(postMock).toHaveBeenCalledWith({
      url: `https://api.telegram.org/bot${token}/sendMessage`,
      body: {
        chat_id: 123,
        text: 'hello',
        entities: undefined,
      },
    })
  })

  it('sends inline keyboard buttons', async () => {
    const api = telegramApis({ token })
    const options = [[{ text: 'A', callback_data: '1' }]]

    await api.sendButtonsGroup({
      text: 'Choose',
      chatId: 10,
      options,
    })

    expect(postMock).toHaveBeenCalledWith({
      url: `https://api.telegram.org/bot${token}/sendMessage`,
      body: {
        chat_id: 10,
        text: 'Choose',
        reply_markup: {
          inline_keyboard: options,
        },
      },
    })
  })

  it('sends a photo with caption', async () => {
    const api = telegramApis({ token })

    await api.sendPhoto({
      chatId: 77,
      photo: 'http://photo.jpg',
      caption: 'hi',
    })

    expect(postMock).toHaveBeenCalledWith({
      url: `https://api.telegram.org/bot${token}/sendPhoto`,
      body: {
        chat_id: 77,
        caption: 'hi',
        photo: 'http://photo.jpg',
      },
    })
  })

  it('sends a video', async () => {
    const api = telegramApis({ token })

    await api.sendVideo({
      chatId: 55,
      video: 'http://video.mp4',
      caption: 'watch this',
    })

    expect(postMock).toHaveBeenCalledWith({
      url: `https://api.telegram.org/bot${token}/sendVideo`,
      body: {
        chat_id: 55,
        caption: 'watch this',
        video: 'http://video.mp4',
      },
    })
  })

  it('sends an audio file', async () => {
    const api = telegramApis({ token })

    await api.sendAudio({
      chatId: 200,
      audio: 'http://audio.mp3',
      caption: 'listen',
    })

    expect(postMock).toHaveBeenCalledWith({
      url: `https://api.telegram.org/bot${token}/sendAudio`,
      body: {
        chat_id: 200,
        caption: 'listen',
        audio: 'http://audio.mp3',
      },
    })
  })

  it('sends a document', async () => {
    const api = telegramApis({ token })

    await api.sendDocument({
      chatId: 999,
      document: 'http://file.pdf',
      caption: 'file',
    })

    expect(postMock).toHaveBeenCalledWith({
      url: `https://api.telegram.org/bot${token}/sendDocument`,
      body: {
        chat_id: 999,
        caption: 'file',
        document: 'http://file.pdf',
      },
    })
  })
})
