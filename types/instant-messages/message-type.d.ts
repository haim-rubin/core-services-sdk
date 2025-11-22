export function isItMediaType(
  mediaType: string,
): (params: { imMessage: any }) => boolean
export function isMessageTypeof(
  typeOfMessage: string,
): (params: { imMessage: any }) => boolean
export function isCallbackQuery({ imMessage }: { imMessage: any }): boolean
export const isItPoll: (params: { imMessage: any }) => boolean
export const isItMessage: (params: { imMessage: any }) => boolean
export const isItVoice: (params: { imMessage: any }) => boolean
export const isItVideo: (params: { imMessage: any }) => boolean
export const isItPhoto: (params: { imMessage: any }) => boolean
export const isItFreeText: (params: { imMessage: any }) => boolean
export const isItSticker: (params: { imMessage: any }) => boolean
export const isItContact: (params: { imMessage: any }) => boolean
export const isItLocation: (params: { imMessage: any }) => boolean
export const isItDocument: (params: { imMessage: any }) => boolean
export const isItVideoNote: (params: { imMessage: any }) => boolean
export const isItButtonClick: (params: { imMessage: any }) => boolean
export function getTelegramMessageType({
  imMessage,
}: {
  imMessage: any
}): string
