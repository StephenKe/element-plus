//@ts-nocheck
import { cloneDeep } from 'lodash'
import { ElMessage } from '@element-plus/components'
import { commonSearchHelp } from '../requests'
import type { Ref } from 'vue'
import type {
  AddOrDelBankSet,
  CheckCompanyAndAccountName,
  CommonCheckFunc,
  CommonFunc,
  ContBankSet,
  ContractEditData,
  GetKpProvider,
  GetPayerProvider,
  GetSkProvider,
} from '../interface/contractEdit'
import type { Config, CommonType } from '../interface'

export default function useBankSet(
  formData: Ref<ContractEditData>,
  configs: Ref<Config[]>,
  sfjzht: string
) {
  // 新增银行信息
  const addBankSet: AddOrDelBankSet = (index: number) => {
    const newData = cloneDeep(formData.value.ContBankSet.results[index])
    newData.Operation = 'C'
    newData.Hguid = ''
    newData.BankAccount = ''
    newData.Bank = ''
    newData.BankId = ''
    newData.AccountName = ''
    newData.Zzhlx = ''
    newData.ZzhlxTxt = ''
    formData.value.ContBankSet.results.splice(index + 1, 0, newData)
  }
  // 删除银行信息
  const delBankSet: AddOrDelBankSet = (index: number) => {
    const currBankSet = formData.value.ContBankSet.results[index]
    const currZbodyType1 = currBankSet.ZbodyType1
    if (
      formData.value.ContBankSet.results.filter(
        (d) => d.Operation !== 'D' && d.ZbodyType1 === currZbodyType1
      ).length === 1
    ) {
      ElMessage.warning('必须最少保留一条')
      return false
    }
    const currItem = formData.value.ContBankSet.results.splice(index, 1)[0]
    if (currItem.Operation !== 'C') {
      currItem.Operation = 'D'
      formData.value.ContBankSet.results.push(currItem)
    }
  }
  // 校验收款方的账户类别是否重复
  const checkZzhlxIsUnique: CommonCheckFunc = () => {
    const bankSet = formData.value.ContBankSet.results.filter(
      (d) => d.Operation !== 'D' && d.ZbodyType1 === '510'
    )
    const newArr = bankSet.map((d) => d.Zzhlx)
    const newSet = new Set(newArr)
    return newSet.size === newArr.length
  }
  // 选中银行信息后赋值相关字段
  const setBankInfo = (data: CommonType, index: number, isSfjzht?: boolean) => {
    const bankSet = formData.value.ContBankSet.results[index]
    bankSet.BankAccount = data.ZYYZH
    bankSet.Bank = data.BANK
    bankSet.BankId = data.BANK_ID
    bankSet.AccountName = data.ACCOUNT_NAME
    bankSet.Zzhlx = ''
    bankSet.ZzhlxTxt = ''
    if (bankSet.ZbodyType1 === '500') {
      if (!isSfjzht) {
        bankSet.AccountName = bankSet.Provider
      }
    } else if (bankSet.ZbodyType1 === '510') {
      bankSet.Zzhlx = data.ZZHLX
      bankSet.ZzhlxTxt = data.ACCOUNT_TYPE
    } else {
      if (isSfjzht) {
        bankSet.AccountName = bankSet.Provider
      }
    }
    if (bankSet.Operation !== 'C') {
      bankSet.Operation = 'U'
    }
  }
  // 根据赋值的单位名称，查询是否只有一个银行账号
  const checkBankAccount = async (index) => {
    const currBankSet = formData.value.ContBankSet.results[index]
    const companyCode = currBankSet.ProviderNo
    let f4field = 'H1BankAccount'
    if (currBankSet.ZbodyType1 === '500') {
      f4field =
        formData.value.ZconClassNo2 !== sfjzht
          ? 'H1BankAccount'
          : 'NH1BankAccount'
    } else if (currBankSet.ZbodyType1 === '510') {
      f4field = 'NH1BankAccount'
    } else {
      f4field =
        formData.value.ZconClassNo2 === sfjzht
          ? 'H1BankAccount'
          : 'NH1BankAccount'
    }
    const conditions: CommonType[] = [{ NODEID: companyCode }]
    const params = {
      F4field: f4field,
      conditions,
    }
    const res = await commonSearchHelp(params)
    const result = res.d?.results || []
    const FIELDDATA = JSON.parse(result[0]?.Result || '{}')?.FIELDDATA || []
    return FIELDDATA
  }
  // 根据选中的单位名称设置相关数据
  const setBankSetProviderInfo = (index: number, value: string) => {
    const currBankSet = formData.value.ContBankSet.results[index]
    const selectOptions =
      configs.value
        .find((d) => d.lv === 'HA')
        ?.tableColumns?.find((d) => d.prop === 'Provider')?.selectOptions || []
    const currConfigOptions =
      selectOptions[index]?.find((d) => d.value === value) || {}
    currBankSet.ProviderNo = currConfigOptions.providerNo
    // 修改了单位信息，清空银行账号相关信息
    currBankSet.BankAccount = ''
    currBankSet.AccountName = ''
    currBankSet.Bank = ''
    currBankSet.BankId = ''
    // 如果当前是收款方，则执行下面逻辑
    if (currBankSet.ZbodyType1 === '510') {
      // 勾选了【是否委托开票】的签约主体
      const kpParty = formData.value.ContPartySet.results
        .filter((d) => d.Operation !== 'D')
        .find((d) => d.ZisKp)
      formData.value.ContBankSet.results.forEach((d) => {
        if (d.Operation !== 'D') {
          // 所有收款方的单位要保持一致，没有勾选委托开票则开票方直接取收款方信息
          if (d.ZbodyType1 === '510' || (d.ZbodyType1 === '520' && !kpParty)) {
            d.Provider = value
            d.ProviderNo = currConfigOptions.providerNo
            // 修改了单位信息，清空银行账号相关信息
            d.BankAccount = ''
            d.AccountName = ''
            d.Bank = ''
            d.BankId = ''
            d.Zzhlx = ''
            d.ZzhlxTxt = ''
          }
        }
      })
    }

    // const bankAccount = await checkBankAccount(index)
    // if (bankAccount.length === 1) {
    //   setBankInfo(bankAccount[0], index, formData.value.ZconClassNo2 === sfjzht)
    // }
  }
  /**
   * 获取付款方单位信息并赋值
   * @param isSfjzht 是否三方甲指合同，默认值为否
   */
  const getPayerProvider: GetPayerProvider = (isSfjzht?: boolean) => {
    // 一般合同默认付款方为甲方（50是投策类的 '是否我方' 为 '是'）
    let party = formData.value.ContPartySet.results.find((d) =>
      ['10', '50'].includes(d.ZbodyType)
    )
    // 三方甲指合同默认付款方为丙方
    if (isSfjzht) {
      party = formData.value.ContPartySet.results.find((d) =>
        ['30'].includes(d.ZbodyType)
      )
    }
    const payer = formData.value.ContBankSet.results.find(
      (d) => d.ZbodyType1 === '500'
    )
    if (party && payer) {
      if (!party.ZisPayer) {
        payer.Provider = party.Provider
        payer.ProviderNo = party.ProviderNo
      } else {
        payer.Provider = party.ProviderWt || ''
        payer.ProviderNo = party.ProviderNoWt || ''
      }
      payer.BankAccount = ''
      payer.AccountName = ''
      payer.Bank = ''
      payer.BankId = ''
      payer.Zzhlx = ''
      payer.ZzhlxTxt = ''

      if (payer.Hguid || payer.Operation !== 'C') {
        payer.Operation = 'U'
      }
    }
  }
  // 获取收款方单位信息并赋值（签订多方是下拉选择，所以清空单位信息）
  const getSkProvider: GetSkProvider = () => {
    // 是否签订多方
    const sfqddf =
      formData.value.ContPartySet.results.filter((d) => d.Operation !== 'D')
        .length > 2
    // 乙方签约主体数据
    const party = formData.value.ContPartySet.results.find((d) =>
      ['20'].includes(d.ZbodyType)
    )
    // 勾选了【是否委托收款】的签约主体
    const skParty = formData.value.ContPartySet.results
      .filter((d) => d.Operation !== 'D')
      .find((d) => d.ZisSk)
    formData.value.ContBankSet.results.forEach((d) => {
      if (d.Operation !== 'D' && d.ZbodyType1 === '510') {
        if (!sfqddf) {
          if (party) {
            if (!party.ZisSk) {
              d.Provider = party.Provider
              d.ProviderNo = party.ProviderNo
            } else {
              d.Provider = party.ProviderWt || ''
              d.ProviderNo = party.ProviderNoWt || ''
            }
          }
        } else {
          if (skParty) {
            d.Provider = skParty.ProviderWt || ''
            d.ProviderNo = skParty.ProviderNoWt || ''
          } else {
            d.Provider = ''
            d.ProviderNo = ''
          }
        }
        d.BankAccount = ''
        d.AccountName = ''
        d.Bank = ''
        d.BankId = ''
        d.Zzhlx = ''
        d.ZzhlxTxt = ''
        if (d.Hguid || d.Operation !== 'C') {
          d.Operation = 'U'
        }
      }
    })
  }
  // 获取开票方单位信息并赋值
  const getKpProvider: GetKpProvider = (isSfjzht?: boolean) => {
    const sk = formData.value.ContBankSet.results.find(
      (d) => d.ZbodyType1 === '510'
    )
    const kp = formData.value.ContBankSet.results.find(
      (d) => d.ZbodyType1 === '520'
    )
    // 勾选了【是否委托收款】的签约主体
    const skParty = formData.value.ContPartySet.results
      .filter((d) => d.Operation !== 'D')
      .find((d) => d.ZisSk)
    // 勾选了【是否委托开票】的签约主体
    const kpParty = formData.value.ContPartySet.results
      .filter((d) => d.Operation !== 'D')
      .find((d) => d.ZisKp)
    // 甲方
    const party1 = formData.value.ContPartySet.results.find((d) =>
      ['10', '50'].includes(d.ZbodyType)
    )
    if (kp && party1) {
      if (isSfjzht) {
        // 三方甲指合同：默认甲方为开票方
        if (!party1.ZisKp) {
          kp.Provider = party1.Provider
          kp.ProviderNo = party1.ProviderNo
        } else {
          kp.Provider = party1.ProviderWt || ''
          kp.ProviderNo = party1.ProviderNoWt || ''
        }
      } else {
        // 有委托开票取受委托开票单位，没有委托开票有委托收款取委托收款的单位，都没有则取收款方单位信息
        if (kpParty) {
          kp.Provider = kpParty.ProviderWt || ''
          kp.ProviderNo = kpParty.ProviderNoWt || ''
        } else if (skParty) {
          kp.Provider = skParty.Provider || ''
          kp.ProviderNo = skParty.ProviderNo || ''
        } else {
          kp.Provider = sk?.Provider || ''
          kp.ProviderNo = sk?.ProviderNo || ''
        }
      }
      kp.BankAccount = ''
      kp.AccountName = ''
      kp.Bank = ''
      kp.BankId = ''
      kp.Zzhlx = ''
      kp.ZzhlxTxt = ''
      if (kp.Hguid || kp.Operation !== 'C') {
        kp.Operation = 'U'
      }
    }
  }
  // 根据生成的下拉选项清理数据
  const clearBankDataByOptions: CommonFunc = () => {
    const providerOptions =
      configs.value
        .find((c) => c.lv === 'HA')
        ?.tableColumns?.find((c) => c.prop === 'Provider')?.selectOptions || []
    formData.value.ContBankSet.results.forEach((d, idx) => {
      if (!providerOptions[idx]?.find((o) => o.value === d.Provider)) {
        d.ProviderNo = ''
        d.Provider = ''
        d.BankAccount = ''
        d.AccountName = ''
        d.Bank = ''
        d.BankId = ''
        d.Zzhlx = ''
        d.ZzhlxTxt = ''
      }
    })
  }
  // 根据非甲方公司名和账户名，弹出提示
  const checkCompanyAndAccountName: CheckCompanyAndAccountName = (
    row: ContBankSet
  ) => {
    const party = formData.value.ContPartySet.results.find(
      (d) =>
        d.ProviderNo === row.ProviderNo || d.ProviderNoWt === row.ProviderNo
    )
    const companyName = row.Provider
    const accountName = row.AccountName
    if (party) {
      const ZZXZFL =
        (party.ZisKp || party.ZisSk ? party.ZzxzflWt : party.ZZXZFL) || ''
      if (companyName !== accountName && ['20', '10'].includes(ZZXZFL)) {
        ElMessage.warning(
          `签约主体 ${companyName}，收款单位与银行账户名不一致，请确认`
        )
      }
    }
  }

  return {
    addBankSet,
    delBankSet,
    setBankSetProviderInfo,
    setBankInfo,
    getPayerProvider,
    getSkProvider,
    getKpProvider,
    clearBankDataByOptions,
    checkCompanyAndAccountName,
    checkZzhlxIsUnique,
  }
}
