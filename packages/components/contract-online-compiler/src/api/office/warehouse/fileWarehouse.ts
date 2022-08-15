//@ts-nocheck
import request from '@element-plus/utils/request'

// 文件仓库信息查询
export function fileWarehouseInfo(urlPrefix, id) {
  return request({
    url: `${urlPrefix}/office/warehouse/fileWarehouse/info/${id}`,
    method: 'get',
  })
}
