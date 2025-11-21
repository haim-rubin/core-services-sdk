export const MESSAGE_MEDIA_TYPE = {
  TEXT: 'text',
  POLL: 'poll',
  VIDEO: 'video',
  PHOTO: 'photo',
  IMAGE: 'image',
  VOICE: 'voice',
  AUDIO: 'audio',
  STICKER: 'sticker',
  CONTACT: 'contact',
  REACTION: 'reaction',
  DOCUMENT: 'document',
  LOCATION: 'location',
  CONTACTS: 'contacts',
  VIDEO_NOTE: 'video_note',
  BUTTON_CLICK: 'button_click',
  BUTTON_CLICK_MULTIPLE: 'button_click_multiple',
}

export const MESSAGE_TYPE = {
  MESSAGE: 'message',
  BUTTON_CLICK: MESSAGE_MEDIA_TYPE.BUTTON_CLICK,
  BUTTON_CLICK_MULTIPLE: MESSAGE_MEDIA_TYPE.BUTTON_CLICK_MULTIPLE,
  UNKNOWN_MESSAGE_TYPE: 'unknown_message_type',
}

export const MESSAGE_MEDIA_TYPE_MAPPER = {
  [MESSAGE_MEDIA_TYPE.VOICE]: MESSAGE_MEDIA_TYPE.AUDIO,
  [MESSAGE_MEDIA_TYPE.PHOTO]: MESSAGE_MEDIA_TYPE.IMAGE,
  [MESSAGE_MEDIA_TYPE.CONTACTS]: MESSAGE_MEDIA_TYPE.CONTACT,
}
