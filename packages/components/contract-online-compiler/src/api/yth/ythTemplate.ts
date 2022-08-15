//@ts-nocheck
import request from '@element-plus/utils/request'

/**
 * 一体化范本相关接口
 */
// 一体化范本 -- 保存
export function ythTemplateSave(urlPrefix, data) {
  return request({
    url: `${urlPrefix}/business/yth/ythTemplate/save`,
    method: 'post',
    data,
  })
}
