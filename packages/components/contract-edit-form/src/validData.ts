import type { Config } from './interface'
import type { ContractEditData } from './interface/contractEdit'

export default function validData(data: ContractEditData, configs: Config[]) {
  let valid = true
  let msg = ''
  const ZdocumentType = data.ZdocumentType
  const isWtyw = data.ZifWtyw
  const ContPartySet = (data.ContPartySet?.results || []).filter(
    (d) => d.Operation !== 'D'
  )
  const ContPaySet = (data.ContPaySet?.results || []).filter(
    (d) => d.Operation !== 'D'
  )
  const ContItemSet = (data.ContItemSet?.results || []).filter(
    (d) => d.Operation !== 'D'
  )
  if (valid && ContPartySet.length) {
    let allZzgbl = 0
    let allZqybl = 0
    ContPartySet.forEach((d) => {
      allZzgbl += Number(d.Zzgbl || 0)
      allZqybl += Number(d.Zqybl || 0)
    })
    if (allZzgbl > 100) {
      valid = false
      msg = '合作方与我方股权占比总和不能超过100%'
    } else if (allZqybl > 100) {
      valid = false
      msg = '合作方与我方权益占比总和不能超过100%'
    }

    for (const item of ContPartySet) {
      if (item.ZisPayer && !item.ProviderNoWt) {
        valid = false
        msg = '签约主体已勾选“是否委托付款”，请选择“受委托单位”！'
        break
      }
      if (item.ZisSk && !item.ProviderNoWt) {
        valid = false
        msg = '签约主体已勾选“是否委托收款”，请选择“受委托单位”！'
        break
      }
    }

    if (
      isWtyw &&
      ContPartySet.findIndex((d) => d.ZisPayer || d.ZisSk || d.ZisKp) === -1
    ) {
      valid = false
      msg = '勾选了“是否存在委托业务”，签约主体最少要存在一条委托业务！'
    }
  }
  if (valid && ContItemSet.length) {
    const hasMenge = configs
      .find((c) => c.lv === 'H3')
      ?.tableColumns?.find((c) => c.prop === 'Menge' && !c.hidden)
    const hasUprice = configs
      .find((c) => c.lv === 'H3')
      ?.tableColumns?.find((c) => c.prop === 'Uprice' && !c.hidden)
    for (const item of ContItemSet) {
      // 行项目编码
      const currZitemNo = item.ZitemNo

      if (hasMenge && hasUprice && ['10', '30'].includes(ZdocumentType)) {
        if (
          Number(item.ZitemAmtTax || 0).toFixed(2) !==
          (Number(item.Menge || 0) * Number(item.Uprice || 0)).toFixed(2)
        ) {
          valid = false
          msg = `行项目“${currZitemNo}”的数量乘以单价不等于签约金额，请检查`
          break
        }
      }

      // 行项目明细信息
      const itemBudgetSet = (item.ContItemBudgetSet?.results || []).filter(
        (d) => d.Operation !== 'D'
      )
      if (itemBudgetSet.length) {
        const amountSum = itemBudgetSet.reduce((prev, curr) => {
          return prev + Number(curr.Amount || 0)
        }, 0)
        // 校验行项目明细信息金额总和是否超过对应行项目金额
        if (amountSum > Number(item.ZitemAmtTax || 0)) {
          valid = false
          msg = `行项目“${currZitemNo}”的预算明细信息金额总和不能超过该行项目的签约金额，请检查`
          break
        }
        if (['20', '40'].includes(ZdocumentType)) {
          const bcjeSum = itemBudgetSet.reduce((prev, curr) => {
            return prev + Number(curr.Zbcje || 0)
          }, 0)
          // 校验行项目明细信息补充金额总和是否超过对应行项目补充金额
          if (bcjeSum > Number(item.Zbcje || 0)) {
            valid = false
            msg = `行项目“${currZitemNo}”的预算明细信息补充金额总和不能超过该行项目的补充金额，请检查`
            break
          }
        }
      }
    }
  }
  if (valid && ContPaySet.length) {
    const ZpaymentPercs = ContPaySet.reduce((prev, curr) => {
      return prev + Number(curr.ZpaymentPerc || 0)
    }, 0)
    // 校验付款条件的付款比例
    if (ZpaymentPercs !== 100) {
      valid = false
      msg = '付款条件所有数据的付款比例总和不等于100，请检查'
    }
    // 行项目总的签约金额+补充金额（同时满足主合同和补充合同）
    const itemSumAmt = ContItemSet.reduce((prev, curr) => {
      return prev + Number(curr.ZitemAmtTax || 0) + Number(curr.Zbcje || 0)
    }, 0)
    const ZpaymentAmtTaxs = ContPaySet.reduce((prev, curr) => {
      return prev + Number(curr.ZpaymentAmtTax || 0)
    }, 0)
    // 校验付款条件的付款金额（含税）
    if (itemSumAmt.toFixed(2) !== ZpaymentAmtTaxs.toFixed(2)) {
      valid = false
      msg =
        '付款条件的付款金额（含税）总和不等于所有行项目的签约金额总和，请检查'
      if (['20', '40'].includes(ZdocumentType)) {
        msg =
          '付款条件的付款金额（含税）总和不等于所有行项目的累计金额总和，请检查'
      }
    }
  }

  return {
    valid,
    msg,
  }
}
