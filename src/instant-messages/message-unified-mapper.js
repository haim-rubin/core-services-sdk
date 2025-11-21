import { APPLICATION } from './applications.js'
import { getMessageType } from './message-type.js'
import {
  MESSAGE_TYPE,
  MESSAGE_MEDIA_TYPE,
  MESSAGE_MEDIA_TYPE_MAPPER,
} from './message-types.js'

const INTERACTIVE_MAPPER = {
  button_reply: MESSAGE_TYPE.BUTTON_CLICK,
  list_reply: MESSAGE_TYPE.BUTTON_CLICK_MULTIPLE,
}

export const mapMessageTelegramBase = ({ originalMessage }) => {
  const { callback_query, message, update_id } = originalMessage
  const messageData = callback_query?.message || message
  const { chat, date, from, message_id } = messageData
  const type = getMessageType({ originalMessage })
  const typeMapped = MESSAGE_MEDIA_TYPE_MAPPER[type] || type
  const { forward_date, forward_from } = messageData
  const itIsForward = !!(forward_date && forward_from)

  const messageBase = {
    id: update_id,
    imExtraInfo: {
      tmId: message_id,
    },
    chatId: chat.id,
    type: typeMapped,
    chatter: {
      ...from,
      id: chat.id,
      name: `${chat.first_name} ${chat.last_name}`,
      username: chat.username,
    },
    itIsForward,
    ...(itIsForward ? { forwardInfo: { forward_date, forward_from } } : null),
    timestamp: `${date}`,
  }
  return { messageBase, message: messageData, type }
}

export const mapMessageWhatsAppContent = ({ message, type }) => {
  switch (type) {
    case MESSAGE_MEDIA_TYPE.TEXT:
      return {
        text: message.text?.body,
      }
    case MESSAGE_MEDIA_TYPE.IMAGE:
    case MESSAGE_MEDIA_TYPE.VIDEO:
    case MESSAGE_MEDIA_TYPE.AUDIO:
    case MESSAGE_MEDIA_TYPE.STICKER:
    case MESSAGE_MEDIA_TYPE.LOCATION:
    case MESSAGE_MEDIA_TYPE.REACTION:
      return {
        [type]: message[type],
      }
    case MESSAGE_MEDIA_TYPE.DOCUMENT:
      return {
        [type]: message[type],
      }
    case MESSAGE_MEDIA_TYPE.CONTACTS:
      return {
        [MESSAGE_MEDIA_TYPE.CONTACT]: message[type],
      }
    case MESSAGE_MEDIA_TYPE.BUTTON_CLICK:
      const { interactive } = message
      const { button_reply } = interactive
      return {
        reply: button_reply,
      }
    case MESSAGE_MEDIA_TYPE.BUTTON_CLICK_MULTIPLE:
      const { interactive: interactiveMultiple } = message
      const { list_reply } = interactiveMultiple
      return {
        reply: list_reply,
      }
    default:
      return {}
  }
}

export const mapMessageTelegram = ({ originalMessage }) => {
  const { messageBase, type, message } = mapMessageTelegramBase({
    originalMessage,
  })
  const messageContent = mapMessageTelegramContent({
    type,
    message,
    originalMessage,
  })
  const messageMapped = { ...messageBase, ...messageContent }
  return messageMapped
}

export const getWhatsAppMessageType = ({ message }) => {
  const { type } = message
  switch (type) {
    case 'interactive': {
      const { interactive } = message
      return INTERACTIVE_MAPPER[interactive.type] || interactive.type
    }
    default:
      return type
  }
}

export const extractReply = ({ originalMessage }) => {
  const { callback_query } = originalMessage
  const { data: id, message } = callback_query
  const {
    reply_markup: { inline_keyboard },
  } = message
  const buttonsFlat = inline_keyboard.reduce((buttons, button) => {
    return buttons.concat(button.flat())
  }, [])
  const { text: title } = buttonsFlat.find(
    (button) => button.callback_data === id,
  )

  return { id, title }
}
export const whatsappBaseExtraction = ({ originalMessage }) => {
  const {
    entry: [{ changes, id }],
  } = originalMessage
  const [change] = changes
  const { field, value } = change
  return { field, value, wbaid: id }
}

export const mapMessageWhatsAppBase = ({ originalMessage }) => {
  const { field, value, wbaid } = whatsappBaseExtraction({ originalMessage })
  const { [field]: messages, contacts } = value
  const [message] = messages
  const [contact] = contacts
  const { id, from, timestamp, context } = message
  const type = getWhatsAppMessageType({ message })
  const messageBase = {
    id: id,
    chatId: from,
    imExtraInfo: {
      wbaid,
    },
    type,
    chatter: {
      id: from,
      name: contacts[0].profile.name,
      username: contact.wa_id,
    },
    itIsForward: !!context?.forwarded,
    timestamp: timestamp,
  }

  return { messageBase, message, contact, context }
}

export const mapMessageTelegramContent = ({
  type,
  message,
  originalMessage,
}) => {
  switch (type) {
    case MESSAGE_MEDIA_TYPE.TEXT:
      return {
        text: message.text,
      }
    case MESSAGE_MEDIA_TYPE.PHOTO:
    case MESSAGE_MEDIA_TYPE.VOICE:
      return {
        [MESSAGE_MEDIA_TYPE_MAPPER[type] || type]: message[type],
      }
    case MESSAGE_MEDIA_TYPE.POLL:
    case MESSAGE_MEDIA_TYPE.VIDEO:
    case MESSAGE_MEDIA_TYPE.STICKER:
    case MESSAGE_MEDIA_TYPE.CONTACT:
    case MESSAGE_MEDIA_TYPE.LOCATION:
    case MESSAGE_MEDIA_TYPE.VIDEO_NOTE:
      return {
        [type]: message[type],
      }
    case MESSAGE_MEDIA_TYPE.DOCUMENT:
      const { animation } = message
      return {
        [type]: message[type],
        ...(animation ? { animation } : null),
        ...(animation ? { attachment: 'animation' } : null),
      }
    case MESSAGE_MEDIA_TYPE.BUTTON_CLICK:
      const reply = extractReply({ originalMessage })
      return {
        reply,
      }
    default:
      return {}
  }
}

export const mapMessageWhatsApp = ({ originalMessage }) => {
  const { messageBase, message, context } = mapMessageWhatsAppBase({
    originalMessage,
  })
  const { type } = messageBase
  const messageContent = mapMessageWhatsAppContent({
    type,
    message,
    context,
  })

  return { ...messageBase, ...messageContent }
}

export const messageUnifiedMapper = {
  [APPLICATION.TELEGRAM]: mapMessageTelegram,
  [APPLICATION.WHATSAPP]: mapMessageWhatsApp,
}
