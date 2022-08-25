//@ts-nocheck
import request from '@element-plus/utils/request'

/**
 * 一体化范本变量相关接口
 */
// 一体化范本变量 -- 列表分页查询
export function getYthTemplateVariablePage(urlPrefix, data) {
  return request({
    url: `${urlPrefix}/business/yth/ythTemplateVariable/list/page`,
    method: 'post',
    data,
  })
}
// 一体化范本变量 -- 批量删除
export function ythTemplateVariableDeleteBatch(urlPrefix, data) {
  return request({
    url: `${urlPrefix}/business/yth/ythTemplateVariable/delete`,
    method: 'post',
    data,
  })
}
// 一体化范本变量 -- 保存
export function ythTemplateVariableSave(urlPrefix, data) {
  return request({
    url: `${urlPrefix}/business/yth/ythTemplateVariable/save`,
    method: 'post',
    data,
  })
}

// 所有字段分类 -- 详情
export function fieldClassAllList(urlPrefix) {
  return request({
    url: `${urlPrefix}/business/contract/variable/fieldClassAll`,
    method: 'get',
  })
}
