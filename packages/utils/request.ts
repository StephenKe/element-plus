import axios from 'axios'
import { ElMessage } from '@element-plus/components'
import type { AxiosRequestConfig } from 'axios'

// 声明公共参数
// 公共入参接口
export interface IRequestConfig extends AxiosRequestConfig {
  pathParams?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
}

// create an axios instance
const service = axios.create({
  baseURL: '/api', // url = base url + request url
  timeout: 10000, // request timeout,
  headers: { 'Cache-Control': 'no-cache' },
})
//
// 取消请求，删除记录
const pending: Array<any> = [] // 声明一个数组用于存储每个请求的取消函数和axios标识
const CancelToken = axios.CancelToken
const removePending = (config: any) => {
  for (const i in pending) {
    if (pending[i].url === config.url) {
      // 在当前请求在数组中存在时执行取消函数
      pending[i].f() // 执行取消操作
    }
  }
}

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    removePending(config)
    config.cancelToken = new CancelToken((c) => {
      pending.push({
        url: config.url,
        f: c,
      })
    })
    if (!config.headers) {
      config.headers = {
        'Content-Type': 'application/json',
      }
    }
    if (typeof window !== 'undefined') {
      config.headers['x-csrf-token'] =
        window?.localStorage.getItem('xCsrfToken') || ''
    }
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    // 标识是否外部系统（是则传'Y'）
    config.headers['zissupplier'] = 'Y'

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    /** 200状态处理 */
    // 请求成功直接返回响应体
    if (response.config.method === 'get') {
      const csrfData = response.headers['x-csrf-token']
      typeof window !== 'undefined' &&
        localStorage.setItem('xCsrfToken', csrfData)
    }
    return response
  },

  (error) => {
    /** 400 - 500 状态处理 */
    // 其他异常报错提示
    ElMessage({
      type: 'error',
      message: error.response.data.msg || error,
    })
    return Promise.reject(error)
  }
)
const getMethodType = function (option: IRequestConfig) {
  if (
    option.method &&
    ['get', 'post', 'put', 'delete'].includes(option.method.toLowerCase())
  ) {
    return option.method.toLowerCase()
  } else {
    throw new Error('method name is not be defined')
  }
}

const getPathParams = function (url: string | undefined) {
  if (!url) return []
  const regex = /{([^}]+)}/g
  const pathParams: any[] = []
  let currentMatch
  /* eslint-disable no-cond-assign */
  while ((currentMatch = regex.exec(url))) {
    pathParams.push(currentMatch[1])
  }
  return pathParams
}

const request = async (option: IRequestConfig) => {
  const method = getMethodType(option)
  const pathParams = getPathParams(option.url)
  let newUrl
  if (option.pathParams) {
    newUrl = pathParams.reduce((url, pathParam) => {
      const paramVal = option.pathParams ? option.pathParams[pathParam] : ''
      if (paramVal) {
        return url ? url.replace(`{${pathParam}}`, paramVal) : url
      } else {
        throw new Error(`${url} has invalid path params.`)
      }
    }, option.url)
  }

  Reflect.deleteProperty(option, 'pathParams')

  Object.assign(option, {
    url: newUrl || option.url,
    method,
  })

  const res = await service(option)
  if (res?.headers?.count && res?.data?.d) {
    res.data.d.count = Number(res.headers.count) || 0
  }
  // 获取导出文件的名称
  if (res?.headers['content-disposition']) {
    res.data.fileName = res?.headers['content-disposition']
  }
  return res.data
}
export default request
