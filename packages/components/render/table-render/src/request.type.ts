import type { AxiosInstance, AxiosRequestConfig } from 'axios'

export interface HttpProgressEvent extends ProgressEvent {
  percent: number
}

export interface HttpError extends Error {
  status: number
  method: string
  url: string
}

export interface HttpRequestOptions extends AxiosRequestConfig {
  /**
   * 错误处理函数
   */
  onError?: (e: Error) => void
  /**
   * 文件上传时上传进度
   */
  onProgress?: (e: ProgressEvent) => void
  /**
   * 请求完成回调
   */
  onSuccess?: (response: XMLHttpRequestResponseType) => unknown
  /**
   * 处理接口返回结果
   */
  processResult?: (response: XMLHttpRequestResponseType) => any
}

export interface CrudHttpRequestOptions {
  /**
   * axios 实例对象
   */
  axios?: AxiosInstance
  /**
   * CRUD 中的 C 操作，表示配置新增接口
   */
  insert?: HttpRequestOptions
  /**
   * CRUD 中的 R 操作，表示配置检索接口
   */
  select?: HttpRequestOptions
  /**
   * CRUD 中的 U 操作，表示配置更新接口
   */
  update?: HttpRequestOptions
  /**
   * CRUD 中的 D 操作，表示配置删除接口
   */
  delete?: HttpRequestOptions
}
