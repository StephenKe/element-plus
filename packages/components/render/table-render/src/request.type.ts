import type { AxiosInstance, AxiosRequestConfig } from 'axios'

/**
 * 查询分页接口的字段映射
 */
export interface SelectApiProps {
  /**
   * 入参：传入给接口的当前页字段名
   */
  page: string
  /**
   * 入参：传入给接口的每页显示n条记录字段名
   */
  size: string
  /**
   * 出参：接口返回的总记录数字段
   */
  total: string
  /**
   * 出参：接口返回的分页数据集字段
   */
  records: string
}

export interface ApiConfig extends AxiosRequestConfig {
  props?: SelectApiProps
  /**
   * 错误处理函数
   */
  onError?: (e: any) => void
  /**
   * 文件上传时上传进度
   */
  onProgress?: (e: ProgressEvent) => void
  /**
   * 请求完成回调
   */
  onSuccess?: (response: any) => unknown
  /**
   * 处理接口返回结果
   */
  preprocessor?: (response: any) => any
}

export interface TableApiConfig {
  /**
   * axios 实例对象
   */
  axios?: AxiosInstance
  /**
   * CRUD 中的 C 操作，表示配置新增接口
   */
  insert?: ApiConfig
  /**
   * CRUD 中的 R 操作，表示配置检索接口
   */
  select?: ApiConfig
  /**
   * CRUD 中的 U 操作，表示配置更新接口
   */
  update?: ApiConfig
  /**
   * CRUD 中的 D 操作，表示配置删除接口
   */
  delete?: ApiConfig
}
