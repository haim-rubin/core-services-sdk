import fetch from 'node-fetch'
import httpStatus from 'http-status'
import { parseStringPromise } from 'xml2js'

import { HttpError } from './HttpError.js'
import { HTTP_METHODS } from './http-method.js'
import { ResponseType } from './responseType.js'

const JSON_HEADER = {
  'Content-Type': 'application/json',
}

const isOkStatus = ({ status }) =>
  // Range of response OK
  status >= httpStatus.OK && status < httpStatus.MULTIPLE_CHOICES

const checkStatus = async (res) => {
  if (!isOkStatus(res)) {
    const text = await res.text()
    const info = tryConvertJsonResponse(text)
    const { status, statusText } = res

    throw new HttpError({
      code: status,
      httpStatusCode: status,
      httpStatusText: statusText,
      details: info,
    })
  }
  return res
}

const getTextResponse = async (response) => {
  const text = await response.text()
  return text
}

const tryConvertJsonResponse = (responseText) => {
  try {
    const obj = JSON.parse(responseText)
    return obj
  } catch (error) {
    error.responseText = responseText
    throw error
  }
}

const tryGetJsonResponse = async (response) => {
  let jsonText
  try {
    jsonText = getTextResponse(response)
    const obj = tryConvertJsonResponse(jsonText)
    return obj
  } catch (error) {
    if (!jsonText) {
      throw error
    }
    return jsonText
  }
}

const tryGetXmlResponse = async (response) => {
  let xmlText
  try {
    xmlText = await getTextResponse(response)
    const xml = await parseStringPromise(xmlText)
    return xml
  } catch (error) {
    if (!xmlText) {
      throw error
    }
    return xmlText
  }
}

const getResponsePayload = async (response, responseType) => {
  switch (responseType) {
    case ResponseType.json:
      return tryGetJsonResponse(response)

    case ResponseType.xml:
      return tryGetXmlResponse(response)

    default:
    case ResponseType.text:
      return getTextResponse(response)
  }
}

export const get = async ({
  url,
  headers = {},
  credentials = 'include',
  expectedType = ResponseType.json,
}) => {
  const response = await fetch(url, {
    method: HTTP_METHODS.GET,
    headers: {
      ...JSON_HEADER,
      ...headers,
    },
    ...(credentials ? { credentials } : {}),
  })

  await checkStatus(response)
  const data = await getResponsePayload(response, expectedType)
  return data
}

export const post = async ({
  url,
  body,
  headers,
  credentials = 'include',
  expectedType = ResponseType.json,
}) => {
  const response = await fetch(url, {
    method: HTTP_METHODS.POST,
    headers: {
      ...JSON_HEADER,
      ...headers,
    },
    body: JSON.stringify(body),
    ...(credentials ? { credentials } : {}),
  })
  await checkStatus(response)
  const data = await getResponsePayload(response, expectedType)
  return data
}

export const put = async ({
  url,
  body,
  headers = {},
  credentials = 'include',
  expectedType = ResponseType.json,
}) => {
  const response = await fetch(url, {
    method: HTTP_METHODS.PUT,
    headers: {
      ...JSON_HEADER,
      ...headers,
    },
    body: JSON.stringify(body),
    ...(credentials ? { credentials } : {}),
  })

  await checkStatus(response)
  const data = await getResponsePayload(response, expectedType)
  return data
}

export const patch = async ({
  url,
  body,
  headers,
  credentials = 'include',
  expectedType = ResponseType.json,
}) => {
  const response = await fetch(url, {
    method: HTTP_METHODS.PATCH,
    headers: {
      ...JSON_HEADER,
      ...headers,
    },
    body: JSON.stringify(body),
    ...(credentials ? { credentials } : {}),
  })

  await checkStatus(response)
  const data = await getResponsePayload(response, expectedType)
  return data
}

export const deleteApi = async ({
  url,
  body,
  headers,
  credentials = 'include',
  expectedType = ResponseType.json,
}) => {
  const response = await fetch(url, {
    method: HTTP_METHODS.DELETE,
    headers: {
      ...JSON_HEADER,
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...(credentials ? { credentials } : {}),
  })

  await checkStatus(response)
  const data = await getResponsePayload(response, expectedType)
  return data
}

export const http = {
  get,
  put,
  post,
  patch,
  deleteApi,
}
