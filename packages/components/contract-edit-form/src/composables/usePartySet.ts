//@ts-nocheck
import { ref, computed } from 'vue'
import { ElMessage } from '@element-plus/components'
import { randomId } from '../utils'
import type { Ref } from 'vue'
import type { CompanySearch, ContractStore, CommonType } from '../interface'
import type {
  AllOrNoZfzmk,
  CheckTaxType,
  ClearWtCompanyInfo,
  CommonFunc,
  ContPartySet,
  ContractEditData,
  DelPartySet,
  SetCheckboxSingle,
  SetCompanyInfo,
} from '../interface/contractEdit'

export default function usePartySet(
  formData: Ref<ContractEditData>,
  store: ContractStore
) {
  const newPartyItem = ref<ContPartySet>()
  const delPartyItem = ref<ContPartySet>()

  // 新增签约主体
  const addPartySet: CommonFunc = () => {
    const domainList = computed(() => store.domainList)

    const newData: ContPartySet = {
      Operation: 'C',
      ZbodyType: '',
      Provider: '',
      ProviderNo: '',
      Ztyshxydm: '',
      ZisPayer: false,
      ZisKp: false,
      ZisSk: false,
      ZpartyId: randomId(),
    }

    // 当前显示的数据
    const partySet: ContPartySet[] = formData.value.ContPartySet.results.filter(
      (d) => d.Operation !== 'D'
    )
    if (formData.value.ZconClassNo1 !== '06') {
      // 非投策类去掉50 60
      // 主体性质
      const bodyTypes = domainList.value.filter(
        (d) => d.Fieldname === 'ZbodyType' && !['50', '60'].includes(d.Code)
      )
      if (partySet.length >= bodyTypes.length) {
        ElMessage.error('签约主体数已达最大值')
        return
      }
      newData.ZbodyType = bodyTypes[partySet.length].Code
    } else {
      // 投策类默认新增非我方的主体
      newData.ZbodyType = '60'
    }
    // 使用splice是因为有可能数组后面带Operation为‘D’的数据
    formData.value.ContPartySet.results.splice(partySet.length, 0, newData)
    // 对外暴露新增的item
    newPartyItem.value = newData
  }
  // 重排主体性质（逻辑是将后面的向前补位）
  const resortBodyType = (ZbodyType: string) => {
    const domainList = computed(() => store.domainList)
    // 主体性质（不包含委托方）
    const bodyTypes = domainList.value.filter(
      (d) => d.Fieldname === 'ZbodyType'
    )
    const delTypeIndex = bodyTypes.findIndex((d) => d.Code === ZbodyType)
    formData.value.ContPartySet.results.forEach((item) => {
      const itemTypeIndex = bodyTypes.findIndex(
        (d) => d.Code === item.ZbodyType
      )
      if (itemTypeIndex > delTypeIndex) {
        item.ZbodyType = bodyTypes[itemTypeIndex - 1].Code
        if (item.Hguid) item.Operation = 'U'
      }
    })
  }
  // 删除签约主体（包括委托方）
  const delPartySet: DelPartySet = (index: number) => {
    // 删除的item
    const currItem: ContPartySet = formData.value.ContPartySet.results.splice(
      index,
      1
    )[0]
    // 删除的主体性质
    const ZbodyType = currItem.ZbodyType
    if (currItem.Operation !== 'C') {
      currItem.Operation = 'D'
      formData.value.ContPartySet.results.push(currItem)
    }

    // 对外暴露删除的item
    delPartyItem.value = currItem

    // 如果删除的是甲乙丙丁，要重排主体性质（投策类只有是否我方，所以不需要重排）
    if (formData.value.ZconClassNo1 !== '06') {
      // 重排主体性质
      resortBodyType(ZbodyType)
    }
  }
  // 确保checkbox只能选中一个的方法
  const setCheckboxSingle: SetCheckboxSingle = (
    index: number,
    field: string,
    value: boolean
  ) => {
    if (value) {
      if (field === 'ZisKp') {
        if (!formData.value.ContPartySet.results[index].ZisSk) {
          formData.value.ContPartySet.results[index].ZisKp = false
          ElMessage.warning(
            '当“是否委托开票”为“是”时，必须勾选“是否委托收款”！'
          )
          return false
        }
      }
      formData.value.ContPartySet.results.forEach(
        (d: ContPartySet, idx: number) => {
          if (idx !== index) {
            d[field] = false
            if (field === 'ZisSk') {
              d.ZisKp = false
            }
          }
        }
      )
    } else {
      if (field === 'ZisSk') {
        formData.value.ContPartySet.results[index].ZisKp = false
      }
    }
  }
  // 公司搜索帮助设置公司相关信息
  const setCompanyInfo: SetCompanyInfo = (
    index: number,
    data: CompanySearch
  ) => {
    const currParty: ContPartySet = formData.value.ContPartySet.results[index]
    currParty.Provider = data.BUTXT
    currParty.ProviderNo = data.NODEID
    currParty.Ztyshxydm = data.ZTYSHXYDM
    currParty.ZNSRLXMS = data.ZNSRLXMS
    currParty.ZZXZFL = data.ZZXZFL
  }
  // 委托公司搜索帮助设置委托公司相关信息
  const setWtCompanyInfo: SetCompanyInfo = (
    index: number,
    data: CompanySearch
  ) => {
    const currParty: ContPartySet = formData.value.ContPartySet.results[index]
    currParty.ProviderWt = data.BUTXT
    currParty.ProviderNoWt = data.NODEID
    currParty.ZtyshxydmWt = data.ZTYSHXYDM
    currParty.ZzxzflWt = data.ZZXZFL
  }
  // 没勾选任何委托，清空委托公司信息
  const clearWtCompanyInfo: ClearWtCompanyInfo = (
    index: number,
    value: boolean
  ) => {
    // 反勾则清理当前行的委托公司信息
    if (!value) {
      const currParty: ContPartySet = formData.value.ContPartySet.results[index]
      if (!currParty.ZisPayer && !currParty.ZisKp && !currParty.ZisSk) {
        currParty.ProviderWt = ''
        currParty.ProviderNoWt = ''
        currParty.ZtyshxydmWt = ''
        currParty.ZzxzflWt = ''
      }
    } else {
      // 勾选则清理其他的委托公司信息
      formData.value.ContPartySet.results.forEach((d, idx) => {
        if (d.Operation !== 'D' && idx !== index) {
          if (!d.ZisPayer && !d.ZisKp && !d.ZisSk) {
            d.ProviderWt = ''
            d.ProviderNoWt = ''
            d.ZtyshxydmWt = ''
            d.ZzxzflWt = ''
          }
        }
      })
    }
  }
  // 根据甲方纳税类型和发票类型，弹出提示
  const checkTaxType: CheckTaxType = (
    invoicetype: string,
    row: ContPartySet
  ) => {
    if (invoicetype === 'N' && row.ZNSRLXMS === '01') {
      ElMessage.warning('该法人为一般纳税人，一般需开具增值税专用专票')
    }
  }

  // 全部操盘和不操盘二选一
  const allOrNoZfzmk: AllOrNoZfzmk = (index: number, currNode: CommonType) => {
    const data = formData.value.ContPartySet.results[index].Zfzmk
    if (data) {
      if (currNode.id === '00' && data.includes('00')) {
        formData.value.ContPartySet.results[index].Zfzmk = (
          data as string[]
        ).filter((d) => d === '00')
      } else {
        if (data.length > 1 && data.includes('00')) {
          formData.value.ContPartySet.results[index].Zfzmk = (
            data as string[]
          ).filter((d) => d !== '00')
        }
      }
    }
  }

  return {
    newPartyItem,
    delPartyItem,
    addPartySet,
    delPartySet,
    setCheckboxSingle,
    setCompanyInfo,
    setWtCompanyInfo,
    clearWtCompanyInfo,
    checkTaxType,
    allOrNoZfzmk,
  }
}
