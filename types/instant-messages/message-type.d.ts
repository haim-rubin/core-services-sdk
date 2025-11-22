export function isItMediaType(
  mediaType: string,
): (params: { originalMessage: any }) => boolean
export function isMessageTypeof(
  typeOfMessage: string,
): (params: { originalMessage: any }) => boolean
export function isCallbackQuery({
  originalMessage,
}: {
  originalMessage: any
}): boolean
export const isItPoll: (params: { originalMessage: any }) => boolean
export const isItMessage: (params: { originalMessage: any }) => boolean
export const isItVoice: (params: { originalMessage: any }) => boolean
export const isItVideo: (params: { originalMessage: any }) => boolean
export const isItPhoto: (params: { originalMessage: any }) => boolean
export const isItFreeText: (params: { originalMessage: any }) => boolean
export const isItSticker: (params: { originalMessage: any }) => boolean
export const isItContact: (params: { originalMessage: any }) => boolean
export const isItLocation: (params: { originalMessage: any }) => boolean
export const isItDocument: (params: { originalMessage: any }) => boolean
export const isItVideoNote: (params: { originalMessage: any }) => boolean
export const isItButtonClick: (params: { originalMessage: any }) => boolean
export function getTelegramMessageType({
  originalMessage,
}: {
  originalMessage: any
}): string
