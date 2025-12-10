export function getWhatsAppMediaInfo({
  token,
  mediaId,
  version,
  baseUrl,
}: {
  mediaId: string
  token: string
  version?: string
}): Promise<any>
export function downloadWhatsAppMedia({
  token,
  mediaId,
  mode,
}: {
  mediaId: string
  token: string
  mode: 'buffer' | 'stream'
}): Promise<Buffer | ReadableStream>
export function getWhatsAppApiUrls({
  phoneNumberId,
  version,
  baseUrl,
}: {
  phoneNumberId: string
  version?: string
  baseUrl?: string
}): string
export function whatsappApis({
  token,
  phoneNumberId,
  version,
}: {
  token: string
  phoneNumberId: string
  version?: string
}): WhatsAppApis
/**
 * Factory that creates WhatsApp Cloud API helper methods.
 *
 * This module wraps the WhatsApp Graph API endpoints and exposes
 * high level functions for sending text messages, interactive buttons,
 * images, videos, documents, and audio files.
 *
 * Each returned method builds the correct request format according
 * to the WhatsApp Cloud API specification.
 */
export type WhatsAppApis = {
  /**
   *   Sends a plain text message to an individual WhatsApp user.
   */
  sendMessage: Function
  /**
   *   Sends an interactive message containing buttons.
   */
  sendButtonsGroup: Function
  /**
   *   Sends an image message using a public URL.
   */
  sendPhoto: Function
  /**
   *   Sends a video file using a public URL.
   */
  sendVideo: Function
  /**
   *   Sends a document message using a public URL.
   */
  sendDocument: Function
  /**
   *   Sends an audio file using a public URL.
   */
  sendAudio: Function
}
