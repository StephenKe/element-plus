import type { ElOption } from '@element-plus/components'

export interface Tree {
  id: string
  label: string
  children?: Tree[]
}

export interface SetResults {
  [key: string]: string
}

export interface ContSet {
  results: SetResults[]
}

export interface ContConfig {
  Zdm: string
  ZdmDec: string
  Zcxfs: string
  ZisDisplay: boolean
  ZisReq: boolean
  Zlevel: string
  Zlength: number
}

export interface SelectOption {
  id?: string
  label: string
  value?: string
  title?: string
  disabled?: boolean
  providerNo?: string
  children?: SelectOption[]
}

// 表单项
export interface Field {
  field: string
  fieldName: string
  placeholder: string
  inputType: string
  disabled: boolean
  maxlength?: number
  hidden?: boolean
  selectMultiple?: boolean
  selectOptions?: typeof ElOption[]
}

// 表单 tableColumn
export interface TableColumn {
  label: string
  prop: string
  disabled: boolean[]
  width?: string
  minWidth?: string
  required?: boolean
  hidden?: boolean
  inputType?: string
  maxlength?: number
  selectMultiple?: boolean
  defaultExpandedKeys?: string[]
  selectOptions?: any
}

export interface LvHeadBtn {
  name: string
  type:
    | ''
    | 'default'
    | 'success'
    | 'text'
    | 'primary'
    | 'warning'
    | 'info'
    | 'danger'
    | undefined
  plain: boolean
}

// 表单配置项
export interface Config {
  lv: string
  lvName: string
  showType: string
  fields?: Field[]
  tableColumns?: TableColumn[]
  showSum?: boolean
  sumFields?: string[]
  lvHeadBtns?: LvHeadBtn[]
  hidden?: boolean
}

export interface ContractConfigParams {
  id?: string
  pageType?: string
  ZconState?: string
  ZdocumentNo?: string
  ZdocumentType?: string
  ZconCategoryNo?: string
  ZsReasonNo?: string
  ZconClassNo1?: string
  ZconClassNo2?: string
  ZconClassNo3?: string
  Zmode?: string
  flag?: string // 标记，用于处理一些特殊情况
}

export interface CommonType {
  [key: string]: string
}

export interface DomainData {
  Fieldname: string // 域名称
  Code: string
  Text: string
  Langu: string
  Field1: string
}

export interface ClassData {
  ZconClassNo: string
  ZconClass: string
  ZrecordState: string
  ZpconClassNo: string
  Zlevel: string
  ZconCategoryNo: string
  Zremark: string
  ZtaxType: string
  ZtaxTypeNo: string
  Zywhdbm: string
  Zywhdms: string
  ContractPaySet: { results: CommonType[] }
  ContractAttchSet: { results: CommonType[] }
  ContractBchtSet: { results: CommonType[] }
}

export interface ContractStore {
  domainList: DomainData[]
  classList: ClassData[]
  contTableEnum: CommonType
}

export interface ContractData {
  ZdocumentType: string // 合同类型
  ZconCategoryNo: string // 合同类别
  ZdocumentNo: string // 合同流水号
  ZnewDocumentNo: string
  ZconName: string
  ZconState: string // 合同状态
  Hguid: string // 合同ID
  ZnewGuid: string
  Operation: string // 业务识别类型
  ZconClassNo1: string // 一级合同分类CODE
  ZconClass1: string
  ZconClassNo2: string // 二级合同分类CODE
  ZconClass2: string
  ZconClassNo3: string | string[] // 三级合同分类CODE
  ZconClass3: string | string[]
  FormId: string // 重新提交需要
  Zuser: string // 合同经办人
  ZuserName: string
  ZconStateIsp: string // 供方协同状态
}

export interface ErrorCheck {
  A?: number
  E?: number
  W?: number
}

export interface DepTreeData {
  Zoorgname: string
  Zorgid: string
  Zorglev: string
  Zsporgid: string
  Zsporgname: string
  Leaf: boolean
  NextLevelSet?: DepTreeData[]
}

// 公司搜索帮助数据结构
export interface CompanySearch {
  id: string
  BUTXT: string
  NODEID: string
  ZNSRLXMS: string
  ZTYSHXYDM: string
  ZZXZFL: string
}
