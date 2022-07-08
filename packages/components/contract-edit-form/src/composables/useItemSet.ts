//@ts-nocheck
import { computed } from 'vue'
import type { Ref } from 'vue'
import type { ContractStore } from '../interface'
import type {
  CommonFunc,
  ContItemBudgetSet,
  ContItemSet,
  ContractEditData,
} from '../interface/contractEdit'

export default function useItemSet(
  formData: Ref<ContractEditData>,
  ZdocumentType: string,
  Zsamt: Ref<number>,
  store: ContractStore
) {
  // 更新行项目数据
  const setContItemSet: CommonFunc = () => {
    // 所有的合同分类（包含一二三级分类）
    const classList = computed(() => store.classList)
    const ZconClassNo3 = formData.value.ZconClassNo3 || []
    const currItems = formData.value.ContItemSet.results
    const newItems: ContItemSet[] = []
    ;(ZconClassNo3 as string[]).forEach((d, index) => {
      let ZitemNo = ((index + 1) * 10).toString()
      if (ZitemNo.length < 3) ZitemNo = `0${ZitemNo}`
      const oldItemIndex = currItems.findIndex((c) => c.ZconClassNo3 === d)
      if (oldItemIndex !== -1) {
        const oldItem = currItems.splice(oldItemIndex, 1)[0]
        newItems.push({
          ...oldItem,
          ZitemNo,
          Operation: oldItem.Hguid ? 'U' : 'C',
        })
      } else {
        const currClass = classList.value.find((c) => c.ZconClassNo === d)
        const class3Txt = currClass?.ZconClass || ''
        newItems.push({
          ZitemNo,
          ZconClassNo3: d,
          ZconClass3: class3Txt,
          Zywhdbm: currClass?.Zywhdbm || '',
          Zywhdms: currClass?.Zywhdms || '',
          ZitemAmtTax: '0.00',
          ZitemAmt: '0.00',
          Operation: 'C',
          Hguid: '',
          Uprice: '0.00',
          Menge: '0.00',
          ZtaxAmt: '0.00',
        })
      }
    })

    for (const item of currItems) {
      if (item.Hguid) {
        newItems.push({
          ...item,
          Operation: 'D',
        })
      }
    }

    formData.value.ContItemSet.results = newItems
  }
  /**
   * 计算税额或不含税金额方法
   * @param amount 含税金额
   * @param ZtaxRateNo 税率
   * @param taxOrAmt tax：计算税额 amt：计算不含税金额
   */
  const calcZitemAmt = (
    amount: number,
    ZtaxRateNo: string,
    taxOrAmt: string
  ) => {
    // 转换逻辑（’10%‘ -> ’0.1‘）
    const taxRateStr = ZtaxRateNo.substring(0, ZtaxRateNo.length - 1)
    const taxRate = Number(taxRateStr) / 100

    let res = 0
    // 计算税额
    if (taxOrAmt === 'tax') res = (amount / (1 + taxRate)) * taxRate
    // 计算不含税金额
    if (taxOrAmt === 'amt') res = amount / (1 + taxRate)

    return res
  }
  // 自动计算行项目信息的金额和税额
  const calcAmtAndTax: CommonFunc = () => {
    const domainList = computed(() => store.domainList)
    // 补充金额（不含税）总计
    let bcjeWithoutTax = 0
    // 获取税率的下拉选项
    const taxRateOptions = domainList.value.filter(
      (d) => d.Fieldname === 'ZtaxRateNo'
    )
    formData.value.ContItemSet?.results.forEach((d) => {
      const itemMenge = d.Menge
      const itemUprice = d.Uprice
      // 数量*单价=签约金额
      if (Number(itemMenge) && Number(itemUprice)) {
        if (['10', '30'].includes(ZdocumentType)) {
          d.ZitemAmtTax = (Number(itemMenge) * Number(itemUprice)).toFixed(2)
        }
      }
      // 签约金额+补充金额
      const itemAmtTax = Number(d.ZitemAmtTax || 0) + Number(d.Zbcje || 0)
      if (['20', '40'].includes(ZdocumentType)) {
        // 累计金额
        d.ZnitemAmtTax = itemAmtTax.toFixed(2)
      }
      // 税率有值才能自动计算
      if (d.ZtaxRateNo) {
        const taxText =
          taxRateOptions.find((o) => o.Code === d.ZtaxRateNo)?.Text || ''
        // 补充金额（不含税）
        const itemBcjeWithoutTax = calcZitemAmt(
          Number(d.Zbcje || 0),
          taxText,
          'amt'
        ).toFixed(2)
        bcjeWithoutTax += Number(itemBcjeWithoutTax)
        // 签约金额（不含税）
        d.ZitemAmt = calcZitemAmt(itemAmtTax, taxText, 'amt').toFixed(2)
        // 税额
        d.ZtaxAmt = calcZitemAmt(itemAmtTax, taxText, 'tax').toFixed(2)
        // 补充合同
        if (['20', '40'].includes(ZdocumentType)) {
          // 累计金额（不含税）
          d.ZnitemAmt = calcZitemAmt(itemAmtTax, taxText, 'amt').toFixed(2)
          // 补充金额（不含税）
          d.ZbcjeAmt = calcZitemAmt(
            Number(d.Zbcje || 0),
            taxText,
            'amt'
          ).toFixed(2)
          // 补充金额税额
          d.ZbcjeTaxamt = calcZitemAmt(
            Number(d.Zbcje || 0),
            taxText,
            'tax'
          ).toFixed(2)
        }
      }
    })
    // 补充金额不含税因为没有在界面显示，所以不能在合计方法算，只能在这里算
    if (bcjeWithoutTax) Zsamt.value = bcjeWithoutTax
  }
  // 将费用预算的数据放到每一个行项目信息里面ContItemBudgetSet
  const formatContItemBudgetSet = (budgetData: ContItemBudgetSet[]) => {
    if (budgetData.length) {
      formData.value.ContItemSet.results.forEach((d) => {
        const currZconClassNo3 = d.ZconClassNo3
        const currBudgets = budgetData.filter(
          (b) => b.ZconClassNo3 === currZconClassNo3
        )
        d.ContItemBudgetSet = {
          results: [...currBudgets],
        }
        if (!['C', 'D'].includes(d.Operation)) {
          d.Operation = 'U'
        }
      })
    }
  }

  return {
    setContItemSet,
    calcAmtAndTax,
    formatContItemBudgetSet,
  }
}
