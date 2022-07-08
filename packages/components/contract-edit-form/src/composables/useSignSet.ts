//@ts-nocheck
import { ElMessage } from '@element-plus/components'
import { swapArray } from '../utils'
import type { Ref } from 'vue'
import type {
  AddSignSet,
  CommonFunc,
  ContPartySet,
  ContractEditData,
  ContSignSet,
  DelSignSet,
  DownSignSet,
  SetSealInfo,
  UpdateSignSetByParty,
  UpSignSet,
} from '../interface/contractEdit'
import type { CommonType } from '../interface'

export default function useSignSet(formData: Ref<ContractEditData>) {
  // 初始化签章信息数据（通过ZpartyId将数据和对应的签约主体绑定）
  const initContSignSet = () => {
    const class1 = formData.value.ZconClassNo1
    const partySet = formData.value.ContPartySet?.results || []
    formData.value.ContSignSet?.results?.forEach((d) => {
      if (class1 === '06') {
        // 投策类用ZbodyType+ProviderNo对应
        const key = d.ZbodyType + d.ProviderNo
        partySet.forEach((p) => {
          if (p.ZbodyType + p.ProviderNo === key) {
            d.ZpartyId = p.ZpartyId
          }
        })
      } else {
        // 其他都用ZbodyType+ZbwtbodyType对应
        const key = d.ZbodyType + d.ZbwtbodyType
        partySet.forEach((p) => {
          if (p.ZbodyType + p.ZbwtbodyType === key) {
            d.ZpartyId = p.ZpartyId
          }
        })
      }
    })
  }
  // 重排签章顺序字段
  const resetZsealSeq = () => {
    formData.value.ContSignSet.results.forEach((d, idx) => {
      d.ZsealSeq = (idx + 1).toString()
    })
  }
  // 下移签章信息
  const downSignSet: DownSignSet = (index: number) => {
    const arr = formData.value.ContSignSet.results
    if (arr[index].Hguid) arr[index].Operation = 'U'
    if (arr[index + 1].Hguid) arr[index + 1].Operation = 'U'
    formData.value.ContSignSet.results = swapArray(arr, index + 1, index)
    resetZsealSeq()
  }
  // 上移签章信息
  const upSignSet: UpSignSet = (index: number) => {
    const arr = formData.value.ContSignSet.results
    if (arr[index].Hguid) arr[index].Operation = 'U'
    if (arr[index - 1].Hguid) arr[index - 1].Operation = 'U'
    formData.value.ContSignSet.results = swapArray(arr, index - 1, index)
    resetZsealSeq()
  }
  // 新增签章信息（个人签名）
  const addSignSet: AddSignSet = (index: number) => {
    const newItem = {
      ...formData.value.ContSignSet.results[index],
      Hguid: '',
      Qguid: '',
      Operation: 'C',
      ZsealTypeNo: 'PERSONAL',
      ZsealType: '个人签名',
      ZsealId: '',
      ZsealName: '',
      ZsignUserName: '',
      ZsignUserPhone: '',
      ZsignNumber: '',
      SignCount: '',
    }
    formData.value.ContSignSet.results.splice(index + 1, 0, newItem)
    resetZsealSeq()
  }
  // 删除签章信息
  const delSignSet: DelSignSet = (index: number) => {
    const ContSignSet = formData.value.ContSignSet.results
    const currItem = ContSignSet[index]
    const { ZsealTypeNo, ZpartyId } = currItem
    if (ZsealTypeNo !== 'PERSONAL') {
      if (
        ContSignSet.filter(
          (d) =>
            d.Operation !== 'D' &&
            d.ZpartyId === ZpartyId &&
            d.ZsealTypeNo !== 'PERSONAL'
        ).length <= 1
      ) {
        ElMessage.error('必须至少保留一条')
        return
      }
    }
    ContSignSet.splice(index, 1)
    if (currItem.Hguid || currItem.Operation !== 'C') {
      currItem.Operation = 'D'
      ContSignSet.push(currItem)
    }
    resetZsealSeq()
  }
  // 根据勾选的印章信息带出数据
  const setSealInfo: SetSealInfo = (sealList: CommonType[], index: number) => {
    // 赋值方法
    const getInfoObj = (sealInfo: CommonType) => {
      return {
        ZsealId: sealInfo.ZSEAL_ID,
        ZsealName: sealInfo.ZSEAL_NAME,
        ZsealTypeNo: sealInfo.ZSEAL_TYPE_NO,
        ZsealType: sealInfo.ZSEAL_TYPE,
        ZsignUserName: sealInfo.ZSIGN_USER_NAME,
        ZsignUserPhone: sealInfo.ZSIGN_USER_PHONE,
        ZsignUser: sealInfo.ZSIGN_USER,
        ZsealCategory: sealInfo.ZSEAL_CATEGORYT,
      }
    }
    const ContSignSet = formData.value.ContSignSet.results
    // 先将删除的item排除掉
    const notDelSignItem = ContSignSet.filter((s) => s.Operation !== 'D')
    // 直接取当前item保证后面修改
    const currSignItem = ContSignSet[index]
    // 印章搜索帮助勾选的第一条数据
    const firstSealItem = sealList.splice(0, 1)[0]
    // 先将自身筛选掉再匹配，保证可以修改自身数据
    const exist = notDelSignItem
      .filter((s) => s.ZsealId !== currSignItem.ZsealId)
      .find((s) => s.ZsealId === firstSealItem.ZSEAL_ID)
    if (exist) {
      ElMessage.warning('已存在相同印章，无法修改')
    } else {
      Object.assign(currSignItem, {
        ...getInfoObj(firstSealItem),
        Operation: currSignItem.Operation ? currSignItem.Operation : 'U',
      })
    }
    sealList.forEach((d) => {
      const existSeal = ContSignSet.find(
        (s) => s.Operation !== 'D' && s.ZsealId === d.ZSEAL_ID
      )
      if (existSeal) {
        Object.assign(existSeal, {
          ...getInfoObj(d),
          Operation: existSeal.Operation ? existSeal.Operation : 'U',
        })
      } else {
        const newItem = {
          ...currSignItem,
          ...getInfoObj(d),
          Hguid: '',
          Operation: 'C',
        }
        // 没被删除的印章的数量
        const notDelItemLength = ContSignSet.filter(
          (s) => s.Operation !== 'D'
        ).length
        // 用splice插入到删除的数据前
        ContSignSet.splice(notDelItemLength, 0, newItem)
      }
    })
    resetZsealSeq()
  }
  // 根据签约主体更新签章信息
  const updateSignSetByParty: UpdateSignSetByParty = (party: ContPartySet) => {
    const ZsignType = formData.value.ZsignType
    const ZpartyId = party.ZpartyId
    if (['10', '20'].includes(ZsignType)) {
      formData.value.ContSignSet.results.forEach((d) => {
        if (d.ZpartyId === ZpartyId && d.Operation !== 'D') {
          if (d.Operation !== 'C') d.Operation = 'U'
          d.ZbodyType = party.ZbodyType
          d.ProviderNo = party.ProviderNo
          d.Provider = party.Provider
          d.Ztyshxydm = party.Ztyshxydm
          // 改了公司名称，相应地，印章信息要清空
          d.ZsealId = ''
          d.ZsealName = ''
          if (d.ZsealTypeNo !== 'PERSONAL') {
            d.ZsealTypeNo = ''
            d.ZsealType = ''
            d.ZsignUserName = ''
            d.ZsignUserPhone = ''
          }
        }
      })
    }
  }
  // 签章方式改变重置签章信息
  const resetSignSetData: CommonFunc = () => {
    const ZsignType = formData.value.ZsignType
    const partySet = formData.value.ContPartySet.results.filter(
      (d) => d.Operation !== 'D'
    )
    const newSignSet: ContSignSet[] = []
    partySet.forEach((d) => {
      if (d.Operation !== 'D') {
        const obj = {
          Operation: 'C',
          ZbodyType: d.ZbodyType,
          ProviderNo: d.ProviderNo || '',
          Provider: d.Provider || '',
          Ztyshxydm: d.Ztyshxydm || '',
          ZisWtf: d.ZisWtf || '',
          ZbwtbodyType: d.ZbwtbodyType || '',
          ZpartyId: d.ZpartyId,
          ZsealState: '',
          ZsealId: '',
          ZsealName: '',
          ZsealType: '',
          ZsealTypeNo: '',
          ZsignUserName: '',
          ZsignUserPhone: '',
          ZsealSeq: '',
          // 投策
          FileName: formData.value.ZconName,
          // 成本
          ZcmSginPage: '',
        }
        if (ZsignType === '10') {
          newSignSet.push(obj)
        } else if (ZsignType === '20') {
          // 线下用印只需要甲方信息（50是投策类是否我方的“是”）
          if (d.ZbodyType === '10' || d.ZbodyType === '50') {
            newSignSet.push(obj)
          }
        }
      }
    })
    const oldSignSet = formData.value.ContSignSet.results
      .filter((d) => d.Operation !== 'C')
      .map((d) => ({ ...d, Operation: 'D' }))
    formData.value.ContSignSet.results = [...newSignSet, ...oldSignSet]
    // 如果有乙方，将乙方放第一位
    if (ZsignType === '10') {
      const arr = formData.value.ContSignSet.results
      formData.value.ContSignSet.results = swapArray(arr, 0, 1)
    }
    resetZsealSeq()
  }
  // 更新主体性质
  const updateBodyType = () => {
    const currPartySet = formData.value.ContPartySet.results.filter(
      (d) => d.Operation !== 'D'
    )
    formData.value.ContSignSet.results.forEach((d) => {
      if (d.Operation !== 'D') {
        const party = currPartySet.find((p) => p.ZpartyId === d.ZpartyId)
        d.ZbodyType = party?.ZbodyType || ''
        if (d.Operation !== 'C') d.Operation = 'U'
      }
    })
  }
  // 根据新增的签约主体新增签章信息
  const addSignByParty = (newParty: ContPartySet) => {
    const ZsignType = formData.value.ZsignType
    const nZbodyType = newParty.ZbodyType
    if (
      (ZsignType === '20' && ['10', '50'].includes(nZbodyType)) ||
      ZsignType === '10'
    ) {
      const ZpartyId = newParty.ZpartyId
      const showingSignSet = formData.value.ContSignSet.results.filter(
        (d) => d.Operation !== 'D'
      )
      const tmpSignItem = {
        Operation: 'C',
        ZbodyType: nZbodyType,
        Provider: newParty.Provider,
        ProviderNo: newParty.ProviderNo,
        Ztyshxydm: newParty.Ztyshxydm,
        ZpartyId,
        ZsealState: '',
        ZsealId: '',
        ZsealName: '',
        ZsealType: '',
        ZsealTypeNo: '',
        ZsignUserName: '',
        ZsignUserPhone: '',
        ZsealSeq: '',
        // 投策
        FileName: formData.value.ZconName,
        // 成本
        ZcmSginPage: '',
      }
      formData.value.ContSignSet.results.splice(
        showingSignSet.length,
        0,
        tmpSignItem
      )
      resetZsealSeq()
    }
  }
  // 根据删除的签约主体删除签章信息
  const delSignByParty = (delParty: ContPartySet) => {
    const ZpartyId = delParty.ZpartyId
    const newSignSet: ContSignSet[] = []
    formData.value.ContSignSet.results.forEach((d) => {
      if (d.ZpartyId !== ZpartyId) {
        newSignSet.push(d)
      } else {
        if (d.Hguid || d.Operation !== 'C') {
          newSignSet.push({
            ...d,
            Operation: 'D',
          })
        }
      }
    })
    const signSetShow = newSignSet.filter((d) => d.Operation !== 'D')
    const signSetHide = newSignSet.filter((d) => d.Operation === 'D')
    formData.value.ContSignSet.results = [...signSetShow, ...signSetHide]
    resetZsealSeq()
    // 如果删除的是甲乙丙丁，要重排主体性质
    if (formData.value.ZconClassNo1 !== '06') {
      // 更新主体性质
      updateBodyType()
    }
  }

  return {
    upSignSet,
    downSignSet,
    addSignSet,
    delSignSet,
    setSealInfo,
    updateSignSetByParty,
    resetSignSetData,
    initContSignSet,
    addSignByParty,
    delSignByParty,
  }
}
