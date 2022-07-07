//@ts-nocheck
import request from '@element-plus/utils/request'

// 通用的搜索帮助接口
export function commonSearchHelp(params) {
  let filter = `F4field eq '${params.F4field}' and `
  const conditions: string[] = []
  for (const item of params.conditions) {
    const key = Reflect.ownKeys(item)[0]
    const value = item[key]
    conditions.push(`substringof('${String(key)}:${value}',Condition)`)
  }
  filter = `${filter}(${conditions.join(' or ')})`

  return request({
    url: `/sap/opu/odata/SAP/ZFPC_CONT_CONFIG_SRV/SearchHelpSet`,
    method: 'get',
    params: {
      $filter: filter,
      $format: 'json',
    },
  })
}

// 基于币种获取汇率
export function getExchangeRateByCurrency(ZcurrencyNo) {
  return request({
    url: `/sap/opu/odata/SAP/ZFPC_CONT_RACT_SRV/FuncImport_Exchrate?ZcurrencyNo='${ZcurrencyNo}'`,
    method: 'get',
  })
}

// 获取组织层级树（数据太多，用懒加载每次只解析一层NextLevelSet）
export function getDepTreeList(Zorgid) {
  return request({
    url: `/sap/opu/odata/SAP/ZFMD_DOMAINLIST_SRV/HrOrgTreeSet('${Zorgid}')`,
    method: 'get',
    params: {
      $expand: 'NextLevelSet',
      $format: 'json',
    },
  })
}

// 请求所有阈值
export async function getDomainList() {
  const res = await request({
    url: `/sap/opu/odata/sap/ZFPC_CONT_RACT_SRV/DomainListSet?$format=json`,
    method: 'get',
  })
  return res.d?.results || []
}

// 所有的合同分类（包含一二三级分类）
export async function getClassList() {
  const res = await request({
    url: `/sap/opu/odata/SAP/ZFPC_CONT_CONFIG_SRV/ContractHeadSet`,
    method: 'get',
    params: {
      $expand: 'ContractAttchSet,ContractBchtSet,ContractPaySet,ContractMsgSet',
      $format: 'json',
    },
  })
  return res.d?.results || []
}

// 获取合同编辑表单动态渲染配置
export function getContractFormConfigs(params) {
  return request({
    url: `/sap/opu/odata/sap/ZFPC_CONT_RACT_SRV/ContConfigSet`,
    method: 'get',
    params: {
      $filter: `ZdocumentType eq '${params.ZdocumentType}' and ZconCategoryNo eq '${params.ZconCategoryNo}' and ZconClassNo1 eq '${params.ZconClassNo1}' and ZconClassNo2 eq '${params.ZconClassNo2}' and ZconClassNo3 eq '${params.ZconClassNo3}' and Zmode eq '${params.Zmode}'`,
      $format: 'json',
    },
  })
}

// 补充合同编辑表单根据原因控制字段是否可修改（有返回的都是可修改，否则不可修改）
export function getContractReasonEditable(params) {
  return request({
    url: `/sap/opu/odata/SAP/ZFPC_CONT_RACT_SRV/ContReasonSet`,
    method: 'get',
    params: {
      $filter: `ZconCategoryNo eq '${params.ZconCategoryNo}' and ZsReasonNo eq '${params.ZsReasonNo}'`,
    },
  })
}

// 获取合同详情
export function getContractDetails(params) {
  return request({
    url: `/sap/opu/odata/sap/ZFPC_CONT_RACT_SRV/ContHeadSet`,
    method: 'get',
    params: {
      $filter: `ZdocumentNo eq '${params.ZdocumentNo}'`,
      $expand:
        'ContRangeSet,ContSignSet,ContPaySet,ContPartySet,ContMsgSet,ContItemSet,ContItemSet/ContItemBudgetSet,ContVerdictSet,ContTaxSet,ContAttASet,ContAttBSet,ContAttCSet,ContAttDSet,ContAttESet,ContBankSet',
      $format: 'json',
    },
  })
}

// 编辑合同
export function editContract(params) {
  return request({
    url: `/sap/opu/odata/sap/ZFPC_CONT_RACT_SRV/ContHeadSet`,
    method: 'post',
    data: {
      ...params,
    },
  })
}

// 获取合同表单页签配置
export async function getContractTabs(params) {
  let filter = ''
  for (const key in params) {
    filter += `${key} eq '${params[key]}' and `
  }
  return request({
    url: `/sap/opu/odata/SAP/ZFPC_CONT_RACT_SRV/ContTabSet`,
    method: 'get',
    params: {
      $filter: filter ? filter.slice(0, filter.length - 5) : '',
      $format: 'json',
    },
  })
}

// 获取区域项目
export function getRegionList(level, id, expand = 'children') {
  const params = {
    $expand: expand,
    $format: 'json',
  }
  if (!expand) {
    Reflect.deleteProperty(params, '$expand')
  }
  return request({
    url: `sap/opu/odata/SAP/ZFMD_DOMAINLIST_SRV/OrgTreeSet(level='${level}',id='${id}')`,
    method: 'get',
    params,
  })
}

// 删除附件
export async function removeAttachFile(params) {
  return request({
    url: `/file/middleground/${params}`,
    method: 'delete',
  })
}

// 补充合同 校验补充金额是否有请款
export function checkBcje(params) {
  return request({
    url: `/sap/opu/odata/SAP/ZFPC_CONT_RACT_SRV/FuncImport_ItemAmoutCheck?Zywhdbm='${params.Zywhdbm}'&ZdocumentNo='${params.ZdocumentNo}'&ZnitemAmtTax='${params.ZnitemAmtTax}'`,
    method: 'get',
  })
}

// 选择组织后调用
export function fetchFuncImportZnodeid(Znodeid) {
  return request({
    url: `/sap/opu/odata/SAP/ZFPC_CONT_RACT_SRV/FuncImport_Znodeid?Znodeid='${Znodeid}'`,
    method: 'get',
  })
}
