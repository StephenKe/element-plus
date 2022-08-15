//@ts-nocheck
import request from '@element-plus/utils/request'

// 内容域信息
export function saveContentRecord(urlPrefix, data) {
  return request({
    url: `${urlPrefix}/office/cx/cxContentRecord/save`,
    method: 'post',
    data,
  })
}

export function getContentRecordInfo(urlPrefix, id) {
  return request({
    url: `${urlPrefix}/office/cx/cxContentRecord/info/${id}`,
    method: 'get',
  })
}
