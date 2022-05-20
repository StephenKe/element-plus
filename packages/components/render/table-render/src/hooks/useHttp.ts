//@ts-nocheck
import { isFunction } from '@vue/shared'
import httpRequest from '../ajax'
import type { AxiosPromise } from 'axios'
import type {
  HttpRequestOptions,
  CrudHttpRequestOptions,
} from '../request.type'

export function useHttp(requests: HttpRequestOptions | CrudHttpRequestOptions) {
  /**
   * 支持一个接口配置
   *
   * 例如分页查询接口，则默认为 post 请求，同时在 url 后面添加 /page 后缀
   *
   * 新增接口，则默认为 post 请求
   *
   * 编辑接口，则默认为 put 请求
   *
   * 删除接口，则默认为 delete 请求，传值为 rowKey 属性，考虑到批量删除功能，所有没有使用 /:id 方式
   */
  const { url, params, processResult, headers } = requests as HttpRequestOptions
  const {
    axios,
    insert = { url, method: 'post', params, processResult, headers },
    select = {
      url: `${url}/page`,
      method: 'post',
      params,
      processResult,
      headers,
    },
    update = { url, method: 'put', params, processResult, headers },
    delete: remove = { url, method: 'delete', params, processResult, headers },
  } = requests as CrudHttpRequestOptions

  const createHttp =
    (opt: HttpRequestOptions) =>
    (params: Record<string, string | Blob> | undefined): AxiosPromise => {
      if (axios) {
        return axios({
          url: opt.url,
          method: opt.method,
          headers: opt.headers,
          timeout: opt.timeout,
          [opt.method?.toLocaleLowerCase() === 'get' ? 'params' : 'data']: {
            // 外部传递的 params 优先级低
            ...opt.params,
            ...params,
          },
        }).then(({ data }) => {
          if (isFunction(opt.processResult)) {
            return opt.processResult(data)
          }
          return data
        })
      } else {
        return new Promise((resolve, reject) =>
          httpRequest({
            url: opt.url,
            method: opt.method,
            headers: opt.headers,
            params: {
              // 外部传递的 params 优先级低
              ...opt.params,
              ...params,
            },
            processResult: opt.processResult,
            onSuccess: resolve,
            onError: reject,
          })
        )
      }
    }

  return {
    insertApi: createHttp(insert),
    selectApi: createHttp(select),
    updateApi: createHttp(update),
    deleteApi: createHttp(remove),
  }
}
