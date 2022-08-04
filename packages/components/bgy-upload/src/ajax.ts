//@ts-nocheck
import { hasOwn } from '@vue/shared'
import { downloadBlob } from '@element-plus/utils'
import { DOWNLOAD_URL, REMOVE_URL } from './constants'
import type {
  ElUploadProgressEvent,
  ElUploadRequestOptions,
  ElUploadAjaxError,
  UploadFile,
  PreviewInfo,
} from './upload.type'

function isIos() {
  const u = window.navigator.userAgent
  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
}

function getError(
  action: string,
  option: ElUploadRequestOptions,
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

  const err = new Error(msg) as ElUploadAjaxError
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

export default function upload(option: ElUploadRequestOptions) {
  if (typeof XMLHttpRequest === 'undefined') {
    return
  }

  const xhr = new XMLHttpRequest()
  const action = option.action

  if (xhr.upload) {
    xhr.upload.onprogress = function progress(e) {
      if (e.total > 0) {
        ;(e as ElUploadProgressEvent).percent = (e.loaded / e.total) * 100
      }
      option.onProgress(e)
    }
  }

  const formData = new FormData()

  if (option.data) {
    Object.keys(option.data).forEach((key) => {
      formData.append(key, option.data[key])
    })
  }

  formData.append(option.filename, option.file, option.file.name)

  xhr.onerror = function error() {
    option.onError(getError(action, option, xhr))
  }

  xhr.onload = function onload() {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(getError(action, option, xhr))
    }

    option.onSuccess(getBody(xhr))
  }

  xhr.open(option.method, action, true)

  if (option.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true
  }

  const headers = option.headers || {}

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

  xhr.send(formData)
  return xhr
}

// 一体化移除文件
export function ythRemove(action: string, headers: Headers) {
  if (typeof XMLHttpRequest === 'undefined') {
    return
  }
  const option = {
    method: 'DELETE',
  }
  const xhr = new XMLHttpRequest()
  xhr.onerror = function error() {
    console.error(getError(action, option, xhr))
  }

  xhr.onload = function onload() {
    if (xhr.status < 200 || xhr.status >= 300) {
      console.error(getError(action, option, xhr))
      return false
    }
  }
  xhr.open(option.method, action, true)
  for (const item in headers) {
    if (hasOwn(headers, item) && headers[item] !== null) {
      xhr.setRequestHeader(item, headers[item])
    }
  }
  xhr.send()
  return xhr
}

// 一体化预览
export function ythPreview(
  action: string,
  params: PreviewInfo,
  headers: Headers
) {
  if (typeof XMLHttpRequest === 'undefined') {
    return
  }
  const option = {
    method: 'POST',
  }
  const xhr = new XMLHttpRequest()
  xhr.onerror = function error() {
    console.error(getError(action, option, xhr))
  }

  xhr.onload = function onload() {
    if (xhr.status < 200 || xhr.status >= 300) {
      console.error(getError(action, option, xhr))
      return false
    }
    const responseJson =
      typeof xhr.response === 'string' ? JSON.parse(xhr.response) : xhr.response
    if (responseJson.data && window) {
      if (isIos()) {
        window.location.href = responseJson.data
      } else {
        window.open(responseJson.data, '_blank')
      }
    }
  }
  xhr.open(option.method, action, true)
  for (const item in headers) {
    if (hasOwn(headers, item) && headers[item] !== null) {
      xhr.setRequestHeader(item, headers[item])
    }
  }
  xhr.send(JSON.stringify(params))
  return xhr
}

// 一体化下载文件
export function ythDownload(
  downloadUrl: string,
  file: UploadFile,
  headers: Headers
) {
  if (typeof XMLHttpRequest === 'undefined') {
    return
  }
  // const fileId = file.response?.data?.id
  // console.log('------ ythDownload ----')
  // console.log(file)
  const fileId = file.response?.data?.editionId
  const action = downloadUrl?.replace('/FILE_ID', `/${fileId}`)
  if (!file.name && window) {
    window.open(action, '_blank')
    return
  }
  const option = {
    method: 'GET',
  }
  const xhr = new XMLHttpRequest()
  xhr.onerror = function error() {
    console.error(getError(action, option, xhr))
  }

  xhr.onload = function onload() {
    if (xhr.status < 200 || xhr.status >= 300) {
      console.error(getError(action, option, xhr))
      return false
    }

    downloadBlob(new Blob([xhr.response]), file.name)
  }
  xhr.open(option.method, action, true)
  xhr.responseType = 'blob'
  for (const item in headers) {
    if (hasOwn(headers, item) && headers[item] !== null) {
      xhr.setRequestHeader(item, headers[item])
    }
  }
  xhr.send()
  return xhr
}
