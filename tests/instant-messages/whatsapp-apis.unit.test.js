// @ts-nocheck
import { describe, it, expect, beforeEach, vi } from 'vitest'

import {
  whatsappApis,
  getWhatsAppApiUrls,
  getWhatsAppMediaInfo,
  downloadWhatsAppMedia,
} from '../../src/instant-messages/whatsapp-apis/whatsapp-apis.js'

import * as httpModule from '../../src/http/http.js'

global.fetch = vi.fn()

describe('getWhatsAppMediaInfo', () => {
  beforeEach(() => {
    fetch.mockReset()
  })

  it('returns media metadata correctly', async () => {
    const mockResponse = {
      url: 'https://cdn.whatsapp.com/file.jpg',
      mime_type: 'image/jpeg',
      id: 'ABC123',
    }

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await getWhatsAppMediaInfo({
      mediaId: 'ABC123',
      token: 'TOKEN',
    })

    expect(fetch).toHaveBeenCalledWith(
      'https://graph.facebook.com/v21.0/ABC123',
      {
        headers: {
          Authorization: 'Bearer TOKEN',
        },
      },
    )

    expect(result).toEqual(mockResponse)
  })

  it('throws on non successful response', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 403,
    })

    await expect(
      getWhatsAppMediaInfo({
        mediaId: 'MEDIA_ID',
        token: 'TOKEN',
      }),
    ).rejects.toThrow('Failed to retrieve media info: 403')
  })
})

describe('downloadWhatsAppMedia', () => {
  beforeEach(() => {
    fetch.mockReset()
  })

  it('downloads media as buffer', async () => {
    const mockMetadata = {
      url: 'https://cdn.whatsapp.com/file.jpg',
    }

    const mockBinary = new Uint8Array([10, 20, 30])

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockMetadata,
      })
      .mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => mockBinary.buffer,
      })

    const buffer = await downloadWhatsAppMedia({
      token: 'TOKEN',
      mediaId: 'MEDIA_ID',
      mode: 'buffer',
    })

    expect(Buffer.isBuffer(buffer)).toBe(true)
    expect(buffer.equals(Buffer.from(mockBinary))).toBe(true)
  })

  it('returns stream when mode=stream', async () => {
    const mockStream = { fake: 'stream' }

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: 'http://cdn.com/x' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        body: mockStream,
      })

    const stream = await downloadWhatsAppMedia({
      token: 'TOKEN',
      mediaId: 'ID',
      mode: 'stream',
    })

    expect(stream).toBe(mockStream)
  })
})

describe('getWhatsAppApiUrls', () => {
  it('generates correct messages URL', () => {
    const url = getWhatsAppApiUrls({
      phoneNumberId: '12345',
      version: 'v21.0',
    })

    expect(url).toBe('https://graph.facebook.com/v21.0/12345/messages')
  })

  it('supports custom base URL', () => {
    const url = getWhatsAppApiUrls({
      phoneNumberId: '99',
      baseUrl: 'http://localhost:3000',
      version: 'v21.0',
    })

    expect(url).toBe('http://localhost:3000/v21.0/99/messages')
  })
})

describe('whatsappApis', () => {
  let postMock

  beforeEach(() => {
    postMock = vi
      .spyOn(httpModule, 'post')
      .mockResolvedValue({ ok: true, data: 'mock-response' })
  })

  const token = 'TOKEN'
  const phoneNumberId = '111'

  const baseUrl = 'https://graph.facebook.com/v21.0/111/messages'

  it('sendMessage sends correct payload', async () => {
    const api = whatsappApis({ token, phoneNumberId })

    await api.sendMessage({
      chatId: '9725000000',
      text: 'Hello',
    })

    expect(postMock).toHaveBeenCalledWith({
      url: baseUrl,
      headers: { Authorization: 'Bearer TOKEN' },
      body: {
        recipient_type: 'individual',
        messaging_product: 'whatsapp',
        to: '9725000000',
        type: 'text',
        text: {
          preview_url: true,
          body: 'Hello',
        },
      },
    })
  })

  it('sendPhoto sends correct body', async () => {
    const api = whatsappApis({ token, phoneNumberId })

    await api.sendPhoto({
      chatId: '1',
      photo: 'http://img.jpg',
      caption: 'Hi',
    })

    expect(postMock).toHaveBeenCalledWith({
      url: baseUrl,
      headers: { Authorization: 'Bearer TOKEN' },
      body: {
        recipient_type: 'individual',
        messaging_product: 'whatsapp',
        to: '1',
        type: 'image',
        image: {
          link: 'http://img.jpg',
          caption: 'Hi',
        },
      },
    })
  })

  it('sendVideo sends filename when provided', async () => {
    const api = whatsappApis({ token, phoneNumberId })

    await api.sendVideo({
      chatId: '77',
      video: 'http://video.mp4',
      caption: 'watch',
      filename: 'clip.mp4',
    })

    expect(postMock).toHaveBeenCalledWith({
      url: baseUrl,
      headers: { Authorization: 'Bearer TOKEN' },
      body: {
        recipient_type: 'individual',
        messaging_product: 'whatsapp',
        to: '77',
        type: 'video',
        video: {
          link: 'http://video.mp4',
          caption: 'watch',
          filename: 'clip.mp4',
        },
      },
    })
  })

  it('sendDocument works without filename', async () => {
    const api = whatsappApis({ token, phoneNumberId })

    await api.sendDocument({
      chatId: '33',
      document: 'http://file.pdf',
      caption: 'doc',
    })

    expect(postMock).toHaveBeenCalledWith({
      url: baseUrl,
      headers: { Authorization: 'Bearer TOKEN' },
      body: {
        recipient_type: 'individual',
        messaging_product: 'whatsapp',
        to: '33',
        type: 'document',
        document: {
          link: 'http://file.pdf',
          caption: 'doc',
        },
      },
    })
  })

  it('sendAudio sends correct structure', async () => {
    const api = whatsappApis({ token, phoneNumberId })

    await api.sendAudio({
      chatId: '555',
      audio: 'http://a.mp3',
    })

    expect(postMock).toHaveBeenCalledWith({
      url: baseUrl,
      headers: { Authorization: 'Bearer TOKEN' },
      body: {
        recipient_type: 'individual',
        messaging_product: 'whatsapp',
        to: '555',
        type: 'audio',
        audio: {
          link: 'http://a.mp3',
        },
      },
    })
  })
})
