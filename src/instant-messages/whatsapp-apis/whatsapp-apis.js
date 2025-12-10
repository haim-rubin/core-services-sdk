import { post } from '../../http/http.js'

const WHATSAPP_API_BASE_URL = 'https://graph.facebook.com'

/**
 * Retrieves metadata for a WhatsApp media object.
 *
 * WhatsApp Cloud API does not provide the media file directly via mediaId.
 * Instead, you must first request the metadata for the media item, which
 * includes a temporary download URL. This URL can then be used to retrieve
 * the actual binary content of the file.
 *
 * The returned metadata object typically includes:
 * - `url`        A temporary URL that allows downloading the media file
 * - `mime_type`  The detected MIME type of the media
 * - `id`         The mediaId itself
 *
 * Example output from WhatsApp:
 * {
 *   "url": "https://lookaside.fbsbx.com/whatsapp_business/attachments/?mid=...",
 *   "mime_type": "image/jpeg",
 *   "id": "MEDIA_ID"
 * }
 *
 * Note:
 * The temporary download URL is short-lived and must be accessed quickly.
 *
 * @param {Object} params
 * @param {string} params.mediaId
 *   The media identifier received in an incoming WhatsApp webhook message.
 *
 * @param {string} params.token
 *   WhatsApp Cloud API access token used for authorization.
 *
 * @param {string} [params.version='v21.0']
 *   The WhatsApp Cloud API Graph version to use.
 *
 * @returns {Promise<Object>}
 *   Resolves with the media metadata object containing `url`, `mime_type`, and `id`.
 *
 * @throws {Error}
 *   If the metadata request fails or WhatsApp responds with a non successful status code.
 */
export const getWhatsAppMediaInfo = async ({
  token,
  mediaId,
  version = 'v21.0',
  baseUrl = WHATSAPP_API_BASE_URL,
}) => {
  const url = `${baseUrl}/${version}/${mediaId}`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to retrieve media info: ${res.status}`)
  }

  return res.json()
}

/**
 * Downloads WhatsApp media and returns either a Buffer or a Stream,
 * depending on mode.
 *
 * @param {Object} params
 * @param {string} params.mediaId
 * @param {string} params.token
 * @param {'buffer' | 'stream'} params.mode
 * @returns {Promise<Buffer|ReadableStream>}
 */
export const downloadWhatsAppMedia = async ({
  token,
  mediaId,
  mode = 'buffer',
}) => {
  const info = await getWhatsAppMediaInfo({ mediaId, token })
  const { url: downloadUrl } = info

  const res = await fetch(downloadUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to download media: ${res.status}`)
  }

  if (mode === 'stream') {
    return res.body
  }

  const buffer = Buffer.from(await res.arrayBuffer())
  return buffer
}

/**
 * Builds the WhatsApp Cloud API messages endpoint URL.
 *
 * This function generates the full URL required to send messages
 * through the WhatsApp Cloud API. It concatenates the base Graph API URL,
 * the selected API version, and the phone number ID to produce:
 *
 *   https://graph.facebook.com/{version}/{phoneNumberId}/messages
 *
 * The returned URL can then be used for POST requests to send text,
 * media, interactive messages, and more.
 *
 * @param {Object} params
 * @param {string} params.phoneNumberId
 *   The WhatsApp phone number ID associated with the business account.
 *
 * @param {string} [params.version='v21.0']
 *   The WhatsApp Cloud API version to use. Defaults to the current stable.
 *
 * @param {string} [params.baseUrl=WHATSAPP_API_BASE_URL]
 *   Optional override for the Graph API base URL (useful for testing or proxying).
 *
 * @returns {string}
 *   Fully resolved WhatsApp Cloud API endpoint URL for sending messages.
 */
export const getWhatsAppApiUrls = ({
  phoneNumberId,
  version = 'v21.0',
  baseUrl = WHATSAPP_API_BASE_URL,
}) => `${baseUrl}/${version}/${phoneNumberId}/messages`

/**
 * Factory that creates WhatsApp Cloud API helper methods.
 *
 * This module wraps the WhatsApp Graph API endpoints and exposes
 * high level functions for sending text messages, interactive buttons,
 * images, videos, documents, and audio files.
 *
 * Each returned method builds the correct request format according
 * to the WhatsApp Cloud API specification.
 *
 * @typedef {Object} WhatsAppApis
 *
 * @property {Function} sendMessage
 *   Sends a plain text message to an individual WhatsApp user.
 *
 * @property {Function} sendButtonsGroup
 *   Sends an interactive message containing buttons.
 *
 * @property {Function} sendPhoto
 *   Sends an image message using a public URL.
 *
 * @property {Function} sendVideo
 *   Sends a video file using a public URL.
 *
 * @property {Function} sendDocument
 *   Sends a document message using a public URL.
 *
 * @property {Function} sendAudio
 *   Sends an audio file using a public URL.
 */

/**
 * Creates a WhatsApp API client bound to a specific token, phone number ID,
 * and Graph API version.
 *
 * @param {Object} params
 * @param {string} params.token
 *   WhatsApp Cloud API access token.
 *
 * @param {string} params.phoneNumberId
 *   The phone number ID from Meta Business Manager used for sending messages.
 *
 * @param {string} [params.version='v21.0']
 *   WhatsApp Graph API version to use.
 *
 * @returns {WhatsAppApis}
 *   A set of helper functions for interacting with the WhatsApp Cloud API.
 */
export const whatsappApis = ({ token, phoneNumberId, version = 'v21.0' }) => {
  const url = getWhatsAppApiUrls({ phoneNumberId, version })

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const bodyBase = {
    recipient_type: 'individual',
    messaging_product: 'whatsapp',
  }

  return {
    /**
     * Sends a text message to an individual WhatsApp user.
     *
     * @param {Object} params
     * @param {string} params.chatId
     *   The WhatsApp number (in international format) of the recipient.
     *
     * @param {string} params.text
     *   The message content to send.
     *
     * @param {boolean} [params.preview_url=true]
     *   Whether URL previews should be generated automatically.
     *
     * @returns {Promise<import('bot-services-libs-shared').HttpResponse>}
     *   The API response from the WhatsApp Cloud API.
     */
    async sendMessage({ chatId, text, preview_url = true }) {
      const textMessage = {
        to: chatId,
        type: 'text',
        text: {
          preview_url,
          body: text,
        },
      }

      const res = await post({
        url,
        headers,
        body: {
          ...bodyBase,
          ...textMessage,
        },
      })

      return res
    },

    /**
     * Sends an interactive buttons message to a WhatsApp user.
     *
     * @param {Object} params
     * @param {string} params.chatId
     *   The recipient phone number.
     *
     * @param {Object} params.buttonsBody
     *   The full interactive object containing button definitions.
     *   The caller is expected to pass a structure matching
     *   WhatsApp's interactive message schema.
     *
     * @returns {Promise<import('bot-services-libs-shared').HttpResponse>}
     *   The API response.
     */
    async sendButtonsGroup({ chatId, buttonsBody }) {
      const res = await post({
        url,
        headers,
        body: {
          ...bodyBase,
          to: chatId,
          type: 'interactive',
          ...buttonsBody,
        },
      })

      return res
    },

    /**
     * Sends an image message using a public URL.
     *
     * @param {Object} params
     * @param {string} params.chatId
     *   The phone number of the recipient.
     *
     * @param {string} params.photo
     *   Public URL of the image.
     *
     * @param {string} [params.caption]
     *   Optional caption added to the image.
     *
     * @returns {Promise<import('bot-services-libs-shared').HttpResponse>}
     *   The API response.
     */
    async sendPhoto({ caption, photo, chatId }) {
      const res = await post({
        url,
        headers,
        body: {
          ...bodyBase,
          to: chatId,
          type: 'image',
          image: {
            link: photo,
            caption,
          },
        },
      })

      return res
    },

    /**
     * Sends a video message using a public URL.
     *
     * @param {Object} params
     * @param {string} params.chatId
     *   Recipient phone number.
     *
     * @param {string} params.video
     *   Public URL to the video file.
     *
     * @param {string} [params.caption]
     *   Optional caption added to the video.
     *
     * @param {string} [params.filename]
     *   Optional filename displayed to the user.
     *
     * @returns {Promise<import('bot-services-libs-shared').HttpResponse>}
     *   The API response.
     */
    async sendVideo({ caption, video, filename, chatId }) {
      const res = await post({
        url,
        headers,
        body: {
          ...bodyBase,
          to: chatId,
          type: 'video',
          video: {
            link: video,
            caption,
            ...(filename ? { filename } : null),
          },
        },
      })

      return res
    },

    /**
     * Sends a document file using a public URL.
     *
     * @param {Object} params
     * @param {string} params.chatId
     *   Recipient WhatsApp number.
     *
     * @param {string} params.document
     *   Public URL to the document.
     *
     * @param {string} [params.caption]
     *   Optional text caption.
     *
     * @param {string} [params.filename]
     *   Optional filename shown to the user.
     *
     * @returns {Promise<import('bot-services-libs-shared').HttpResponse>}
     *   The API response.
     */
    async sendDocument({ caption, document, filename, chatId }) {
      const res = await post({
        url,
        headers,
        body: {
          ...bodyBase,
          to: chatId,
          type: 'document',
          document: {
            link: document,
            caption,
            ...(filename ? { filename } : null),
          },
        },
      })

      return res
    },

    /**
     * Sends an audio message using a public URL.
     *
     * @param {Object} params
     * @param {string} params.chatId
     *   The phone number of the recipient.
     *
     * @param {string} params.audio
     *   Public URL to the audio file.
     *
     * @returns {Promise<import('bot-services-libs-shared').HttpResponse>}
     *   The API response.
     */
    async sendAudio({ audio, chatId }) {
      const res = await post({
        url,
        headers,
        body: {
          ...bodyBase,
          to: chatId,
          type: 'audio',
          audio: {
            link: audio,
          },
        },
      })

      return res
    },
  }
}
