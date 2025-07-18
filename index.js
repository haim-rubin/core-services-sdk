import { HttpError } from './src/index.js'

throw new HttpError({ code: '2', httpStatusCode: 22 })
