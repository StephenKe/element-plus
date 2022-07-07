<template>
  <el-tabs v-model="tabName" :class="ns.b()" @tab-click="handleTabClick">
    <el-tab-pane
      v-for="tab of tabList"
      :key="tab.ZtabKey"
      :class="ns.e('tab-pane')"
      :label="tab.ZtabDesc"
      :name="tab.ZtabKey"
    >
      <main-info
        v-if="tab.ZtabKey === 'Y1'"
        :ref="(el) => (mainInfoRef = el)"
        v-model:form-data="formData"
        :configs="configs"
        :rules="rules"
        :config-params="configParams"
        :page-type="realPageType"
        :document-type="documentType"
        @loading="handleLoading"
      />
    </el-tab-pane>
  </el-tabs>

  <el-footer :class="ns.e('footer')">
    <el-button
      v-if="realPageType === 'view' && showEditBtn"
      type="primary"
      @click="handleEditBtnClick"
      >编辑</el-button
    >
    <el-button @click="handleCancelBtnClick">{{
      realPageType === 'view' ? '返回' : '取消'
    }}</el-button>
    <el-button
      v-if="realPageType !== 'view' && showSubmitBtn"
      type="primary"
      @click="handleSave"
      >保存</el-button
    >
    <el-button
      v-if="realPageType !== 'view' && showSubmitBtn"
      type="primary"
      @click="handleSubmit"
      >供方确认</el-button
    >
  </el-footer>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  watch,
  provide,
  reactive,
} from 'vue'
import { cloneDeep } from 'lodash'
import {
  ElTabs,
  ElTabPane,
  ElMessage,
  ElFooter,
  ElButton,
} from '@element-plus/components'
import { useNamespace } from '@element-plus/hooks'
import { checkErrMsg, formatContractData } from './utils'
import { contractEditFormProps } from './contract-form'
import {
  editContract,
  getContractTabs,
  getDomainList,
  getClassList,
} from './requests'
import MainInfo from './components/TabMainInfo.vue'
import useConfigs from './composables/useConfigs'
import useFormData from './composables/useFormData'
import { contractDefaultData } from './dataStructure'
import validData from './validData'
import usePartySet from './composables/usePartySet'
import useBankSet from './composables/useBankSet'
import useSignSet from './composables/useSignSet'
import useItemSet from './composables/useItemSet'
import usePaySet from './composables/usePaySet'
import useAttCSet from './composables/useAttCSet'
import useRangeSet from './composables/useRangeSet'
import type {
  Config,
  ContractConfigParams,
  ContractStore,
  CommonType,
} from './interface'
import type {
  ContAttBSet,
  ContPartySet,
  ContractEditData,
  FormChangeFlag,
  GetTabs,
  HandleUploadFile,
} from './interface/contractEdit'

export default defineComponent({
  name: 'ElContractEditForm',
  components: {
    ElTabs,
    ElTabPane,
    ElFooter,
    ElButton,
    MainInfo,
  },
  props: contractEditFormProps,
  emits: [
    'edit-btn-click',
    'cancel-btn-click',
    'save-success',
    'submit-success',
    'contract-loading',
    'render-to-view',
  ],
  setup(props, { emit }) {
    const ns = useNamespace('contract-form')

    provide('env', props.env)
    provide('user', props.user)
    provide('urlPrefix', props.urlPrefix)

    const store = reactive<ContractStore>({
      domainList: [],
      classList: [],
      contTableEnum: {},
    })
    provide('store', store)

    // 投策类是否一级开发项目
    const Ztype = String(props.ztype || '')
    const loading = ref(false)
    watch(loading, (val) => {
      handleLoading(val)
    })

    /**
     * pageType
     * 'view' 查看
     * 'edit' 编辑
     *
     * 增加机制防止传入add变成新增页面
     */
    const realPageType = props.pageType === 'edit' ? 'edit' : 'view'
    // 查看/编辑 模式
    const Zmode = realPageType === 'view' ? '10' : '20'
    // 调数据接口和配置接口用到的数据
    const configParams: ContractConfigParams = {
      pageType: realPageType,
      ZdocumentNo: props.documentNo,
      ZconState: props.conState,
      ZdocumentType: props.documentType,
      ZconCategoryNo: props.conCategoryNo,
      ZconClassNo1: props.conClassNo1,
      ZconClassNo2: props.conClassNo2,
      ZconClassNo3: props.conClassNo3,
      Zmode,
    }
    // 三方甲指合同二级分类code
    const sfjzht = '123456'
    provide('sfjzht', sfjzht)

    // 主要信息
    const mainInfoRef = ref<typeof MainInfo | null>(null)
    // 修改记录列表的高度
    const changeLogHeight = ref('400')

    // 合同表单数据
    const formData = ref<ContractEditData>({
      ...cloneDeep(contractDefaultData),
    })
    const setFormData = (callback) => {
      callback(formData)
      if (formData.value.Hguid && formData.value.Operation !== 'C') {
        formData.value.Operation = 'U'
      }
    }
    provide('setFormData', setFormData)
    // 记录formData修改，用于触发formData的Operation修改
    const formChangeFlag = ref<FormChangeFlag>({
      target: '',
    })
    const setFormChangeFlag = (obj: FormChangeFlag) => {
      formChangeFlag.value = { ...obj }
    }
    provide('setFormChangeFlag', setFormChangeFlag)
    watch(
      formChangeFlag,
      () => {
        const { target } = formChangeFlag.value
        if (target) {
          if (formData.value.Hguid && formData.value.Operation !== 'C') {
            formData.value.Operation = 'U'
          }
        }
      },
      { deep: true }
    )
    // 记录table改动的行，用于触发对应数据Operation修改
    const tableItemChangeFlag = ref<FormChangeFlag>({
      target: '',
      index: 0,
    })
    const setTableItemChangeFlag = (obj: FormChangeFlag) => {
      tableItemChangeFlag.value = { ...obj }
    }
    provide('setTableItemChangeFlag', setTableItemChangeFlag)
    watch(
      tableItemChangeFlag,
      () => {
        const { target, index } = tableItemChangeFlag.value
        if (/^Cont\w+Set$/.test(target)) {
          if (
            formData.value[target].results[index].Hguid ||
            formData.value[target].results[index].Operation !== 'C'
          ) {
            formData.value[target].results[index].Operation = 'U'
            if (formData.value.Hguid && formData.value.Operation !== 'C') {
              formData.value.Operation = 'U'
            }
          }
        }
      },
      { deep: true }
    )

    // 缓存三级分类（补充合同用）
    const classNo3Cache = ref<string[]>([])
    provide('classNo3Cache', classNo3Cache)
    // 合同签约总金额（含税）
    const ZsamtTax = ref(0)
    watch(ZsamtTax, (val) => {
      formData.value.ZsamtTax = val ? val.toFixed(2) : '0.00'
    })
    // 合同签约总金额（不含税）
    const Zsamt = ref(0)
    watch(Zsamt, (val) => {
      formData.value.Zsamt = val ? val.toFixed(2) : '0.00'
    })
    // 合同总税额
    const ZtaxAmt = ref(0)
    watch(ZtaxAmt, (val) => {
      formData.value.ZtaxAmt = val ? val.toFixed(2) : '0.00'
    })
    // 行项目金额变更自动更新表单的总金额和税额等字段
    watch(
      () => formData.value.ContItemSet.results,
      (val) => {
        let ZbcjeSum = 0
        let ZbcjeAmtSum = 0
        let ZbcjeTaxamtSum = 0
        let ZitemAmtTaxSum = 0
        let ZitemAmtSum = 0
        let ZtaxAmtSum = 0
        val
          .filter((d) => d.Operation !== 'D')
          .forEach((d) => {
            ZbcjeSum += Number(d.Zbcje || 0)
            ZbcjeAmtSum += Number(d.ZbcjeAmt || 0)
            ZbcjeTaxamtSum += Number(d.ZbcjeTaxamt || 0)
            ZitemAmtTaxSum += Number(d.ZitemAmtTax || 0)
            ZitemAmtSum += Number(d.ZitemAmt || 0)
            ZtaxAmtSum += Number(d.ZtaxAmt || 0)
          })
        if (['20', '40'].includes(props.documentType)) {
          ZsamtTax.value = ZbcjeSum
          Zsamt.value = ZbcjeAmtSum
          ZtaxAmt.value = ZbcjeTaxamtSum
        } else {
          ZsamtTax.value = ZitemAmtTaxSum
          Zsamt.value = ZitemAmtSum
          ZtaxAmt.value = ZtaxAmtSum
        }
      },
      { deep: true }
    )

    // 表单配置
    const configs = ref<Config[]>([])
    // 表单校验规则
    const rules = ref<CommonType>({})

    const {
      getFormData, // 获取表单数据
      handleClassNoChange, // 处理一二三级分类切换逻辑
      checkClassNoAndSet,
      clearFormDataByConfigs, // 清理表单数据（配置信息没有的，清理掉）
    } = useFormData(formData, realPageType, configParams, store)
    provide('handleClassNoChange', handleClassNoChange)
    provide('checkClassNoAndSet', checkClassNoAndSet)

    const {
      getConfigs, // 调用接口获取配置信息
      setConfigs, // 设置配置信息（将后端返回的数据转换成前端模板渲染需要的结构）
      resetSupplementContCfg, // 重置补充合同配置信息
      getContReasonEditable, // 调接口获取补充合同原因对应的可编辑字段
      setConfigsEditable, // 补充合同原因控制哪些字段可编辑
    } = useConfigs(
      configs,
      rules,
      realPageType,
      props.documentType,
      formData,
      store,
      Ztype,
      classNo3Cache,
      sfjzht
    )
    provide('getConfigs', getConfigs)
    provide('setConfigs', setConfigs)
    provide('resetSupplementContCfg', resetSupplementContCfg)
    provide('getContReasonEditable', getContReasonEditable)
    provide('setConfigsEditable', setConfigsEditable)

    const {
      newPartyItem, // 新增的item
      delPartyItem, // 删除的item
      addPartySet, // 新增签约主体
      delPartySet, // 删除签约主体
      setCheckboxSingle, // 确保checkbox只能选中一个的方法
      setCompanyInfo, // 公司搜索帮助设置公司相关信息
      setWtCompanyInfo, // 设置委托公司相关信息
      clearWtCompanyInfo,
      checkTaxType, // 根据发票类型和甲方纳税类型，弹出提示
      allOrNoZfzmk, // 全部操盘和不操盘二选一
    } = usePartySet(formData, store)
    provide('addPartySet', addPartySet)
    provide('delPartySet', delPartySet)
    provide('setCheckboxSingle', setCheckboxSingle)
    provide('setCompanyInfo', setCompanyInfo)
    provide('setWtCompanyInfo', setWtCompanyInfo)
    provide('clearWtCompanyInfo', clearWtCompanyInfo)
    provide('checkTaxType', checkTaxType)
    provide('allOrNoZfzmk', allOrNoZfzmk)

    const {
      addBankSet, // 新增银行信息
      delBankSet, // 删除银行信息
      getPayerProvider, // 获取付款方单位信息
      getSkProvider, // 获取收款方单位信息
      getKpProvider, // 获取开票方单位信息
      clearBankDataByOptions, // 根据下拉选项清理数据
      setBankSetProviderInfo, // 单位名称选中后设置相关数据
      setBankInfo, // 设置银行账号相关数据
      checkCompanyAndAccountName, // 根据非甲方公司名和账户名，弹出提示
      checkZzhlxIsUnique,
    } = useBankSet(formData, configs, sfjzht)
    provide('addBankSet', addBankSet)
    provide('delBankSet', delBankSet)
    provide('getPayerProvider', getPayerProvider)
    provide('getSkProvider', getSkProvider)
    provide('getKpProvider', getKpProvider)
    provide('clearBankDataByOptions', clearBankDataByOptions)
    provide('setBankSetProviderInfo', setBankSetProviderInfo)
    provide('setBankInfo', setBankInfo)
    provide('checkCompanyAndAccountName', checkCompanyAndAccountName)
    provide('checkZzhlxIsUnique', checkZzhlxIsUnique)

    const {
      upSignSet, // 上移签章信息
      downSignSet, // 下移签章信息
      addSignSet, // 新增签章信息
      delSignSet, // 删除签章信息
      setSealInfo, // 根据勾选的印章信息自动带出数据
      resetSignSetData, // 签章方式改变重置签章信息
      updateSignSetByParty, // 通过签约主体同步更新签章信息
      initContSignSet, // 初始化签章信息和签约主体的绑定关系
      addSignByParty, // 根据新增的签约主体新增签章信息
      delSignByParty, // 根据删除的签约主体删除签章信息
    } = useSignSet(formData)
    provide('upSignSet', upSignSet)
    provide('downSignSet', downSignSet)
    provide('addSignSet', addSignSet)
    provide('delSignSet', delSignSet)
    provide('updateSignSetByParty', updateSignSetByParty)
    provide('setSealInfo', setSealInfo)
    provide('resetSignSetData', resetSignSetData)

    const {
      setContItemSet, // 设置行项目信息
      calcAmtAndTax, // 自动计算行项目的金额
    } = useItemSet(formData, props.documentType, Zsamt, store)
    provide('setContItemSet', setContItemSet)
    provide('calcAmtAndTax', calcAmtAndTax)

    const {
      addPaySet, // 新增付款条件
      delPaySet, // 删除付款条件
      autoCalcPercOrAmt, // 自动计算比例或者金额
      tailDiffAdjustment, // 尾差调整
      addPaySetByItem, // 根据行项目新增付款条件
      autoCalcProgressAmt, // 自动计算进度款
      delPaySetOnClass3Change,
    } = usePaySet(formData, configs, store)
    provide('addPaySet', addPaySet)
    provide('delPaySet', delPaySet)
    provide('autoCalcPercOrAmt', autoCalcPercOrAmt)
    provide('tailDiffAdjustment', tailDiffAdjustment)
    provide('addPaySetByItem', addPaySetByItem)
    provide('autoCalcProgressAmt', autoCalcProgressAmt)
    provide('delPaySetOnClass3Change', delPaySetOnClass3Change)

    const handleUploadFile: HandleUploadFile = (data: ContAttBSet[]) => {
      setFormChangeFlag({
        target: 'ContAttBSet',
      })
      ;(data || []).forEach((item) => {
        delete item.file
      })
      // 非标模板
      formData.value.ContAttBSet.results = data
    }
    provide('handleUploadFile', handleUploadFile)

    const {
      addAttC, // 新增合同支撑材料
      delAttCFile, // 删除合同支撑材料
      handleUploadAttC, // 合同支撑材料上传完文件回调
      setContAttCSet, // 更新合同支撑材料列表数据
    } = useAttCSet(formData, store)
    provide('addAttC', addAttC)
    provide('delAttCFile', delAttCFile)
    provide('handleUploadAttC', handleUploadAttC)
    provide('setContAttCSet', setContAttCSet)

    const {
      setRangeInfo, // 根据勾选的适用范围自动带出数据
      addRangeSet, // 新增适用范围
      delRangeSet, // 删除适用范围
    } = useRangeSet(formData)
    provide('setRangeInfo', setRangeInfo)
    provide('addRangeSet', addRangeSet)
    provide('delRangeSet', delRangeSet)

    watch(newPartyItem, () => {
      addSignByParty(newPartyItem.value as ContPartySet)
    })

    watch(delPartyItem, () => {
      // 根据下拉选项清理数据
      clearBankDataByOptions()
      delSignByParty(delPartyItem.value as ContPartySet)
    })

    // 数据初始化逻辑（只处理主要信息页签的数据）
    const formDataInit = async () => {
      // 获取并初始化formData
      await getFormData()
      // 缓存三级分类
      classNo3Cache.value = Array.isArray(formData.value.ZmainZconClassNo3)
        ? formData.value.ZmainZconClassNo3
        : formData.value.ZmainZconClassNo3.split(',')
      // 初始化签章信息和签约主体的绑定关系
      initContSignSet()
      // 获取数据后先自动计算一次行项目金额
      calcAmtAndTax()
      // ISP触发编辑页面跳转查看页面
      if (!canEdit(formData.value.ZconState, formData.value.ZconStateIsp)) {
        emit('render-to-view')
      }
    }
    provide('formDataInit', formDataInit)

    const tabName = ref('Y1')
    provide('tabName', tabName)
    const tabList = ref([
      {
        ZtabDesc: '主要信息',
        ZtabKey: 'Y1',
      },
    ])
    const handleTabClick = async (tab) => {
      if (tab.props.name === 'Y2') {
        let errText = ''
        for (const item of formData.value.ContItemSet.results) {
          if (!['20', '40'].includes(props.documentType)) {
            if (!item.Zywhdbm || Number(item.ZitemAmtTax || 0) === 0) {
              errText = '行项目信息缺少业务活动或金额，请检查'
              break
            }
          } else {
            if (!item.Zywhdbm || !item.Zbcje) {
              errText = '行项目信息缺少业务活动或金额，请检查'
              break
            }
          }
        }
        if (errText) {
          ElMessage.warning(errText)
        }
      } else if (tab.props.name === 'Y6') {
        const tabsContent = document.querySelector(
          '.app-main .el-tabs .el-tabs__content'
        ) as HTMLElement
        const h = tabsContent?.clientHeight || 0
        changeLogHeight.value = h?.toString()
      } else if (tab.props.name === 'Y5') {
        // 不是已撤回或已作废的才每次切换签署进度更新数据
        if (!['40', '70'].includes(formData.value.ZsealState)) {
          await formDataInit()
        }
      }
    }
    const getTabs: GetTabs = async (params = {}) => {
      const realParams = {
        ZdocumentType: configParams.ZdocumentType,
        ZconCategoryNo: configParams.ZconCategoryNo,
        ZconClassNo1: configParams.ZconClassNo1,
        ZconState: configParams.ZconState,
      }
      Object.assign(realParams, params)
      const res = await getContractTabs(realParams)
      tabList.value = res.d?.results || []
      if (!tabList.value.length) {
        tabList.value = [
          {
            ZtabDesc: '主要信息',
            ZtabKey: 'Y1',
          },
        ]
      }
    }
    provide('getTabs', getTabs)
    const tabInit = () => {
      getTabs()
      tabName.value = 'Y1'
    }

    const init = async () => {
      loading.value = true
      tabInit()
      store.domainList = await getDomainList()
      const Zlevels = store.domainList.filter((d) => d.Fieldname === 'Zlevel')
      const res = {}
      Zlevels.forEach((d) => {
        if (d.Field1) {
          Object.assign(res, {
            [d.Code]: d.Field1,
          })
        }
      })
      store.contTableEnum = res
      store.classList = await getClassList()
      // ZrecordState == 30 代表启用的分类
      store.classList = store.classList.filter((d) => d.ZrecordState === '30')
      await formDataInit()
      // 更新配置信息
      await getConfigs(configParams)
      setConfigs()
      // 补充合同相关逻辑
      if (
        ['20', '40'].includes(props.documentType) &&
        realPageType !== 'view'
      ) {
        const ZsReasonNo = Array.isArray(formData.value.ZsReasonNo)
          ? formData.value.ZsReasonNo.join(',')
          : ''
        // 把可编辑的项重新设置一下
        await getContReasonEditable({
          ZconCategoryNo: formData.value.ZconCategoryNo,
          ZsReasonNo,
        })
        setConfigsEditable()
      }
      loading.value = false
    }

    // 合同状态“11待处理 12暂存 13起草中 14驳回源头 40审批驳回不重走 41审批驳回重走”，供方协同状态为待确认，显示编辑按钮
    const canEdit = (ZconState, ZconStateIsp) => {
      return (
        ['11', '12', '13', '14', '40', '41'].includes(ZconState) &&
        ['10'].includes(ZconStateIsp)
      )
    }

    const showEditBtn = computed(() =>
      canEdit(props.conState, formData.value.ZconStateIsp)
    )
    const showSubmitBtn = computed(() =>
      ['10'].includes(formData.value.ZconStateIsp)
    )

    // 保存前的逻辑
    const stepBeforeSave = () => {
      // 先将没展示的配置字段数据清理一下
      clearFormDataByConfigs(configs.value)
    }

    const handleEditBtnClick = () => {
      emit('edit-btn-click')
    }
    const handleCancelBtnClick = () => {
      emit('cancel-btn-click')
    }
    // 保存
    const handleSave = async () => {
      const mainInfoValid = await mainInfoRef.value?.validateForm()
      if (!mainInfoValid) {
        ElMessage.error('主要信息页签存在必填项未填写或格式不正确，请检查')
        return false
      }
      stepBeforeSave()
      const checkZzhlx = checkZzhlxIsUnique()
      if (!checkZzhlx) {
        ElMessage.error('收款方的账户类别不能重复，请检查')
        return false
      }
      const validResult = validData(formData.value, configs.value)
      if (!validResult.valid) {
        ElMessage({
          type: 'error',
          message: validResult.msg,
          duration: 5000,
        })
        return false
      }
      const params = formatContractData(formData.value)
      loading.value = true
      const res = await editContract(params)
      loading.value = false
      const check = await checkErrMsg(res)
      if (!check.E) {
        ElMessage.success('保存成功')
        init()
        emit('save-success')
      }
    }
    // 供方确认
    const handleSubmit = async () => {
      const mainInfoValid = await mainInfoRef.value?.validateForm()
      if (!mainInfoValid) {
        ElMessage.error('主要信息页签存在必填项未填写或格式不正确，请检查')
        return false
      }
      stepBeforeSave()
      const validResult = validData(formData.value, configs.value)
      if (!validResult.valid) {
        ElMessage({
          type: 'error',
          message: validResult.msg,
          duration: 5000,
        })
        return false
      }
      const params = formatContractData(formData.value)
      params.Operation = 'GFYQR'
      loading.value = true
      const res = await editContract(params)
      loading.value = false
      const check = await checkErrMsg(res)
      if (!check.E) {
        ElMessage.success('提交成功')
        init()
        emit('submit-success')
      }
    }

    onMounted(() => {
      init()
    })

    const handleLoading = (val: boolean) => {
      emit('contract-loading', val)
    }

    return {
      ns,
      tabName,
      tabList,
      realPageType,
      mainInfoRef,
      formData,
      configs,
      rules,
      classNo3Cache,
      configParams,
      showEditBtn,
      showSubmitBtn,

      handleTabClick,
      handleEditBtnClick,
      handleCancelBtnClick,
      handleSave,
      handleSubmit,
      handleLoading,
    }
  },
})
</script>
