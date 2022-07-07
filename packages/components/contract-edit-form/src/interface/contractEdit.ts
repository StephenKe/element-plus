import type {
  CompanySearch,
  ContractConfigParams,
  ContractData,
  CommonType,
} from './index'

export interface ContractUser {
  name: string
  bip?: string
}

export interface FormChangeFlag {
  target: string
  index?: number
}

export interface ContractQuery {
  projectCode?: string
  projectName?: string
  areaRelId?: string
  areaRelName?: string
}

export interface ContPartySet {
  Zfzmk?: string | string[]
  Operation: string
  ZbodyType: string
  Provider: string
  ProviderNo: string
  Ztyshxydm: string
  ZNSRLXMS?: string
  ZZXZFL?: string
  ProviderWt?: string
  ProviderNoWt?: string
  ZtyshxydmWt?: string
  ZzxzflWt?: string
  ZisPayer: boolean
  ZisKp: boolean
  ZisSk: boolean
  ZpartyId: string
  Hguid?: string
  ZisWtf?: string
  ZbwtbodyType?: string
  Zzgbl?: string
  Zqybl?: string
}

export interface ContPersonSet {
  Operation: string
  Zrylx: string
  ZconName: string
  ZconPhone: string
  ZconMail: string
  Zstatus: string
}

export interface ContBankSet {
  AccountName: string
  Bank: string
  BankId: string
  BankAccount: string
  Operation: string
  Provider: string
  ProviderNo: string
  ZbodyType1: string
  ZbodyType1Txt: string
  Zzhlx: string
  ZzhlxTxt: string
  ZdocumentNo?: string
  Guid?: string
  Hguid?: string
}

export interface ContSignSet {
  Hguid?: string
  ZsealSeq: string
  Operation: string
  ZbodyType: string
  ProviderNo: string
  Provider: string
  Ztyshxydm: string
  ZisWtf?: string
  ZbwtbodyType?: string
  ZpartyId: string
  ZsealId: string
  ZsealName: string
  ZsealState: string
  ZsealType: string
  ZsealTypeNo: string
  ZsignUserName: string
  ZsignUserPhone: string
  // 投策
  FileName?: string
  // 成本
  ZcmSginPage: string
}

export interface ContItemBudgetSet {
  Amount: string
  Fundsctr: string
  LdrBud: string
  Operation: string
  ZconClassNo3: string
  ZitemNo: string
  ZnitemAmtTax: string
  Zseqno: string
  Zywhdbm: string
  Zywhdms: string
  Znewflag: boolean
  Bezeich?: string
  Bmms?: string
  Dwms?: string
  Fincode?: string
  Hguid?: string
  Iguid?: string
  Yguid?: string
  Ysdw?: string
  Zbcje?: string
  ZdocumentNo?: string
}

export interface ContItemSet {
  Menge: string
  Operation: string
  Uprice: string
  ZconClass3: string
  ZconClassNo3: string
  ZitemAmt: string
  ZitemAmtTax: string
  ZitemNo: string
  ZtaxAmt: string
  Zywhdbm: string
  Zywhdms: string
  ZtaxRateNo?: string
  ZtaxRateNoTxt?: string
  Hguid?: string
  Iguid?: string
  ZdocumentNo?: string
  Zbcje?: string
  ZbcjeAmt?: string
  ZbcjeTaxamt?: string
  ZnitemAmt?: string
  ZnitemAmtTax?: string
  Zfwwl?: string
  ZisDeleted?: string
  Remark?: string
  ContItemBudgetSet?: { results: ContItemBudgetSet[] }
}

export interface ContPaySet {
  Fguid?: string
  Hguid?: string
  Operation: string
  Remark: string
  ZdocumentNo: string
  ZitemNo: string
  ZpaymentAmt: string
  ZpaymentAmtTax: string
  ZpaymentDate: string
  ZpaymentPerc: string
  ZpaymentType: string
  ZpaymentTypeNo: string
  Zseqno: string
  ZtaxAmt: string
}

export interface ContAttBSet {
  ContType: string
  Erdat: string
  Ernam: string
  Filename: string
  Guid?: string
  Operation: string
  Procguid?: string
  Zdjh: string
  Zdjlx: string
  Zfileid?: number
  ZfileidZt: string
  file?: string
}

export interface ContAttCSet {
  Code: string
  CodeTxt?: string
  Guid?: string
  NotDel: boolean
  Operation: string
  Filename: string
  Ernam: string
  Erdat: string
  ZfileidZt: string
}

export interface ContRangeSet {
  Zseqno: string
  Operation: string
  Zorgname: string
  ZapplyNo: string
  ZapplyType: string
  Remark: string
}

export interface ContractEditData extends ContractData {
  ZnodeName: string
  Prctr: string
  ZrelatedCon: string
  ZcloseStateTxt: string
  ZcloseState: string
  ZsealStateTxt: string
  ZconStateIspTxt: string
  ZsimilarScore: string
  Sumbitname: string
  Approver: string
  SubmTim: any
  SubmDat: any
  PassTim: any
  PassDat: any
  ZlastDocumentNo: string
  ZmainConName: string
  ZmainConNo: string
  ZconNo: string
  ZmainDocumentNo: string
  Zlandname: string
  Zland: string
  ZsamtTax: string
  Zsamt: string
  ZtaxAmt: string
  ZmainZconClassNo3: string | string[]
  ZsReasonNo: string | string[]
  Zterritory: string | string[]
  Zdinvoicetype: string
  ZsignType: string
  Remark: string
  ZssqyMs: string
  Zssqy: string
  Zxmzj: string
  ZproTxt: string
  Zbm: string
  ZfqmcMdg: string
  ZsealState: string
  ZuserDep: string
  ZuserDepName: string
  Zuserfullname: string
  Znodeid: string
  ZnodeidName: string
  ZisTemplate: string
  ZcurrencyNo: string
  ZexchangeRate: string
  ZifWtyw: boolean
  ZgdGuid: string // GUID 16
  ZgdLmid: string // 归档条目ID
  ZuserBip1: string // 提交人BIP
  ZuserName1: string // 提交人
  ZgdStatus: string // 归档状态
  ZgdDate: string // 归档日期
  ZgdTime: string // 归档时间
  ZReturnstatus: string // 返回状态
  ZReturnmsg: string // 状态描述
  Zwjtm: string // 文件题名
  Zbkmc: string // ZBKMC
  Zyjfl: string // 一级分类
  Zqzmc: string // 全宗名称
  Zzqzmc: string // 子全宗名称
  Znd: string // 年度
  Zfs: string // 份数
  Zzmj: string // 密级
  Zbgqx: string // 保管期限
  Zwjrq: string // 文件日期
  Hguid: string // GUID 16
  Zwjdqrq: string // 文件到期日期
  Zzrr: string // 责任人
  Zgdsj: string // 归档时间
  Zcfwz: string // 存放位置
  Zfqsj: string // 发起时间
  Zyglx: string // 原稿类型
  Ztype?: string
  Jklx?: string
  Sfsjghzfjk?: string
  Sftphzxmzjglyq?: string
  Sfsydgxm?: string
  ZcmJfwyj1: string // 甲方违约责任1
  ZcmJfwyj2: string // 甲方违约责任2
  ZcmYfwyj1: string // 乙方违约责任1
  ZcmYfwyj2: string // 乙方违约责任2
  ZcmTgyj1: string // 停工、缓建1
  ZcmTgyj2: string // 停工、缓建2
  ZcmTgyj3: string // 停工、缓建3
  ZcmTgyj4: string // 停工、缓建4
  ZcmQtydsx: string // 其它约定事项
  ZpcQzzfyy?: string
  ContPartySet: { results: ContPartySet[] }
  ContBankSet: { results: ContBankSet[] }
  ContSignSet: { results: ContSignSet[] }
  ContItemSet: { results: ContItemSet[] }
  ContPaySet: { results: ContPaySet[] }
  ContAttASet: { results: CommonType[] }
  ContAttBSet: { results: ContAttBSet[] }
  ContAttCSet: { results: ContAttCSet[] }
  ContAttDSet: { results: CommonType[] }
  ContAttESet: { results: CommonType[] }
  ContRangeSet: { results: ContRangeSet[] }
  ContPersonSet: { results: ContPersonSet[] }
}

// function type 定义
export type CommonFunc = () => void
export type CommonCheckFunc = () => boolean
export type HandleClassNoChange = (
  className: string,
  val: string | string[]
) => void
export type GetTabs = (params?: object) => void
export type SetFormChangeFlag = (obj: FormChangeFlag) => void
export type SetTableItemChangeFlag = (obj: FormChangeFlag) => void
export type GetFormData = (defaultValues?: ContractQuery) => void
export type SetFormData = (callback: any) => void
export type CheckClassNoAndSet = (classNo: number) => boolean
export type GetConfigs = (params: ContractConfigParams) => void
export type DelPartySet = (index: number) => void
export type SetCheckboxSingle = (
  index: number,
  field: string,
  value: boolean
) => false | undefined
export type SetCompanyInfo = (index: number, data: CompanySearch) => void
export type ClearWtCompanyInfo = (index: number, value: boolean) => void
export type CheckTaxType = (invoicetype: string, row: ContPartySet) => void
export type AllOrNoZfzmk = (index: number, currNode: CommonType) => void
export type AddOrDelBankSet = (index: number) => void
export type GetPayerProvider = (isSfjzht?: boolean) => void
export type GetSkProvider = () => void
export type GetKpProvider = (isSfjzht?: boolean) => void
export type SetBankSetProviderInfo = (index: number, value: string) => void
export type SetBankInfo = (
  data: CommonType,
  index: number,
  isSfjzht?: boolean
) => void
export type CheckCompanyAndAccountName = (row: ContBankSet) => void
export type UpSignSet = (index: number) => void
export type DownSignSet = (index: number) => void
export type AddSignSet = (index: number) => void
export type DelSignSet = (index: number) => void
export type UpdateSignSetByParty = (party: ContPartySet) => void
export type SetSealInfo = (sealList: CommonType[], index: number) => void
export type DelPaySet = (index: number) => void
export type AutoCalcPercOrAmt = (index: number, percOrAmt: string) => void
export type AddPaySetByItem = (item: ContItemSet, category: string) => void
export type AutoCalcProgressAmt = (category: string) => void
export type HandleUploadFile = (data: ContAttBSet[]) => void
export type DelAttCFile = (lv: string, index: number) => void
export type HandleUploadAttC = (data: ContAttCSet, index: number) => void
export type SetRangeInfo = (rangeList: CommonType[], index: number) => void
export type DelRangeSet = (index: number) => void
export type DelPersonSet = (index: number) => void
export type SetPersonInfo = (index: number, data: ContPersonSet) => void
export type GetPersonRylxData = (zconCategoryNo: string) => void
export type DelBuildingSet = (index: number) => void
