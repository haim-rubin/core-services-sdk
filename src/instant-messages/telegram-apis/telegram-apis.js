import { post } from '../../http/http.js'

const TELEGRAM_API_BASE_URL = 'https://api.telegram.org'

/**
 * Builds a full set of Telegram Bot API endpoint URLs
 * based on the provided bot token and an optional base URL.
 *
 * This helper centralizes all Telegram endpoints used by the system,
 * making it easier to mock, override, or customize for testing environments.
 *
 * @typedef {Object} TelegramApiUrls
 * @property {string} SEND_MESSAGE
 *   URL to send a text message to a chat using the Telegram Bot API.
 *
 * @property {string} FORWARD_MESSAGE
 *   URL to forward an existing message from one chat to another.
 *
 * @property {string} SEND_PHOTO
 *   URL to send a photo to a chat.
 *
 * @property {string} SEND_AUDIO
 *   URL to send an audio file.
 *
 * @property {string} SEND_DOCUMENT
 *   URL to send files such as PDF, DOC, ZIP, and others supported by Telegram.
 *
 * @property {string} SEND_STICKER
 *   URL to send a sticker.
 *
 * @property {string} SEND_VIDEO
 *   URL to send a video file.
 *
 * @property {string} SEND_VOICE
 *   URL to send a voice note.
 *
 * @property {string} SEND_LOCATION
 *   URL to send a geolocation point.
 *
 * @property {string} SEND_CHAT_ACTION
 *   URL to send a chat action (typing, uploading photo, etc).
 *
 * @property {string} GET_USER_PROFILE_PHOTOS
 *   URL to retrieve the profile photos of a specific user.
 *
 * @property {string} GET_UPDATES
 *   URL to poll for new updates (not used when using webhooks).
 *
 * @property {string} GET_FILE
 *   URL to fetch a file path for downloading a file uploaded to Telegram servers.
 */

/**
 * Generates Telegram Bot API endpoint URLs for the given bot token.
 *
 * @param {Object} params
 * @param {string} params.token
 *   The bot token obtained from BotFather.
 *
 * @param {string} [params.telegramBaseUrl=TELEGRAM_API_BASE_URL]
 *   Optional override for the Telegram API base URL.
 *   Useful for testing or for proxying requests.
 *
 * @returns {TelegramApiUrls}
 *   A dictionary of fully resolved Telegram API endpoint URLs.
 */
export const getTelegramApiUrls = ({
  token,
  telegramBaseUrl = TELEGRAM_API_BASE_URL,
}) => ({
  SEND_MESSAGE: `${telegramBaseUrl}/bot${token}/sendMessage`,
  FORWARD_MESSAGE: `${telegramBaseUrl}/bot${token}/forwardMessage`,
  SEND_PHOTO: `${telegramBaseUrl}/bot${token}/sendPhoto`,
  SEND_AUDIO: `${telegramBaseUrl}/bot${token}/sendAudio`,
  SEND_DOCUMENT: `${telegramBaseUrl}/bot${token}/sendDocument`,
  SEND_STICKER: `${telegramBaseUrl}/bot${token}/sendSticker`,
  SEND_VIDEO: `${telegramBaseUrl}/bot${token}/sendVideo`,
  SEND_VOICE: `${telegramBaseUrl}/bot${token}/sendVoice`,
  SEND_LOCATION: `${telegramBaseUrl}/bot${token}/sendLocation`,
  SEND_CHAT_ACTION: `${telegramBaseUrl}/bot${token}/sendChatAction`,
  GET_USER_PROFILE_PHOTOS: `${telegramBaseUrl}/bot${token}/getUserProfilePhotos`,
  GET_UPDATES: `${telegramBaseUrl}/bot${token}/getUpdates`,
  GET_FILE: `${telegramBaseUrl}/bot${token}/getFile`,
})

/**
 * Factory that creates a set of high level Telegram Bot API helper methods.
 *
 * Each method sends a specific type of message (text, photo, video, document)
 * through the Telegram Bot API using the provided bot token.
 *
 * This abstraction wraps the raw URL generation logic and HTTP calls,
 * allowing higher level services to use clean method calls instead of
 * managing endpoint URLs manually.
 *
 * @typedef {Object} TelegramApis
 *
 * @property {Function} sendMessage
 *   Sends a text message to a specific chat.
 *
 * @property {Function} sendButtonsGroup
 *   Sends a text message with an inline keyboard button group.
 *
 * @property {Function} sendPhoto
 *   Sends a photo with an optional caption.
 *
 * @property {Function} sendVideo
 *   Sends a video with an optional caption.
 *
 * @property {Function} sendAudio
 *   Sends an audio file with an optional caption.
 *
 * @property {Function} sendDocument
 *   Sends a document file with an optional caption.
 */

/**
 * Creates Telegram API methods bound to a specific bot token.
 *
 * @param {Object} params
 * @param {string} params.token
 *   Telegram bot token obtained from BotFather.
 *
 * @returns {TelegramApis}
 *   An object containing all supported Telegram message sending functions.
 */
export const telegramApis = ({ token }) => {
  const APIS = getTelegramApiUrls({ token })

  return {
    /**
     * Sends a text message to a Telegram chat.
     *
     * @param {Object} params
     * @param {string} params.text
     *   The message content.
     *
     * @param {number|string} params.chatId
     *   Chat identifier where the message should be sent.
     *
     * @param {Array<Object>} [params.entities]
     *   Optional entities for formatting (bold, URL, etc).
     *
     * @returns {Promise<import('../../http/http.js').HttpResponse>}
     *   Telegram API response.
     */
    async sendMessage({ text, chatId, entities }) {
      const res = await post({
        url: APIS.SEND_MESSAGE,
        body: {
          chat_id: chatId,
          text,
          entities,
        },
      })
      return res
    },

    /**
     * Sends a text message with inline keyboard buttons.
     *
     * @param {Object} params
     * @param {string} params.text
     *   The message content.
     *
     * @param {number|string} params.chatId
     *   Chat identifier.
     *
     * @param {Array<Array<Object>>} params.options
     *   Two dimensional array of inline keyboard button objects.
     *
     * @returns {Promise<import('../../http/http.js').HttpResponse>}
     *   Telegram API response.
     */
    async sendButtonsGroup({ text, chatId, options }) {
      const res = await post({
        url: APIS.SEND_MESSAGE,
        body: {
          chat_id: chatId,
          text,
          reply_markup: {
            inline_keyboard: options,
          },
        },
      })
      return res
    },

    /**
     * Sends a photo message using an HTTP URL.
     *
     * @param {Object} params
     * @param {number|string} params.chatId
     *   Chat identifier.
     *
     * @param {string} params.photo
     *   Publicly accessible HTTP URL of the photo.
     *
     * @param {string} [params.caption]
     *   Optional caption for the photo.
     *
     * @returns {Promise<import('../../http/http.js').HttpResponse>}
     *   Telegram API response.
     */
    async sendPhoto({ caption, photo, chatId }) {
      const res = await post({
        url: APIS.SEND_PHOTO,
        body: {
          chat_id: chatId,
          caption,
          photo,
        },
      })
      return res
    },

    /**
     * Sends a video message using an HTTP URL.
     *
     * @param {Object} params
     * @param {number|string} params.chatId
     *   Chat identifier.
     *
     * @param {string} params.video
     *   Public video URL.
     *
     * @param {string} [params.caption]
     *   Optional caption.
     *
     * @returns {Promise<import('../../http/http.js').HttpResponse>}
     *   Telegram API response.
     */
    async sendVideo({ caption, video, chatId }) {
      const res = await post({
        url: APIS.SEND_VIDEO,
        body: {
          chat_id: chatId,
          caption,
          video,
        },
      })
      return res
    },

    /**
     * Sends an audio message using an HTTP URL.
     *
     * @param {Object} params
     * @param {number|string} params.chatId
     *   Chat identifier.
     *
     * @param {string} params.audio
     *   Public audio URL.
     *
     * @param {string} [params.caption]
     *   Optional caption.
     *
     * @returns {Promise<import('../../http/http.js').HttpResponse>}
     *   Telegram API response.
     */
    async sendAudio({ caption, audio, chatId }) {
      const res = await post({
        url: APIS.SEND_AUDIO,
        body: {
          chat_id: chatId,
          caption,
          audio,
        },
      })
      return res
    },

    /**
     * Sends a document file using an HTTP URL.
     *
     * @param {Object} params
     * @param {number|string} params.chatId
     *   Chat identifier.
     *
     * @param {string} params.document
     *   URL to the document file.
     *
     * @param {string} [params.caption]
     *   Optional caption.
     *
     * @returns {Promise<import('../../http/http.js').HttpResponse>}
     *   Telegram API response.
     */
    async sendDocument({ caption, document, chatId }) {
      const res = await post({
        url: APIS.SEND_DOCUMENT,
        body: {
          chat_id: chatId,
          caption,
          document,
        },
      })
      return res
    },
  }
}
