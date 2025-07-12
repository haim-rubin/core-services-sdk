import httpStatus from 'http-status'

export const GENERAL_ERROR = {
  httpStatusCode: httpStatus.INTERNAL_SERVER_ERROR,
  httpStatusText: httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
  code: `GENERAL.${httpStatus[httpStatus.INTERNAL_SERVER_ERROR]}`,
}
