import { computed } from 'vue'
import { ElMessage } from '@element-plus/components'
import { getContractDetails } from '../requests'
import { parseContractData, randomId } from '../utils'
import type {
  CheckClassNoAndSet,
  ContractEditData,
  ContractQuery,
  GetFormData,
  HandleClassNoChange,
} from '../interface/contractEdit'
import type { Config, ContractConfigParams, ContractStore } from '../interface'
import type { Ref } from 'vue'

export default function useFormData(
  formData: Ref<ContractEditData>,
  pageType: string,
  params: ContractConfigParams,
  store: ContractStore
) {
  const handleFormData = (defaultValues?: ContractQuery) => {
    // 签约主体初始化一个唯一id供多个签章信息对应
    formData.value.ContPartySet.results.forEach((d) => {
      d.ZpartyId = randomId()
    })
    // 投策类默认数据
    if (formData.value.ZconClassNo1 === '06' && defaultValues) {
      formData.value.Zland = defaultValues.projectCode || formData.value.Zland
      formData.value.Zlandname =
        defaultValues.projectName || formData.value.Zlandname
      formData.value.Zssqy = defaultValues.areaRelId || formData.value.Zssqy
      formData.value.ZssqyMs =
        defaultValues.areaRelName || formData.value.ZssqyMs
    }

    // 将日期数据从后端返回的'0000-00-00'转换成null
    for (const key in formData.value) {
      if (formData.value[key] === '0000-00-00') {
        formData.value[key] = null
      }

      if (formData.value[key]?.results) {
        for (const item of formData.value[key].results) {
          for (const itemKey in item) {
            if (item[itemKey] === '0000-00-00') {
              item[itemKey] = null
            } else if (
              Array.isArray(item[itemKey]?.results) &&
              item[itemKey].results.length
            ) {
              for (const subItem of item[itemKey].results) {
                for (const subItemKey in subItem) {
                  if (subItem[subItemKey] === '0000-00-00') {
                    subItem[subItemKey] = null
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // 设置数据，主要用于转换部分数据格式或内容
  const setFormData = (
    res: ContractEditData,
    defaultValues?: ContractQuery
  ) => {
    // 解析数据
    formData.value = parseContractData(res, pageType)
    // 处理数据
    handleFormData(defaultValues)
  }

  // 获取表单数据
  const getFormData: GetFormData = async (defaultValues?: ContractQuery) => {
    // 编辑/查看合同或者新增补充合同，都走这里
    const res = await getContractDetails(params)
    if (res.d?.results[0]?.Hguid) {
      setFormData(res.d?.results[0], defaultValues)
    } else {
      ElMessage.error('获取数据失败')
    }
  }

  // 一级、二级、三级分类修改时，动态改变数据
  const handleClassNoChange: HandleClassNoChange = (
    className: string,
    val: string | string[]
  ) => {
    // 所有的合同分类（包含一二三级分类）
    const classList = computed(() => store.classList)
    if (className === 'ZconClassNo1') {
      const class1Obj = classList.value.find((c) => c.ZconClassNo === val)
      formData.value.ZconClass1 = class1Obj?.ZconClass || ''
      formData.value.ZconClass2 = ''
      formData.value.ZconClassNo2 = ''
      formData.value.ZconClass3 = ''
      formData.value.ZconClassNo3 = ''
    } else if (className === 'ZconClassNo2') {
      const class2Obj = classList.value.find((c) => c.ZconClassNo === val)
      formData.value.ZconClass2 = class2Obj?.ZconClass || ''
      formData.value.ZconClass3 = ''
      formData.value.ZconClassNo3 = ''
    } else if (className === 'ZconClassNo3') {
      const ZconClass3: any = []
      ;(val as string[]).forEach((d) => {
        const class3Obj = classList.value.find((c) => c.ZconClassNo === d)
        ZconClass3.push(class3Obj?.ZconClass || '')
      })
      formData.value.ZconClass3 = ZconClass3
      // 针对投策类，ZbodyType变为“是否我方”，值变为50-是，60-否
      if (formData.value.ZconClassNo1 === '06') {
        formData.value.ContPartySet.results.forEach((d, idx) => {
          if (idx === 0) {
            d.ZbodyType = '50'
          } else {
            d.ZbodyType = '60'
          }
        })
      } else {
        formData.value.ContPartySet.results.forEach((d, idx) => {
          d.ZbodyType = `${idx + 1}0`
        })
      }
    }
  }
  // 检查某级分类是否只有一个，是则赋值
  const checkClassNoAndSet: CheckClassNoAndSet = (classNo: number) => {
    let res = false
    // 所有的合同分类（包含一二三级分类）
    const classList = computed(() => store.classList)
    const ZconClassList = computed(() => {
      const pClass = formData.value[`ZconClassNo${classNo - 1}`]
      return classList.value.filter((c) => c.ZpconClassNo === pClass)
    })
    if (ZconClassList.value.length === 1) {
      if (classNo === 2) {
        formData.value.ZconClassNo2 = ZconClassList.value[0].ZconClassNo
      } else if (classNo === 3) {
        formData.value.ZconClassNo3 = [ZconClassList.value[0].ZconClassNo]
      }
      res = true
    }
    return res
  }

  // 根据配置信息清理数据
  const clearFormDataByConfigs = (configs: Config[]) => {
    const ContTableEnum = computed(() => store.contTableEnum)
    if (formData.value.Hguid) {
      formData.value.Operation = 'U'
    }
    configs.forEach((c) => {
      if (!c.hidden) {
        if (c.showType === 'form') {
          c.fields?.forEach((f) => {
            if (f.hidden) {
              formData.value[f.field] = null
            }
          })
        } else {
          if (c.lv !== 'H6') {
            const currSet =
              formData.value[ContTableEnum.value[c.lv]]?.results || []
            currSet.forEach((s) => {
              c.tableColumns?.forEach((f) => {
                if (f.hidden) {
                  if (s.Hguid && !['C', 'D'].includes(s.Operation)) {
                    s.Operation = 'U'
                  }
                  s[f.prop] = null
                }
              })
            })
          }
        }
      } else {
        if (c.showType === 'form') {
          c.fields?.forEach((f) => {
            formData.value[f.field] = null
          })
        } else {
          const contsetResults: any = []
          const currSet =
            formData.value[ContTableEnum.value[c.lv]]?.results || []
          currSet.forEach((s) => {
            if (s.Hguid || s.Operation !== 'C') {
              contsetResults.push({
                ...s,
                Operation: 'D',
              })
            }
          })
          formData.value[ContTableEnum.value[c.lv]].results = contsetResults
        }
      }
    })
  }

  return {
    getFormData,
    handleClassNoChange,
    checkClassNoAndSet,
    clearFormDataByConfigs,
  }
}
