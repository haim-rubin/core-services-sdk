export function getMessageType({
  originalMessage,
}: {
  originalMessage: any
}): string
export function mapMessageTelegramBase({
  originalMessage,
}: {
  originalMessage: any
}): {
  messageBase: {
    timestamp: string
    forwardInfo: {
      forward_date: any
      forward_from: any
    }
    id: any
    imExtraInfo: {
      tmId: any
    }
    chatId: any
    type: string
    chatter: any
    itIsForward: boolean
  }
  message: any
  type: string
}
export function mapMessageWhatsAppContent({
  message,
  type,
}: {
  message: any
  type: any
}):
  | {
      text: any
      reply?: undefined
    }
  | {
      [x: number]: any
      text?: undefined
      reply?: undefined
    }
  | {
      reply: any
      text?: undefined
    }
export function mapMessageTelegram({
  originalMessage,
}: {
  originalMessage: any
}):
  | {
      text: any
      reply?: undefined
      timestamp: string
      forwardInfo: {
        forward_date: any
        forward_from: any
      }
      id: any
      imExtraInfo: {
        tmId: any
      }
      chatId: any
      type: string
      chatter: any
      itIsForward: boolean
    }
  | {
      text?: undefined
      reply?: undefined
      timestamp: string
      forwardInfo: {
        forward_date: any
        forward_from: any
      }
      id: any
      imExtraInfo: {
        tmId: any
      }
      chatId: any
      type: string
      chatter: any
      itIsForward: boolean
    }
  | {
      attachment: string
      animation: any
      text?: undefined
      reply?: undefined
      timestamp: string
      forwardInfo: {
        forward_date: any
        forward_from: any
      }
      id: any
      imExtraInfo: {
        tmId: any
      }
      chatId: any
      type: string
      chatter: any
      itIsForward: boolean
    }
  | {
      reply: {
        id: any
        title: any
      }
      text?: undefined
      timestamp: string
      forwardInfo: {
        forward_date: any
        forward_from: any
      }
      id: any
      imExtraInfo: {
        tmId: any
      }
      chatId: any
      type: string
      chatter: any
      itIsForward: boolean
    }
export function getWhatsAppMessageType({ message }: { message: any }): any
export function extractReply({ originalMessage }: { originalMessage: any }): {
  id: any
  title: any
}
export function whatsappBaseExtraction({
  originalMessage,
}: {
  originalMessage: any
}): {
  field: any
  value: any
  wbaid: any
}
export function mapMessageWhatsAppBase({
  originalMessage,
}: {
  originalMessage: any
}): {
  messageBase: {
    id: any
    chatId: any
    imExtraInfo: {
      wbaid: any
    }
    type: any
    chatter: {
      id: any
      name: any
      username: any
    }
    itIsForward: boolean
    timestamp: any
  }
  message: any
  contact: any
  context: any
}
export function mapMessageTelegramContent({
  type,
  message,
  originalMessage,
}: {
  type: any
  message: any
  originalMessage: any
}):
  | {
      text: any
      reply?: undefined
    }
  | {
      [x: number]: any
      text?: undefined
      reply?: undefined
    }
  | {
      attachment: string
      animation: any
      text?: undefined
      reply?: undefined
    }
  | {
      reply: {
        id: any
        title: any
      }
      text?: undefined
    }
export function mapMessageWhatsApp({
  originalMessage,
}: {
  originalMessage: any
}):
  | {
      text: any
      reply?: undefined
      id: any
      chatId: any
      imExtraInfo: {
        wbaid: any
      }
      type: any
      chatter: {
        id: any
        name: any
        username: any
      }
      itIsForward: boolean
      timestamp: any
    }
  | {
      text?: undefined
      reply?: undefined
      id: any
      chatId: any
      imExtraInfo: {
        wbaid: any
      }
      type: any
      chatter: {
        id: any
        name: any
        username: any
      }
      itIsForward: boolean
      timestamp: any
    }
  | {
      reply: any
      text?: undefined
      id: any
      chatId: any
      imExtraInfo: {
        wbaid: any
      }
      type: any
      chatter: {
        id: any
        name: any
        username: any
      }
      itIsForward: boolean
      timestamp: any
    }
export const messageUnifiedMapper: {
  [IM_PLATFORM.TELEGRAM]: ({ originalMessage }: { originalMessage: any }) =>
    | {
        text: any
        reply?: undefined
        timestamp: string
        forwardInfo: {
          forward_date: any
          forward_from: any
        }
        id: any
        imExtraInfo: {
          tmId: any
        }
        chatId: any
        type: string
        chatter: any
        itIsForward: boolean
      }
    | {
        text?: undefined
        reply?: undefined
        timestamp: string
        forwardInfo: {
          forward_date: any
          forward_from: any
        }
        id: any
        imExtraInfo: {
          tmId: any
        }
        chatId: any
        type: string
        chatter: any
        itIsForward: boolean
      }
    | {
        attachment: string
        animation: any
        text?: undefined
        reply?: undefined
        timestamp: string
        forwardInfo: {
          forward_date: any
          forward_from: any
        }
        id: any
        imExtraInfo: {
          tmId: any
        }
        chatId: any
        type: string
        chatter: any
        itIsForward: boolean
      }
    | {
        reply: {
          id: any
          title: any
        }
        text?: undefined
        timestamp: string
        forwardInfo: {
          forward_date: any
          forward_from: any
        }
        id: any
        imExtraInfo: {
          tmId: any
        }
        chatId: any
        type: string
        chatter: any
        itIsForward: boolean
      }
  [IM_PLATFORM.WHATSAPP]: ({ originalMessage }: { originalMessage: any }) =>
    | {
        text: any
        reply?: undefined
        id: any
        chatId: any
        imExtraInfo: {
          wbaid: any
        }
        type: any
        chatter: {
          id: any
          name: any
          username: any
        }
        itIsForward: boolean
        timestamp: any
      }
    | {
        text?: undefined
        reply?: undefined
        id: any
        chatId: any
        imExtraInfo: {
          wbaid: any
        }
        type: any
        chatter: {
          id: any
          name: any
          username: any
        }
        itIsForward: boolean
        timestamp: any
      }
    | {
        reply: any
        text?: undefined
        id: any
        chatId: any
        imExtraInfo: {
          wbaid: any
        }
        type: any
        chatter: {
          id: any
          name: any
          username: any
        }
        itIsForward: boolean
        timestamp: any
      }
}
import { IM_PLATFORM } from './im-platform.js'
