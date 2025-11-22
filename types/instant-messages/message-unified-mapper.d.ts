export function getMessageType({ imMessage }: { imMessage: any }): string
export function mapMessageTelegramBase({ imMessage }: { imMessage: any }): {
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
export function mapMessageTelegram({ imMessage }: { imMessage: any }):
  | {
      type: string
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
      chatter: any
      itIsForward: boolean
    }
  | {
      type: string
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
      chatter: any
      itIsForward: boolean
    }
  | {
      type: string
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
      chatter: any
      itIsForward: boolean
    }
  | {
      type: string
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
      chatter: any
      itIsForward: boolean
    }
export function getWhatsAppMessageType({ message }: { message: any }): any
export function extractReply({ imMessage }: { imMessage: any }): {
  id: any
  title: any
}
export function whatsappBaseExtraction({ imMessage }: { imMessage: any }): {
  field: any
  value: any
  wbaid: any
}
export function mapMessageWhatsAppBase({ imMessage }: { imMessage: any }): {
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
  imMessage,
}: {
  type: any
  message: any
  imMessage: any
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
export function mapMessageWhatsApp({ imMessage }: { imMessage: any }):
  | {
      type: any
      text: any
      reply?: undefined
      id: any
      chatId: any
      imExtraInfo: {
        wbaid: any
      }
      chatter: {
        id: any
        name: any
        username: any
      }
      itIsForward: boolean
      timestamp: any
    }
  | {
      type: any
      text?: undefined
      reply?: undefined
      id: any
      chatId: any
      imExtraInfo: {
        wbaid: any
      }
      chatter: {
        id: any
        name: any
        username: any
      }
      itIsForward: boolean
      timestamp: any
    }
  | {
      type: any
      reply: any
      text?: undefined
      id: any
      chatId: any
      imExtraInfo: {
        wbaid: any
      }
      chatter: {
        id: any
        name: any
        username: any
      }
      itIsForward: boolean
      timestamp: any
    }
export const messageUnifiedMapper: {
  [IM_PLATFORM.TELEGRAM]: ({ imMessage }: { imMessage: any }) =>
    | {
        type: string
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
        chatter: any
        itIsForward: boolean
      }
    | {
        type: string
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
        chatter: any
        itIsForward: boolean
      }
    | {
        type: string
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
        chatter: any
        itIsForward: boolean
      }
    | {
        type: string
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
        chatter: any
        itIsForward: boolean
      }
  [IM_PLATFORM.WHATSAPP]: ({ imMessage }: { imMessage: any }) =>
    | {
        type: any
        text: any
        reply?: undefined
        id: any
        chatId: any
        imExtraInfo: {
          wbaid: any
        }
        chatter: {
          id: any
          name: any
          username: any
        }
        itIsForward: boolean
        timestamp: any
      }
    | {
        type: any
        text?: undefined
        reply?: undefined
        id: any
        chatId: any
        imExtraInfo: {
          wbaid: any
        }
        chatter: {
          id: any
          name: any
          username: any
        }
        itIsForward: boolean
        timestamp: any
      }
    | {
        type: any
        reply: any
        text?: undefined
        id: any
        chatId: any
        imExtraInfo: {
          wbaid: any
        }
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
