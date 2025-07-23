import { Mailer } from './mailer.service.js'
import { TransportFactory } from './transport.factory.js'

export const initMailer = (config) => {
  const transport = TransportFactory.create(config)
  const mailer = new Mailer(transport)

  return mailer
}
