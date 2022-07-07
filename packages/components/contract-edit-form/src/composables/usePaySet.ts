import { computed } from 'vue'
import { ElMessage } from '@element-plus/components'
import type { Config, ContractStore } from '../interface'
import type { Ref } from 'vue'
import type {
  AddPaySetByItem,
  AutoCalcPercOrAmt,
  AutoCalcProgressAmt,
  CommonFunc,
  ContItemSet,
  ContractEditData,
  DelPaySet,
} from '../interface/contractEdit'

export default function usePaySet(
  formData: Ref<ContractEditData>,
  configs: Ref<Config[]>,
  store: ContractStore
) {
  // 重排序号字段
  const resetZseqno = () => {
    formData.value.ContPaySet.results.forEach((d, idx) => {
      d.Zseqno = (idx + 1).toString()
    })
  }
  // 新增付款条件
  const addPaySet: CommonFunc = () => {
    const newData = {
      Operation: 'C',
      ZitemNo: '',
      ZdocumentNo: '',
      ZpaymentAmt: '0.00',
      ZpaymentAmtTax: '',
      ZpaymentDate: '',
      ZpaymentPerc: '0.00',
      ZpaymentType: '',
      ZpaymentTypeNo: '',
      Zseqno: '',
      ZtaxAmt: '0.00',
      Remark: '',
    }
    const newIndex = formData.value.ContPaySet.results.filter(
      (d) => d.Operation !== 'D'
    ).length
    formData.value.ContPaySet.results.splice(newIndex, 0, newData)
    resetZseqno()
  }

  // 删除付款条件
  const delPaySet: DelPaySet = (index: number) => {
    if (formData.value.ContPaySet.results.length === 1) {
      ElMessage.warning('付款条件至少保留一条')
      return false
    }
    const currItem = formData.value.ContPaySet.results.splice(index, 1)[0]
    if (currItem.Operation !== 'C') {
      currItem.Operation = 'D'
      formData.value.ContPaySet.results.push(currItem)
    }
    resetZseqno()
  }

  // 尾差调整
  const tailDiffAdjustment: CommonFunc = () => {
    const ContItemSet = formData.value.ContItemSet.results.filter(
      (d) => d.Operation !== 'D'
    )
    const ContPaySet = formData.value.ContPaySet.results.filter(
      (d) => d.Operation !== 'D'
    )
    const ZpaymentPercs = ContPaySet.reduce((prev, curr) => {
      return prev + Number(curr.ZpaymentPerc || 0)
    }, 0)
    if (ZpaymentPercs !== 100 && ContPaySet.length) {
      ElMessage.warning('付款比例总和不等于100，不能执行尾差调整')
      return false
    }
    // 计算行项目的总金额
    const itemSetAmtSum = ContItemSet.reduce((prev, curr) => {
      return prev + Number(curr.ZitemAmtTax || 0) + Number(curr.Zbcje || 0)
    }, 0)
    // 计算付款条件的总金额
    const paySetAmtSum = ContPaySet.reduce((prev, curr) => {
      return prev + Number(curr.ZpaymentAmtTax)
    }, 0)
    if (itemSetAmtSum !== paySetAmtSum) {
      const lastPayItem =
        formData.value.ContPaySet.results[ContPaySet.length - 1]
      const currAmt = Number(lastPayItem.ZpaymentAmtTax || 0)
      const adjustAmt = itemSetAmtSum - (paySetAmtSum - currAmt)
      lastPayItem.ZpaymentAmtTax = adjustAmt.toFixed(2)
      if (lastPayItem.Hguid || lastPayItem.Operation !== 'C') {
        lastPayItem.Operation = 'U'
      }
      if (formData.value.Hguid || formData.value.Operation !== 'C') {
        formData.value.Operation = 'U'
      }
      ElMessage.success('刷新尾差成功')
    } else {
      ElMessage.warning('不存在尾差，无需调整')
    }
  }

  // 反算付款比例
  const calcZpaymentPerc = (itemAmtTax: number, paymentAmtTax: number) => {
    let res = paymentAmtTax / itemAmtTax
    // 转换成百分比格式
    res = res * 100
    return res
  }
  // 反算付款金额（含税）
  const calcZpaymentAmtTax = (itemAmtTax: number, paymentPerc: number) => {
    // 先将百分比格式转换
    paymentPerc = paymentPerc / 100
    const res = itemAmtTax * paymentPerc
    return res
  }

  /**
   * 自动计算比例或者金额
   * @param index 要计算的行index
   * @param percOrAmt 'perc': 自动计算比例 'amt': 自动计算金额
   */
  const autoCalcPercOrAmt: AutoCalcPercOrAmt = (
    index: number,
    percOrAmt: string
  ) => {
    const ContItemSet = formData.value.ContItemSet.results.filter(
      (d) => d.Operation !== 'D'
    )
    const currPaySet = formData.value.ContPaySet.results[index]
    // 付款比例
    const ZpaymentPerc = Number(currPaySet.ZpaymentPerc).toFixed(2)
    // 付款金额（含税）
    const ZpaymentAmtTax = currPaySet.ZpaymentAmtTax
    // 行项目总的签约金额+补充金额（同时满足主合同和补充合同）
    const itemSumAmt = ContItemSet.reduce((prev, curr) => {
      return prev + Number(curr.ZitemAmtTax || 0) + Number(curr.Zbcje || 0)
    }, 0)

    if (percOrAmt === 'perc') {
      if (ZpaymentAmtTax) {
        let perc = calcZpaymentPerc(itemSumAmt, Number(ZpaymentAmtTax))
        if (perc > 100) perc = 100
        currPaySet.ZpaymentPerc = perc.toFixed(2)
      }
    } else {
      if (ZpaymentPerc) {
        if (Number(ZpaymentPerc) > 100) currPaySet.ZpaymentPerc = '100.00'
        currPaySet.ZpaymentAmtTax = calcZpaymentAmtTax(
          itemSumAmt,
          Number(currPaySet.ZpaymentPerc)
        ).toFixed(2)
      }
    }
  }

  // 自动添加进度款逻辑
  const addPaySetByItem: AddPaySetByItem = (
    item: ContItemSet,
    category: string
  ) => {
    // 所有阈值
    const domainList = computed(() => store.domainList)
    // 进度款编码
    const jdkCode = domainList.value.filter(
      (d) =>
        d.Fieldname === 'ZpaymentTypeNo' &&
        d.Field1 === category &&
        d.Text === '进度款'
    )[0].Code
    const showingContPaySet = formData.value.ContPaySet.results.filter(
      (d) => d.Operation !== 'D'
    )
    const currLv = configs.value.find((c) => c.lv === 'H5')
    if (currLv) {
      const currOptions = currLv?.tableColumns?.find(
        (c) => c.prop === 'ZpaymentTypeNo'
      )?.selectOptions
      // 下拉有且只有进度款选项且付款条件数据没有进度款，则允许添加进度款项
      const canAdd =
        currOptions.length === 1 &&
        currOptions.findIndex((o) => o.value === jdkCode) > -1 &&
        showingContPaySet.findIndex((p) => p.ZpaymentTypeNo === jdkCode) === -1
      if (canAdd) {
        const ZpaymentAmtTax =
          Number(item.ZitemAmtTax || 0) + Number(item.Zbcje || 0)
        const newIndex = formData.value.ContPaySet.results.filter(
          (d) => d.Operation !== 'D'
        ).length
        formData.value.ContPaySet.results.splice(newIndex, 0, {
          Zseqno: '',
          Operation: 'C',
          ZpaymentType: '进度款',
          ZpaymentTypeNo: jdkCode,
          ZpaymentPerc: '100.00',
          ZpaymentAmtTax: ZpaymentAmtTax.toFixed(2),
          ZitemNo: '',
          ZdocumentNo: '',
          ZpaymentAmt: '0.00',
          ZpaymentDate: '',
          ZtaxAmt: '0.00',
          Remark: '',
        })
        resetZseqno()
      }
    }
  }

  // 自动更新进度款金额
  const autoCalcProgressAmt: AutoCalcProgressAmt = (category: string) => {
    // 所有阈值
    const domainList = computed(() => store.domainList)
    // 进度款编码
    const progressCode = domainList.value.filter(
      (d) =>
        d.Fieldname === 'ZpaymentTypeNo' &&
        d.Field1 === category &&
        d.Text === '进度款'
    )[0].Code
    const progressPaySet = formData.value.ContPaySet.results.find(
      (d) => d.Operation !== 'D' && d.ZpaymentTypeNo === progressCode
    )
    if (progressPaySet && Number(progressPaySet.ZpaymentPerc || 0) === 100) {
      // 行项目总的签约金额+补充金额（同时满足主合同和补充合同）
      const itemSumAmt = formData.value.ContItemSet.results
        .filter((d) => d.Operation !== 'D')
        .reduce((prev, curr) => {
          return prev + Number(curr.ZitemAmtTax || 0) + Number(curr.Zbcje || 0)
        }, 0)
      progressPaySet.ZpaymentAmtTax = itemSumAmt.toFixed(2)
      if (progressPaySet.Operation !== 'C') progressPaySet.Operation = 'U'
    }
  }

  // 三级分类改变去掉下拉选项没有的款项类型数据
  const delPaySetOnClass3Change: CommonFunc = () => {
    const currLv = configs.value.find((c) => c.lv === 'H5')
    if (currLv) {
      const currOptions = currLv?.tableColumns?.find(
        (c) => c.prop === 'ZpaymentTypeNo'
      )?.selectOptions
      const delItems = formData.value.ContPaySet.results.filter(
        (d) => d.Operation === 'D'
      )
      const noDelItems = formData.value.ContPaySet.results.filter(
        (d) => d.Operation !== 'D'
      )
      for (let i = 0; i < noDelItems.length; i++) {
        const currZpaymentTypeNo = noDelItems[i].ZpaymentTypeNo
        if (
          currOptions.findIndex((o) => o.value === currZpaymentTypeNo) === -1
        ) {
          noDelItems[i].ZpaymentTypeNo = ''
          noDelItems[i].ZpaymentType = ''
        }
      }
      formData.value.ContPaySet.results = [...noDelItems, ...delItems]
      resetZseqno()
    }
  }

  return {
    addPaySet,
    delPaySet,
    autoCalcPercOrAmt,
    tailDiffAdjustment,
    addPaySetByItem,
    autoCalcProgressAmt,
    delPaySetOnClass3Change,
  }
}
