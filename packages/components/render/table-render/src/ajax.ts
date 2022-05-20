//@ts-nocheck
import { hasOwn, NOOP } from '@vue/shared'
import { ElMessage } from '@element-plus/components'
import type {
  HttpRequestOptions,
  HttpError,
  HttpProgressEvent,
} from './request.type'

function getError(
  action: string,
  option: HttpRequestOptions,
  xhr: XMLHttpRequest
) {
  let msg: string
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`
  } else {
    msg = `fail to ${option.method} ${action} ${xhr.status}`
  }

  const err = new Error(msg) as HttpError
  err.status = xhr.status
  err.method = option.method
  err.url = action
  return err
}

function getBody(xhr: XMLHttpRequest): XMLHttpRequestResponseType {
  const text = xhr.responseText || xhr.response
  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  } catch (e) {
    return text
  }
}

export default function httpRequest(option: HttpRequestOptions) {
  if (typeof XMLHttpRequest === 'undefined') {
    return
  }

  const xhr = new XMLHttpRequest()
  const {
    url,
    method = 'POST',
    params,
    // file,
    headers = {},
    withCredentials = false,
    // filename = Date.now(),
    onProgress = NOOP,
    onError = NOOP,
    onSuccess = NOOP,
    processResult = (res: any) => res,
  } = option

  if (xhr.upload) {
    xhr.upload.onprogress = function progress(e) {
      if (e.total > 0) {
        ;(e as HttpProgressEvent).percent = (e.loaded / e.total) * 100
      }
      onProgress(e)
    }
  }

  // const formData = new FormData()
  const data = Object.create(null)

  if (params) {
    Object.keys(params).forEach((key) => {
      // formData.append(key, params[key])
      data[key] = params[key]
    })
  }

  // if (file) {
  //   formData.append(filename.toString(), file, file?.name)
  // }

  xhr.onerror = function error() {
    const err = getError(url, option, xhr)
    onError(err)
    ElMessage.error(JSON.stringify(err))
  }

  xhr.onload = function onload() {
    if (xhr.status < 200 || xhr.status >= 300) {
      const err = getError(url, option, xhr)
      ElMessage.error(JSON.stringify(err))
      return onError(err)
    }

    onSuccess(processResult(getBody(xhr)))
  }

  xhr.open(method, url, true)
  xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')

  if (withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true
  }

  for (const item in headers) {
    if (hasOwn(headers, item) && headers[item] !== null) {
      xhr.setRequestHeader(item, headers[item])
    }
  }

  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      xhr.setRequestHeader(key, value)
    })
  }

  // xhr.send(formData)
  xhr.send(JSON.stringify(data))
  return xhr
}
