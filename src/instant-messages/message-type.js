import { MESSAGE_MEDIA_TYPE, MESSAGE_TYPE } from './/message-types.js'

export const isItMediaType =
  (mediaType) =>
  ({ originalMessage: { message } }) => {
    return mediaType in message
  }

export const isMessageTypeof =
  (typeOfMessage) =>
  ({ originalMessage: { type } }) => {
    return type === typeOfMessage
  }

export const isCallbackQuery = ({ originalMessage }) => {
  return 'callback_query' in originalMessage
}

export const isItPoll = isItMediaType(MESSAGE_MEDIA_TYPE.POLL)
export const isItVideoNote = isItMediaType(MESSAGE_MEDIA_TYPE.VIDEO_NOTE)
export const isItVoice = isItMediaType(MESSAGE_MEDIA_TYPE.VOICE)
export const isItLocation = isItMediaType(MESSAGE_MEDIA_TYPE.LOCATION)
export const isItVideo = isItMediaType(MESSAGE_MEDIA_TYPE.VIDEO)
export const isItPhoto = isItMediaType(MESSAGE_MEDIA_TYPE.PHOTO)
export const isItDocument = isItMediaType(MESSAGE_MEDIA_TYPE.DOCUMENT)
export const isItFreeText = isItMediaType(MESSAGE_MEDIA_TYPE.TEXT)
export const isItButtonClick = isMessageTypeof(MESSAGE_TYPE.BUTTON_CLICK)
export const isItMessage = isMessageTypeof(MESSAGE_TYPE.MESSAGE)
export const isItSticker = isItMediaType(MESSAGE_MEDIA_TYPE.STICKER)
export const isItContact = isItMediaType(MESSAGE_MEDIA_TYPE.CONTACT)

export const getMessageType = ({ originalMessage }) => {
  switch (true) {
    case isCallbackQuery({ originalMessage }):
      return MESSAGE_TYPE.BUTTON_CLICK
    case isItFreeText({ originalMessage }):
      return MESSAGE_MEDIA_TYPE.TEXT
    case isItVideo({ originalMessage }):
      return MESSAGE_MEDIA_TYPE.VIDEO
    case isItPhoto({ originalMessage }):
      return MESSAGE_MEDIA_TYPE.PHOTO
    case isItDocument({ originalMessage }):
      return MESSAGE_MEDIA_TYPE.DOCUMENT
    case isItLocation({ originalMessage }):
      return MESSAGE_MEDIA_TYPE.LOCATION
    case isItVoice({ originalMessage }):
      return MESSAGE_MEDIA_TYPE.VOICE
    case isItVideoNote({ originalMessage }):
      return MESSAGE_MEDIA_TYPE.VIDEO_NOTE
    case isItPoll({ originalMessage }):
      return MESSAGE_MEDIA_TYPE.POLL
    case isItSticker({ originalMessage }):
      return MESSAGE_MEDIA_TYPE.STICKER
    case isItMessage({ originalMessage }):
      return MESSAGE_MEDIA_TYPE.MESSAGE
    case isItContact({ originalMessage }):
      return MESSAGE_MEDIA_TYPE.CONTACT

    default:
      return MESSAGE_TYPE.UNKNOWN_MESSAGE_TYPE
  }
}
