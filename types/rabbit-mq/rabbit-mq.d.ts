export function connectQueueService({
  host,
  log,
}: {
  host: string
  log: import('pino').Logger
}): Promise<amqp.Connection>
export function createChannel({
  host,
  log,
}: {
  host: string
  log: import('pino').Logger
}): Promise<{
  channel: amqp.Channel
  connection: amqp.Connection
}>
export function subscribeToQueue({
  log,
  queue,
  channel,
  prefetch,
  onReceive,
  nackOnError,
}: {
  channel: any
  queue: string
  onReceive: (data: any, correlationId?: string) => Promise<void>
  log: import('pino').Logger
  nackOnError?: boolean
  prefetch?: number
}): Promise<() => Promise<void>>
export function initializeQueue({
  host,
  log,
}: {
  host: string
  log: import('pino').Logger
}): Promise<{
  publish: (
    queue: string,
    data: any,
    correlationId?: string,
  ) => Promise<boolean>
  subscribe: (options: {
    queue: string
    onReceive: (data: any, correlationId?: string) => Promise<void>
    nackOnError?: boolean
  }) => Promise<string>
  channel: amqp.Channel
  connection: amqp.Connection
  close: () => Promise<void>
}>
export function rabbitUriFromEnv(env: {
  RABBIT_HOST: string
  RABBIT_PORT: string | number
  RABBIT_USERNAME: string
  RABBIT_PASSWORD: string
  RABBIT_PROTOCOL?: string
}): string
export type Log = {
  info: (obj: any, msg?: string) => void
  error: (obj: any, msg?: string) => void
  debug: (obj: any, msg?: string) => void
}
