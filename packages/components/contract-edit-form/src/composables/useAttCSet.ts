//@ts-nocheck
import { computed } from 'vue'
import { cloneDeep } from 'lodash'
import { arrDistinctByProp } from '../utils'
import { removeAttachFile } from '../requests'
import type { Ref } from 'vue'
import type {
  CommonFunc,
  ContractEditData,
  ContAttCSet,
  DelAttCFile,
  HandleUploadAttC,
} from '../interface/contractEdit'
import type { ContractStore } from '../interface'

export default function useAttCSet(
  formData: Ref<ContractEditData>,
  store: ContractStore
) {
  // 新增附件
  const addAttC: CommonFunc = () => {
    const ContAttCSet = formData.value.ContAttCSet.results
    const showLength = ContAttCSet.filter((d) => d.Operation !== 'D').length
    const newItem: ContAttCSet = {
      Operation: 'C',
      Code: '',
      Guid: '',
      NotDel: false,
      Filename: '',
      Ernam: '',
      Erdat: '',
      ZfileidZt: '',
    }
    ContAttCSet.splice(showLength, 0, newItem)
  }

  // 删除附件（三级分类生成的只删除文件，新增出来的整条删除，根据NotDel判断）
  const delAttCFile: DelAttCFile = async (lv: string, index: number) => {
    const ContAttCSet: ContAttCSet = formData.value.ContAttCSet.results[index]
    if (ContAttCSet.NotDel) {
      if (ContAttCSet.ZfileidZt) {
        const res = await removeAttachFile(ContAttCSet.ZfileidZt)
        if (res.code === 0) {
          ContAttCSet.Operation = 'U'
          ContAttCSet.Filename = ''
          ContAttCSet.Ernam = ''
          ContAttCSet.Erdat = ''
          ContAttCSet.ZfileidZt = ''
        }
      }
    } else {
      const currItem = formData.value.ContAttCSet.results.splice(index, 1)[0]
      if (currItem.Operation !== 'C') {
        currItem.Operation = 'D'
        formData.value.ContAttCSet.results.push(currItem)
      }
    }
  }
  // 上传完附件回调
  const handleUploadAttC: HandleUploadAttC = (
    data: ContAttCSet,
    index: number
  ) => {
    const currItem: ContAttCSet = formData.value.ContAttCSet.results[index]
    currItem.Filename = data.Filename
    currItem.Ernam = data.Ernam
    currItem.Erdat = data.Erdat
    currItem.ZfileidZt = data.ZfileidZt
    if (!['C', 'D'].includes(currItem.Operation)) {
      currItem.Operation = 'U'
    }
  }

  // 三级分类改变生成附件数据，NotDel标记为true
  const setContAttCSet: CommonFunc = () => {
    // 所有的合同分类（包含一二三级分类）
    const classList = computed(() => store.classList)
    const conClassNo3 = formData.value.ZconClassNo3 || []
    let attcSetList: any[] = []
    ;(conClassNo3 as string[]).forEach((d) => {
      const contractClass = classList.value.find((c) => c.ZconClassNo === d)
      const currAttcs = contractClass?.ContractAttchSet?.results || []
      attcSetList.push(...currAttcs)
    })
    // 去重
    attcSetList = arrDistinctByProp(attcSetList, 'ZfileTypeNo')
    // 当前应该显示的所有附件类型
    const contAttCSet = attcSetList.map((d) => {
      return {
        CodeTxt: d.ZfileType,
        Code: d.ZfileTypeNo,
      }
    })

    // 原数据
    const currAttCSet = formData.value.ContAttCSet.results
    // 新数据
    const newAttCSet: ContAttCSet[] = []
    contAttCSet.forEach((d) => {
      const newItem: ContAttCSet = {
        Code: '',
        CodeTxt: '',
        NotDel: true,
        Operation: 'C',
        Filename: '',
        Ernam: '',
        Erdat: '',
        ZfileidZt: '',
      }
      const oldItemIndex = currAttCSet.findIndex((c) => c.Code === d.Code)
      if (oldItemIndex !== -1) {
        Object.assign(newItem, { ...cloneDeep(currAttCSet[oldItemIndex]) })
        newItem.Guid = ''
        newItem.Operation = 'C'
        newItem.NotDel = true
      } else {
        Object.assign(newItem, { ...d })
      }
      newAttCSet.push(newItem)
    })
    for (let i = 0; i < currAttCSet.length; i++) {
      if (currAttCSet[i].Guid || currAttCSet[i].Operation !== 'C') {
        currAttCSet[i].Operation = 'D'
      } else {
        currAttCSet.splice(i, 1)
        i--
      }
    }
    formData.value.ContAttCSet.results = [...newAttCSet, ...currAttCSet]
  }

  return {
    addAttC,
    delAttCFile,
    handleUploadAttC,
    setContAttCSet,
  }
}
