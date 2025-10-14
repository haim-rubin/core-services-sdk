export function withErrorHandling(
  log: object,
  defaultError: HttpError,
): (funcToInvoke: () => Promise<any>) => Promise<any>
export function withErrorHandlingReply({
  reply,
  log,
  defaultError,
}: {
  reply: Reply
  log: Logger
  defaultError?: HttpError
}): (funcToInvoke: any) => Promise<any>
export function replyOnErrorOnly({
  reply,
  log,
  defaultError,
}: {
  reply: Reply
  log: Logger
  defaultError?: HttpError
}): (funcToInvoke: any) => Promise<any>
export type Reply = import('fastify').FastifyReply
export type Request = import('fastify').FastifyRequest
export type Logger = import('pino').Logger
import { HttpError } from '../../http/HttpError.js'
