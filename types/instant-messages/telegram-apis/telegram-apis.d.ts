export function getTelegramApiUrls({
  token,
  telegramBaseUrl,
}: {
  token: string
  telegramBaseUrl?: string
}): TelegramApiUrls
export function telegramApis({ token }: { token: string }): TelegramApis
/**
 * Builds a full set of Telegram Bot API endpoint URLs
 * based on the provided bot token and an optional base URL.
 *
 * This helper centralizes all Telegram endpoints used by the system,
 * making it easier to mock, override, or customize for testing environments.
 */
export type TelegramApiUrls = {
  /**
   *   URL to send a text message to a chat using the Telegram Bot API.
   */
  SEND_MESSAGE: string
  /**
   *   URL to forward an existing message from one chat to another.
   */
  FORWARD_MESSAGE: string
  /**
   *   URL to send a photo to a chat.
   */
  SEND_PHOTO: string
  /**
   *   URL to send an audio file.
   */
  SEND_AUDIO: string
  /**
   *   URL to send files such as PDF, DOC, ZIP, and others supported by Telegram.
   */
  SEND_DOCUMENT: string
  /**
   *   URL to send a sticker.
   */
  SEND_STICKER: string
  /**
   *   URL to send a video file.
   */
  SEND_VIDEO: string
  /**
   *   URL to send a voice note.
   */
  SEND_VOICE: string
  /**
   *   URL to send a geolocation point.
   */
  SEND_LOCATION: string
  /**
   *   URL to send a chat action (typing, uploading photo, etc).
   */
  SEND_CHAT_ACTION: string
  /**
   *   URL to retrieve the profile photos of a specific user.
   */
  GET_USER_PROFILE_PHOTOS: string
  /**
   *   URL to poll for new updates (not used when using webhooks).
   */
  GET_UPDATES: string
  /**
   *   URL to fetch a file path for downloading a file uploaded to Telegram servers.
   */
  GET_FILE: string
}
/**
 * Factory that creates a set of high level Telegram Bot API helper methods.
 *
 * Each method sends a specific type of message (text, photo, video, document)
 * through the Telegram Bot API using the provided bot token.
 *
 * This abstraction wraps the raw URL generation logic and HTTP calls,
 * allowing higher level services to use clean method calls instead of
 * managing endpoint URLs manually.
 */
export type TelegramApis = {
  /**
   *   Sends a text message to a specific chat.
   */
  sendMessage: Function
  /**
   *   Sends a text message with an inline keyboard button group.
   */
  sendButtonsGroup: Function
  /**
   *   Sends a photo with an optional caption.
   */
  sendPhoto: Function
  /**
   *   Sends a video with an optional caption.
   */
  sendVideo: Function
  /**
   *   Sends an audio file with an optional caption.
   */
  sendAudio: Function
  /**
   *   Sends a document file with an optional caption.
   */
  sendDocument: Function
}
