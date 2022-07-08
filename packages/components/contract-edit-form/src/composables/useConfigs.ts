//@ts-nocheck
import { computed } from 'vue'
import { arrDistinctByProp } from '../utils'
import { getContractFormConfigs, getContractReasonEditable } from '../requests'
import type {
  CommonFunc,
  ContractEditData,
  GetConfigs,
} from '../interface/contractEdit'
import type { Ref } from 'vue'
import type {
  ContConfig,
  Config,
  DomainData,
  TableColumn,
  Field,
  SelectOption,
  CommonType,
  ContractStore,
  ContractConfigParams,
  ClassData,
} from '../interface'

export default function useConfigs(
  configs: Ref<Config[]>,
  rules: Ref<CommonType>,
  pageType: string,
  ZdocumentType: string,
  formData: Ref<ContractEditData>,
  store: ContractStore,
  Ztype?: string,
  classNo3Cache?: Ref<string[]>,
  sfjzht?: string
) {
  // 设置 银行信息-单位名称 下拉选项
  const getBankSetProviderOptions = () => {
    const ZifWtyw = formData.value.ZifWtyw
    const classNo2 = formData.value.ZconClassNo2
    const partySet = formData.value.ContPartySet.results?.filter(
      (d) => d.Operation !== 'D'
    )
    const bankSet = formData.value.ContBankSet.results?.filter(
      (d) => d.Operation !== 'D'
    )
    const newSelectOptions: SelectOption[][] = []
    bankSet.forEach((item, idx) => {
      newSelectOptions.push([])
      if (item.ZbodyType1 === '500') {
        // 付款方逻辑
        // 三方甲指合同：默认丙方为付款方
        const party =
          classNo2 === sfjzht
            ? partySet.find((d) => ['30'].includes(d.ZbodyType))
            : partySet.find((d) => ['10', '50'].includes(d.ZbodyType))
        if (ZifWtyw && party?.ZisPayer) {
          newSelectOptions[idx].push({
            label: party.ProviderWt || '',
            value: party.ProviderWt,
            providerNo: party.ProviderNoWt,
          })
        } else {
          newSelectOptions[idx].push({
            label: party?.Provider || '',
            value: party?.Provider,
            providerNo: party?.ProviderNo,
          })
        }
      } else if (item.ZbodyType1 === '510') {
        // 收款方逻辑
        const isSk = partySet.find((d) => d.ZisSk)
        if (ZifWtyw && isSk) {
          newSelectOptions[idx].push({
            label: isSk.ProviderWt || '',
            value: isSk.ProviderWt,
            providerNo: isSk.ProviderNoWt,
          })
        } else {
          partySet
            .filter((d) => !['10', '50'].includes(d.ZbodyType))
            .forEach((d) => {
              // 三方甲指合同：默认收款方为乙方，故只取乙方数据作下拉选项
              if (
                (classNo2 === sfjzht && d.ZbodyType === '20') ||
                classNo2 !== sfjzht
              ) {
                newSelectOptions[idx].push({
                  label: d.Provider,
                  value: d.Provider,
                  providerNo: d.ProviderNo,
                })
              }
            })
        }
      } else {
        // 开票方逻辑
        // 收款方
        const sk = bankSet.find((d) => d.ZbodyType1 === '510')
        // 收款方下拉没有收款方数据时，先清理掉收款方的数据
        const skIndex = bankSet.findIndex((d) => d.ZbodyType1 === '510')
        const skOptions = newSelectOptions[skIndex]
        if (sk && !skOptions.find((o) => o.value === sk?.Provider)) {
          sk.Provider = ''
          sk.ProviderNo = ''
        }
        // 勾选了【是否委托收款】的签约主体
        const skParty = partySet.find((d) => d.ZisSk)
        // 勾选了【是否委托开票】的签约主体
        const kpParty = partySet.find((d) => d.ZisKp)
        // 甲方
        const party1 = partySet.find((d) => ['10', '50'].includes(d.ZbodyType))
        if (classNo2 === sfjzht) {
          // 三方甲指合同：默认甲方为开票方
          if (ZifWtyw && party1 && party1.ZisKp) {
            newSelectOptions[idx].push({
              label: party1.ProviderWt || '',
              value: party1.ProviderWt,
              providerNo: party1.ProviderNoWt,
            })
          } else {
            newSelectOptions[idx].push({
              label: party1?.Provider || '',
              value: party1?.Provider,
              providerNo: party1?.ProviderNo,
            })
          }
        } else {
          if (ZifWtyw && kpParty) {
            newSelectOptions[idx].push({
              label: kpParty.ProviderWt || '',
              value: kpParty.ProviderWt,
              providerNo: kpParty.ProviderNoWt,
            })
          } else if (ZifWtyw && skParty) {
            newSelectOptions[idx].push({
              label: skParty.Provider,
              value: skParty.Provider,
              providerNo: skParty.ProviderNo,
            })
          } else {
            newSelectOptions[idx].push({
              label: sk?.Provider || '',
              value: sk?.Provider,
              providerNo: sk?.ProviderNo,
            })
          }
        }
      }
    })

    return newSelectOptions
  }
  // 储存后端返回的配置信息
  let configsRes: ContConfig[] = []
  // 生成字段校验规则
  const getRule = (r: ContConfig) => {
    const trigger = r.Zcxfs === '10' ? 'blur' : 'change'
    let message = `请输入${r.ZdmDec}`
    if (['20', '30', '50'].includes(r.Zcxfs)) {
      message = `请选择${r.ZdmDec}`
    }
    const required = r.ZisReq
    const rule: any = {
      [r.Zdm]: [
        {
          required,
          message,
          trigger,
        },
      ],
    }
    // 金额字段正则
    if (
      ['Uprice', 'ZitemAmtTax', 'ZtaxAmt', 'ZpaymentAmtTax'].includes(r.Zdm)
    ) {
      rule[r.Zdm].push({
        validator: (rule, value, callback) => {
          if (
            value &&
            !/^(([0-9]|([1-9][0-9]{0,16}))((\.[0-9]{1,2})?))$/.test(value)
          ) {
            callback(new Error('格式不正确或金额过长'))
          } else {
            callback()
          }
        },
        trigger,
      })
    }
    // 补充金额允许负数
    if (['Zbcje'].includes(r.Zdm)) {
      rule[r.Zdm].push({
        validator: (rule, value, callback) => {
          if (
            value &&
            !/^(-?)(([0-9]|([1-9][0-9]{0,16}))((\.[0-9]{1,2})?))$/.test(value)
          ) {
            callback(new Error('格式不正确或金额过长'))
          } else {
            callback()
          }
        },
        trigger,
      })
    }
    // 电话号码正则（支持400开头的10位号码，11位手机号码，3-4位区号，7-8位号码，1-4位分机号）
    if (['Zjflxdh', 'Zyflxdh'].includes(r.Zdm)) {
      rule[r.Zdm].push({
        validator: (rule, value, callback) => {
          if (
            value &&
            !/^((\d{10,11})|((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})))$/.test(
              value
            )
          ) {
            callback(new Error('格式不正确'))
          } else {
            callback()
          }
        },
        trigger,
      })
    }
    // 手机号码正则
    if (['ZsignUserPhone'].includes(r.Zdm)) {
      rule[r.Zdm].push({
        validator: (rule, value, callback) => {
          if (
            value &&
            !/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
              value
            )
          ) {
            callback(new Error('格式不正确'))
          } else {
            callback()
          }
        },
        trigger,
      })
    }
    // 限制只能输入1-100以内数字（包含两位小数）
    if (['ZpaymentPerc'].includes(r.Zdm)) {
      rule[r.Zdm].push({
        validator: (rule, value, callback) => {
          if (
            value &&
            !/^100(\.[0]{1,2})?$|^(([1-9][0-9])|([1-9]))(\.\d{1,2})?$/.test(
              value
            )
          ) {
            callback(new Error('格式不正确'))
          } else {
            callback()
          }
        },
        trigger,
      })
    }
    // 限制只能输入0-100以内数字（包含两位小数）
    if (['Zzgbl', 'Zqybl'].includes(r.Zdm)) {
      rule[r.Zdm].push({
        validator: (rule, value, callback) => {
          if (
            value &&
            !/^100(\.[0]{1,2})?$|^(0|\d{1,2})(\.\d{1,2})?$/.test(value)
          ) {
            callback(new Error('格式不正确'))
          } else {
            callback()
          }
        },
        trigger,
      })
    }
    // 正数（允许1~2位小数）
    if (['Menge'].includes(r.Zdm)) {
      rule[r.Zdm].push({
        validator: (rule, value, callback) => {
          if (value && !/^\d+(\.\d{1,2})?$/.test(value)) {
            callback(new Error('格式不正确'))
          } else {
            callback()
          }
        },
        trigger,
      })
    }
    // 限制只能输入>0的整数
    if (['ZsignNumber', 'FileCount', 'SignCount'].includes(r.Zdm)) {
      rule[r.Zdm].push({
        validator: (rule, value, callback) => {
          if (value && !/^[1-9]\d*$/.test(value)) {
            callback(new Error('格式不正确'))
          } else {
            callback()
          }
        },
        trigger,
      })
    }
    // 限制合同名称的长度为200
    if (['ZconName'].includes(r.Zdm)) {
      rule[r.Zdm].push({
        validator: (rule, value, callback) => {
          if (value.length > 200) {
            callback(new Error('名称长度不能超过200'))
          } else {
            callback()
          }
        },
        trigger,
      })
    }
    return rule
  }
  // 生成字段配置
  const getField = (r: ContConfig) => {
    let disabled = !r.ZisDisplay
    if (pageType === 'edit') {
      // 编辑页面，一级分类和二级分类不可编辑
      if (['ZconClassNo1', 'ZconClassNo2'].includes(r.Zdm)) disabled = true
    }
    const placeholder = ['20', '30', '40', '50'].includes(r.Zcxfs)
      ? '请选择'
      : '请输入'
    const selectMultiple = !![
      'ZsReasonNo',
      'ZconClassNo3',
      'Zterritory',
    ].includes(r.Zdm)
    const field: Field = {
      field: r.Zdm,
      fieldName: r.ZdmDec,
      placeholder: disabled ? '' : placeholder,
      inputType: r.Zcxfs,
      disabled,
      selectMultiple,
      maxlength: r.Zlength || r.Zlength === 0 ? r.Zlength : undefined,
    }
    if (
      ['Remark', 'ZnotTemplateRemark', 'Synr', 'Jklvtj', 'Lshttk'].includes(
        r.Zdm
      )
    ) {
      field.maxlength = 200
    }
    const domainList = computed(() => store.domainList)
    if (r.Zcxfs === '20') {
      let selectOptions
      // 所有的合同分类（包含一二三级分类）
      const classList = computed(() => store.classList)
      if (r.Zdm === 'ZsReasonNo') {
        // 【补充合同原因】下拉选项
        const reasonNoOptions = computed(() => {
          const conClassNo3 = formData.value.ZconClassNo3 || []
          let reasonNoList: any[] = []
          ;(conClassNo3 as string[]).forEach((d) => {
            const contractClass = classList.value.find(
              (c) => c.ZconClassNo === d
            )
            const currReasonNos = contractClass?.ContractBchtSet?.results || []
            reasonNoList.push(...currReasonNos)
          })
          // 去重
          reasonNoList = arrDistinctByProp(reasonNoList, 'ZsReasonNo')
          return reasonNoList.map((d) => {
            return {
              label: d.ZsReason,
              value: d.ZsReasonNo,
            }
          })
        })
        selectOptions = [...reasonNoOptions.value]
      } else if (r.Zdm === 'ZtaxTypeNo') {
        // 【印花税科目】下拉选项
        const stampTaxOptions = computed(() => {
          const conClassNo3 = formData.value.ZconClassNo3 || []
          const options = (conClassNo3 as string[]).map((d) => {
            const contractClass: ClassData = classList.value.find(
              (c) => c.ZconClassNo === d
            ) as ClassData
            return {
              label: contractClass.ZtaxType,
              value: contractClass.ZtaxTypeNo,
            }
          })
          return arrDistinctByProp(options, 'value')
        })
        selectOptions = [...stampTaxOptions.value]
      } else if (r.Zdm === 'ZconClassNo1') {
        // 【合同一级分类】下拉选项
        const ZconCategoryNo = formData.value.ZconCategoryNo
        const ZconClass1List = computed(() =>
          classList.value.filter(
            (c) => c.Zlevel === '1' && c.ZconCategoryNo === ZconCategoryNo
          )
        )
        selectOptions = ZconClass1List.value.map((d) => {
          return {
            label: d.ZconClass,
            value: d.ZconClassNo,
          }
        })
      } else if (r.Zdm === 'ZconClassNo2') {
        // 【合同二级分类】下拉选项
        const ZconClass2List = computed(() => {
          const class1 = formData.value.ZconClassNo1
          return class1
            ? classList.value.filter((c) => c.ZpconClassNo === class1)
            : []
        })
        selectOptions = ZconClass2List.value.map((d) => {
          return {
            label: d.ZconClass,
            value: d.ZconClassNo,
          }
        })
      } else if (r.Zdm === 'ZconClassNo3') {
        // 【合同三级分类】下拉选项
        const ZconClass3List = computed(() => {
          const class2 = formData.value.ZconClassNo2
          return class2
            ? classList.value.filter((c) => c.ZpconClassNo === class2)
            : []
        })
        selectOptions = ZconClass3List.value.map((d) => {
          let optionDisabled = false
          // 补充合同时，三级分类只能新增不能减少，所以原来的值要变成disabled
          if (['20', '40'].includes(ZdocumentType)) {
            if (classNo3Cache?.value.includes(d.ZconClassNo)) {
              optionDisabled = true
            }
          }
          return {
            label: d.ZconClass,
            value: d.ZconClassNo,
            disabled: optionDisabled,
            title: d.Zremark,
          }
        })
      } else {
        const optionsList = domainList.value.filter((d) => {
          if (
            r.Zdm === 'Zdinvoicetype' &&
            formData.value.ZconCategoryNo === '10'
          ) {
            // 成本类合同过滤发票类型S C
            return d.Fieldname === r.Zdm && (d.Code === 'S' || d.Code === 'C')
          }
          return d.Fieldname === r.Zdm
        })
        selectOptions = optionsList.map((o) => {
          return {
            label: o.Text,
            value: o.Code,
          }
        })
      }

      Object.assign(field, { selectOptions })
    }

    // '不使用模板原因'只有在选中'不使用模板'时，才显示
    if (r.Zdm === 'ZnotTemplateRemark') {
      if (formData.value.ZisTemplate !== '20') {
        Object.assign(field, { hidden: true })
      }
    }
    // '适用项目'只有在'是否适用多个项目'为'是'，才显示
    if (r.Zdm === 'Syxm') {
      if (formData.value.Sfsydgxm !== 'Y') {
        Object.assign(field, { hidden: true })
      }
    }
    // '突破类型'只有在'是否突破合作项目资金管理要求'为'是'，才显示
    if (r.Zdm === 'Tpzjglyqlx') {
      if (formData.value.Sftphzxmzjglyq !== 'Y') {
        Object.assign(field, { hidden: true })
      }
    }
    // '借款类型'只有在'是否合作方借款'为'是'，才显示
    if (r.Zdm === 'Jklx') {
      if (formData.value.Sfsjghzfjk !== 'Y') {
        Object.assign(field, { hidden: true })
      }
    }
    // '借款金额' '借款利率' '借款期限' '预计归还时间' '借款用途' '担保物情况' '资金路径': 【借款类型】=协议约定的借款（实际为对价款）或【是否涉及给合作方借款】=否，隐藏
    if (
      ['Jkje', 'Jklv', 'Jkqx', 'Yjghsj', 'Jkyt', 'Dbwqk', 'Jzlj'].includes(
        r.Zdm
      )
    ) {
      if (formData.value.Jklx === '10' || formData.value.Sfsjghzfjk === 'N') {
        Object.assign(field, { hidden: true })
      }
    }
    // '借款履约条件':【借款类型】=前期为借款、达到约定条件后转对价款 且【是否涉及给合作方借款】=是，才显示
    if (r.Zdm === 'Jklvtj') {
      if (formData.value.Jklx !== '20' || formData.value.Sfsjghzfjk !== 'Y') {
        Object.assign(field, { hidden: true })
      }
    }
    // 合同签章状态不为70=已作废时，隐藏签章作废原因
    if (r.Zdm === 'ZpcQzzfyy') {
      if (formData.value.ZsealState !== '70') {
        Object.assign(field, { hidden: true })
      }
    }

    return field
  }
  // 生成table字段配置
  const getTableColumn = (r: ContConfig) => {
    const ContTableEnum = computed(() => store.contTableEnum)
    const tableData =
      formData.value[ContTableEnum.value[r.Zlevel]]?.results?.filter(
        (d) => d.Operation !== 'D'
      ) || []
    const disabled = tableData.map((d) => {
      let disabled = !r.ZisDisplay
      if (
        (['H1', 'H2'].includes(r.Zlevel) &&
          r.Zdm === 'ZbodyType' &&
          formData.value.ZconClassNo1 !== '06') ||
        (r.Zlevel === 'H2' &&
          d.ZsealTypeNo === 'PERSONAL' &&
          r.Zdm === 'ZsealName') ||
        (r.Zlevel === 'H7' && r.Zdm === 'Code' && d.NotDel) ||
        (['20', '40'].includes(formData.value.ZdocumentType) &&
          r.Zlevel === 'H3' &&
          r.Zdm === 'ZtaxRateNo' &&
          classNo3Cache?.value.includes(d.ZconClassNo3)) ||
        (r.Zlevel === 'J3' && d.Qylsqk !== '20')
      ) {
        disabled = true
      }
      if (
        (formData.value.ZconClassNo2 !== sfjzht &&
          !['10', '50'].includes(d.ZbodyType) &&
          r.Zdm === 'ZisPayer') ||
        (formData.value.ZconClassNo2 !== sfjzht &&
          ['10', '50'].includes(d.ZbodyType) &&
          ['ZisSk', 'ZisKp'].includes(r.Zdm)) ||
        (formData.value.ZconClassNo2 === sfjzht &&
          !['10'].includes(d.ZbodyType) &&
          r.Zdm === 'ZisKp') ||
        (formData.value.ZconClassNo2 === sfjzht &&
          !['20'].includes(d.ZbodyType) &&
          r.Zdm === 'ZisSk') ||
        (formData.value.ZconClassNo2 === sfjzht &&
          !['30'].includes(d.ZbodyType) &&
          r.Zdm === 'ZisPayer')
      ) {
        disabled = true
      }
      if (
        ['H1'].includes(r.Zlevel) &&
        r.Zdm === 'ProviderWt' &&
        !d.ZisPayer &&
        !d.ZisSk &&
        !d.ZisKp
      ) {
        disabled = true
      }
      if (
        ['H2'].includes(r.Zlevel) &&
        ['ZsignUserName', 'ZsignUserPhone'].includes(r.Zdm) &&
        d.ZsealTypeNo === 'PERSONAL'
      ) {
        disabled = false
      }
      return disabled
    })
    const selectMultiple = false
    const column: TableColumn = {
      prop: r.Zdm,
      label: r.ZdmDec,
      required: r.ZisReq,
      disabled,
      inputType: r.Zcxfs,
      selectMultiple,
      defaultExpandedKeys: [],
      minWidth: r.Zcxfs === '70' ? '130' : '180',
      maxlength: r.Zlength || r.Zlength === 0 ? r.Zlength : undefined,
    }

    const domainList = computed(() => store.domainList)
    if (r.Zcxfs === '20') {
      // 所有的合同分类（包含一二三级分类）
      const classList = computed(() => store.classList)
      let selectOptions: SelectOption[] | SelectOption[][] = []
      const optionsList = domainList.value.filter((d) => d.Fieldname === r.Zdm)
      if (r.Zlevel === 'H1' && r.Zdm === 'ZbodyType') {
        const class1 = formData.value.ZconClassNo1
        optionsList.forEach((o) => {
          // 06 代表投策类
          if (class1 === '06') {
            // 投策类只要 50 60
            if (['50', '60'].includes(o.Code)) {
              ;(selectOptions as SelectOption[]).push({
                label: o.Text,
                value: o.Code,
              })
            }
          } else {
            // 非投策类排除 50 60
            if (!['50', '60'].includes(o.Code)) {
              ;(selectOptions as SelectOption[]).push({
                label: o.Text,
                value: o.Code,
              })
            }
          }
        })
      } else if (r.Zlevel === 'HA' && r.Zdm === 'Provider') {
        selectOptions = getBankSetProviderOptions()
      } else if (r.Zlevel === 'H5' && ['ZpaymentTypeNo'].includes(r.Zdm)) {
        // 【付款条件 - 款项类型】下拉选项
        const ZpaymentTypeNoOptions = computed(() => {
          const conClassNo3 = formData.value.ZconClassNo3 || []
          let paymentTypeNoList: any[] = []
          ;(conClassNo3 as string[]).forEach((d) => {
            const contractClass = classList.value.find(
              (c) => c.ZconClassNo === d
            )
            const currPaymentTypeNos =
              contractClass?.ContractPaySet?.results || []
            paymentTypeNoList.push(...currPaymentTypeNos)
          })
          // 去重
          paymentTypeNoList = arrDistinctByProp(
            paymentTypeNoList,
            'ZpaymentTypeNo'
          )
          return paymentTypeNoList.map((d) => {
            return {
              label: d.ZpaymentType,
              value: d.ZpaymentTypeNo,
            }
          })
        })
        selectOptions = [...ZpaymentTypeNoOptions.value]
      } else if (r.Zlevel === 'H5' && r.Zdm === 'ZitemNo') {
        // 【付款条件 - 行项目编码】下拉选项
        const ZitemNoOptions = computed(() => {
          const itemSets = formData.value.ContItemSet?.results || []
          let res: SelectOption[] = []
          if (itemSets.length) {
            res = itemSets.map((d) => {
              return {
                label: d.ZitemNo,
                value: d.ZitemNo,
              }
            })
          }
          return res
        })
        selectOptions = [...ZitemNoOptions.value]
      } else if (r.Zlevel === 'H7' && r.Zdm === 'Code') {
        const ZfileTypeNoOptions = computed(() => {
          const list = domainList.value.filter(
            (d) =>
              d.Fieldname === 'ZfileTypeNo' &&
              d.Field1 === formData.value.ZconCategoryNo
          )
          return list.map((d) => ({
            label: d.Text,
            value: d.Code,
          }))
        })
        selectOptions = [...ZfileTypeNoOptions.value]
      } else {
        selectOptions = optionsList.map((o) => {
          return {
            label: o.Text,
            value: o.Code,
          }
        })
      }

      Object.assign(column, { selectOptions })
    }

    if (r.Zcxfs === '30') {
      let selectOptions: SelectOption = { label: '' }
      const optionsList = domainList.value.filter((d) => d.Fieldname === r.Zdm)
      if (r.Zlevel === 'H1' && r.Zdm === 'Zfzmk') {
        selectOptions = {
          id: 'root',
          label: '',
          children: [
            {
              id: 'all',
              label: '全部操盘',
              children: optionsList
                .filter((d) => d.Code !== '00')
                .map((o) => {
                  return {
                    label: o.Text,
                    value: o.Code,
                    id: o.Code,
                  }
                }),
            },
            {
              id: '00',
              label: '不操盘',
            },
          ],
        }
        column.selectMultiple = true
        column.defaultExpandedKeys = ['all']
      }
      Object.assign(column, { selectOptions })
    }

    // '用印次数' '申请盖章次数'只有在线下用印时，才显示
    if (r.Zdm === 'ZsignNumber' || r.Zdm === 'SignCount') {
      if (
        formData.value.ZsignType !== '20' &&
        formData.value.ZconClassNo1 !== '06'
      ) {
        Object.assign(column, { hidden: true })
      }
    }

    // '是否委托付款方' '是否委托收款方' '是否委托开票方' '受委托单位名称' '受委托单位编码'只有在勾选'是否存在委托业务'时，才显示
    if (
      [
        'ZisPayer',
        'ZisPayerTxt',
        'ZisSk',
        'ZisSkTxt',
        'ZisKp',
        'ZisKpTxt',
        'ProviderWt',
        'ProviderNoWt',
      ].includes(r.Zdm)
    ) {
      if (!formData.value.ZifWtyw && formData.value.ZconClassNo1 !== '06') {
        Object.assign(column, { hidden: true })
      }
    }

    // '强制签署页' 签章方式为电子签章且合同类别为成本类合同时，才显示 todo
    if (['ZcmSginPage'].includes(r.Zdm)) {
      if (
        formData.value.ZsignType !== '10' &&
        formData.value.ZconCategoryNo === '10'
      ) {
        Object.assign(column, { hidden: true })
      }
    }

    return column
  }
  // “无需用印”时，隐藏签章信息栏
  const collapseSignConfig = (value: string) => {
    const signConfig = configs.value.find((d) => d.lv === 'H2')
    if (signConfig) signConfig.hidden = ['30', '40'].includes(value)
  }
  // 投策类，非一级开发项目，隐藏H9合作方信息
  const collapsePartnerInfo = (value: string) => {
    const partnerInfo = configs.value.find((d) => d.lv === 'H9')
    if (partnerInfo) partnerInfo.hidden = value === '1'
  }
  // 设置整体的配置信息
  const setConfigs: CommonFunc = () => {
    const domainList = computed(() => store.domainList)
    // 块信息标题编码列表
    const ZlevelList = domainList.value.filter((d) => d.Fieldname === 'Zlevel')
    configs.value = []
    rules.value = {}
    configsRes.forEach((r: ContConfig) => {
      // rules 配置
      if (!rules.value[r.Zdm] && pageType !== 'view') {
        const rule = getRule(r)
        Object.assign(rules.value, rule)
      }
      // configs 配置
      const config = configs.value.find((c: Config) => c.lv === r.Zlevel)
      const showType = ['H', 'H9', 'J1', 'J2', 'C1'].includes(r.Zlevel)
        ? 'form'
        : 'table'
      if (!config) {
        const Zlevel = ZlevelList.find((d: DomainData) => d.Code === r.Zlevel)
        const configItem = {
          lv: r.Zlevel,
          lvName: Zlevel?.Text || '',
          showType,
        }
        if (showType === 'form') {
          Object.assign(configItem, {
            fields: [getField(r)],
          })
        } else {
          Object.assign(configItem, {
            tableColumns: [getTableColumn(r)],
          })
        }
        // 行项目信息、付款条件 增加合计行
        if (['H3', 'H5'].includes(r.Zlevel)) {
          let sumFields: string[] = []
          // 行项目信息统计 ‘签约金额’ ‘签约金额（不含税）’ ‘补充金额’ ‘累计金额（含税）’ ‘累计金额（不含税）’ ‘补充金额（不含税）’ ‘补充金额税额’ ‘税额’ ‘补充金额税额’
          if (r.Zlevel === 'H3') {
            sumFields = [
              'ZitemAmtTax',
              'ZitemAmt',
              'Zbcje',
              'ZnitemAmtTax',
              'ZnitemAmt',
              'ZbcjeAmt',
              'ZbcjeTaxamt',
              'ZtaxAmt',
              'ZbcjeTaxamt',
            ]
          }
          // 付款条件统计 ‘付款金额（含税）’
          if (r.Zlevel === 'H5') sumFields = ['ZpaymentAmtTax']
          Object.assign(configItem, {
            showSum: true,
            sumFields,
          })
        }
        configs.value.push(configItem)
      } else {
        if (showType === 'form') {
          config.fields?.push(getField(r))
        } else {
          config.tableColumns?.push(getTableColumn(r))
        }
      }
    })

    if (pageType !== 'view') {
      configs.value.forEach((c) => {
        c.lvHeadBtns = []
        if (
          c.lv === 'H1' &&
          ['10', '30'].includes(formData.value.ZdocumentType)
        ) {
          c.lvHeadBtns = [
            {
              name: '新增签约主体',
              type: 'primary',
              plain: true,
            },
          ]
        } else if (c.lv === 'H5') {
          c.lvHeadBtns = [
            {
              name: '尾差调整',
              type: 'primary',
              plain: true,
            },
            {
              name: '新增付款条件',
              type: 'primary',
              plain: true,
            },
          ]
        } else if (c.lv === 'H6') {
          c.lvHeadBtns = [
            {
              name: '生成合并文件',
              type: 'primary',
              plain: false,
            },
          ]
        } else if (c.lv === 'H7') {
          c.lvHeadBtns = [
            {
              name: '新增附件',
              type: 'primary',
              plain: false,
            },
          ]
        } else if (c.lv === 'H8') {
          c.lvHeadBtns = [
            {
              name: '新增适用范围',
              type: 'primary',
              plain: true,
            },
          ]
        } else if (c.lv === 'HB') {
          c.lvHeadBtns = [
            {
              name: '新增管理人员',
              type: 'primary',
              plain: true,
            },
          ]
        } else if (c.lv === 'HF') {
          c.lvHeadBtns = [
            {
              name: '新增行',
              type: 'primary',
              plain: true,
            },
          ]
        }
        // 签约主体、签章信息、付款条件、合同审批支撑材料、合同适用范围 、管理人员 加多一栏操作栏
        if (['H1', 'HA', 'H2', 'H5', 'H7', 'H8', 'HB', 'HF'].includes(c.lv)) {
          let width = '80'
          if (['HA'].includes(c.lv)) width = '120'
          if (['H7'].includes(c.lv)) width = '160'
          if (['H2'].includes(c.lv)) width = '200'
          if (
            !(['H1'].includes(c.lv) && ['20', '40'].includes(ZdocumentType))
          ) {
            c.tableColumns?.push({
              label: '操作',
              prop: 'actions',
              required: false,
              selectMultiple: false,
              disabled: [],
              width,
            })
          }
        }
      })
    } else {
      // 合同支撑材料 查看 也要预览下载功能
      configs.value.forEach((c) => {
        c.lvHeadBtns = []
        if (['H7'].includes(c.lv)) {
          c.tableColumns?.push({
            label: '操作',
            prop: 'actions',
            required: false,
            selectMultiple: false,
            disabled: [],
            width: '160',
          })
        }
      })
    }
    // “无需用印”时，隐藏签章信息栏
    collapseSignConfig(formData.value.ZsignType)
    // 投策类隐藏显示H9合作方信息逻辑
    if (formData.value.ZconClassNo1 === '06') {
      const realType = pageType === 'add' ? Ztype : formData.value.Ztype
      collapsePartnerInfo(realType || '')
    }
  }
  const getConfigs: GetConfigs = async (params: ContractConfigParams) => {
    const res = await getContractFormConfigs({
      ZdocumentType: params.ZdocumentType,
      ZconCategoryNo: params.ZconCategoryNo,
      ZconClassNo1: params.ZconClassNo1,
      ZconClassNo2: params.ZconClassNo2,
      ZconClassNo3: params.ZconClassNo3,
      Zmode: params.Zmode,
    })
    configsRes = res.d?.results || []
  }

  // 储存补充合同的配置信息
  let supplementContCfg = [
    {
      Zdm: 'ZsReasonNo',
      ZisDisplay: true,
      Zlevel: 'H',
    },
  ]
  // 重置补充合同配置信息
  const resetSupplementContCfg: CommonFunc = () => {
    supplementContCfg = [
      {
        Zdm: 'ZsReasonNo',
        ZisDisplay: true,
        Zlevel: 'H',
      },
    ]
  }
  // 补充合同原因控制哪些字段可编辑
  const setConfigsEditable: CommonFunc = () => {
    const ContTableEnum = computed(() => store.contTableEnum)
    configs.value.forEach((config) => {
      if (config.showType === 'form') {
        config.fields?.forEach((f) => {
          if (
            supplementContCfg.find(
              (c) => c.Zlevel === config.lv && c.Zdm === f.field
            )
          ) {
            f.disabled = false
          } else {
            f.disabled = true
          }
        })
      } else {
        const tableData =
          formData.value[ContTableEnum.value[config.lv]]?.results?.filter(
            (d) => d.Operation !== 'D'
          ) || []
        config.tableColumns?.forEach((col) => {
          col.disabled = []
          if (
            supplementContCfg.find(
              (c) => c.Zlevel === config.lv && c.Zdm === col.prop
            )
          ) {
            tableData.forEach((d) => {
              let disabled = false
              if (
                (['H1', 'H2'].includes(config.lv) &&
                  col.prop === 'ZbodyType' &&
                  formData.value.ZconClassNo1 !== '06') ||
                (config.lv === 'H2' &&
                  d.ZsealTypeNo === 'PERSONAL' &&
                  col.prop === 'ZsealName') ||
                (config.lv === 'H7' && col.prop === 'Code' && d.NotDel) ||
                (['20', '40'].includes(formData.value.ZdocumentType) &&
                  config.lv === 'H3' &&
                  col.prop === 'ZtaxRateNo' &&
                  classNo3Cache?.value.includes(d.ZconClassNo3)) ||
                (config.lv === 'J3' && d.Qylsqk !== '20')
              ) {
                disabled = true
              }
              if (
                (formData.value.ZconClassNo2 !== sfjzht &&
                  !['10', '50'].includes(d.ZbodyType) &&
                  col.prop === 'ZisPayer') ||
                (formData.value.ZconClassNo2 !== sfjzht &&
                  ['10', '50'].includes(d.ZbodyType) &&
                  ['ZisSk', 'ZisKp'].includes(col.prop)) ||
                (formData.value.ZconClassNo2 === sfjzht &&
                  !['10'].includes(d.ZbodyType) &&
                  col.prop === 'ZisKp') ||
                (formData.value.ZconClassNo2 === sfjzht &&
                  !['20'].includes(d.ZbodyType) &&
                  col.prop === 'ZisSk') ||
                (formData.value.ZconClassNo2 === sfjzht &&
                  !['30'].includes(d.ZbodyType) &&
                  col.prop === 'ZisPayer')
              ) {
                disabled = true
              }
              if (
                ['H2'].includes(config.lv) &&
                ['ZsignUserName', 'ZsignUserPhone'].includes(col.prop)
              ) {
                disabled = d.ZsealTypeNo !== 'PERSONAL'
              }
              col.disabled.push(disabled)
            })
          } else {
            tableData.forEach(() => {
              const disabled = true
              col.disabled.push(disabled)
            })
          }
        })
        if (config.lv !== 'H7') {
          // 如果列表所有字段都不能编辑，则操作栏和块头部按钮不渲染
          const columnsWithoutActions =
            config.tableColumns?.filter((c) => c.prop !== 'actions') || []
          let actionEditable = false
          for (const item of columnsWithoutActions) {
            for (const subitem of item.disabled) {
              if (!subitem) {
                actionEditable = true
                break
              }
            }
          }
          if (!actionEditable) {
            config.lvHeadBtns = []
            config.tableColumns = columnsWithoutActions
          }
        }
      }
    })
  }
  const getContReasonEditable: GetConfigs = async (
    params: ContractConfigParams
  ) => {
    const res = await getContractReasonEditable({ ...params })
    supplementContCfg = res.d?.results || []
    if (!supplementContCfg.length) {
      resetSupplementContCfg()
    }
  }

  return {
    getConfigs,
    setConfigs,
    resetSupplementContCfg,
    getContReasonEditable,
    setConfigsEditable,
  }
}
