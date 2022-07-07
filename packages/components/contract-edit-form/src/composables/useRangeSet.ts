import type { Ref } from 'vue'
import type {
  CommonFunc,
  ContractEditData,
  DelRangeSet,
  SetRangeInfo,
} from '../interface/contractEdit'
import type { CommonType } from '../interface'

export default function useRangeSet(formData: Ref<ContractEditData>) {
  // 根据勾选的适用范围带出数据
  const setRangeInfo: SetRangeInfo = (
    rangeList: CommonType[],
    index: number
  ) => {
    const ContRangeSet = formData.value.ContRangeSet.results || []
    const currRangeItem = ContRangeSet[index]
    const firstSelectedItem = rangeList.splice(0, 1)[0]
    currRangeItem.Zorgname = firstSelectedItem.ZORGNAME
    currRangeItem.ZapplyNo = firstSelectedItem.ZAPPLY_NO
    currRangeItem.ZapplyType = firstSelectedItem.ZORGCATG
    if (rangeList.length) {
      // 然后将已勾选的剩下数据，新增出来
      rangeList.forEach((s) => {
        const newIndex = ContRangeSet.filter((d) => d.Operation !== 'D').length
        const newItem = {
          Operation: 'C',
          Zorgname: s.ZORGNAME,
          ZapplyNo: s.ZAPPLY_NO,
          ZapplyType: s.ZORGCATG,
          Zseqno: '',
          Remark: '',
        }
        ContRangeSet.splice(newIndex, 0, newItem)
      })
    }
    resetZseqno()
  }
  // 重排序号字段
  const resetZseqno = () => {
    formData.value.ContRangeSet.results.forEach((d, idx) => {
      d.Zseqno = (idx + 1).toString()
    })
  }
  // 新增适用范围
  const addRangeSet: CommonFunc = () => {
    const newData = {
      Operation: 'C',
      Zseqno: '',
      Zorgname: '',
      ZapplyNo: '',
      ZapplyType: '',
      Remark: '',
    }
    const newIndex = formData.value.ContRangeSet.results.filter(
      (d) => d.Operation !== 'D'
    ).length
    formData.value.ContRangeSet.results.splice(newIndex, 0, newData)
    resetZseqno()
  }
  // 删除适用范围
  const delRangeSet: DelRangeSet = (index: number) => {
    const currItem = formData.value.ContRangeSet.results.splice(index, 1)[0]
    if (currItem.Operation !== 'C') {
      currItem.Operation = 'D'
      formData.value.ContRangeSet.results.push(currItem)
    }
    resetZseqno()
  }

  return {
    setRangeInfo,
    addRangeSet,
    delRangeSet,
  }
}
