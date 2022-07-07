<template>
  <div :class="[ns.b(), { [ns.m('collapsed')]: collapseAnchor }]">
    <el-scrollbar ref="containerRef" :class="ns.e('scrollbar')">
      <el-form
        ref="formRef"
        :key="formKey"
        :model="currFormData"
        :rules="rules"
        label-width="132px"
        :class="[
          ns.e('form'),
          {
            [ns.em('form', 'view')]: pageType === 'view',
            [ns.em('form', 'edit')]: pageType !== 'view',
          },
        ]"
      >
        <div
          v-for="item of configs.filter((c) => !c.hidden)"
          :id="`content-${item.lv}`"
          :key="item.lv"
          :class="ns.e('contentbox')"
        >
          <contract-subtitle :title="item.lvName">
            <div v-show="pageType !== 'view'">
              <template v-for="(btn, btnIdx) of item.lvHeadBtns" :key="btnIdx">
                <el-button
                  :type="btn.type"
                  :plain="btn.plain"
                  @click="handleHeadBtnClick(item.lv, btnIdx)"
                  >{{ btn.name }}
                </el-button>
              </template>
            </div>
          </contract-subtitle>
          <div :class="ns.e('form-body')">
            <contract-edit-form
              v-if="item.showType === 'form'"
              v-model:formData="currFormData"
              :config-item="item"
              :page-type="pageType"
              :long-labels="longLabels"
              :wrap-scroll-top="wrapScrollTop"
              @handle-form-select-visible="handleFormSelectVisible"
              @handle-form-input-click="handleFormInputClick"
              @handle-form-input-change="handleFormInputChange"
              @handle-form-tree-select-check="handleFormTreeSelectCheck"
            />
            <div v-else>
              <el-row
                v-if="
                  item.lv === 'H1' &&
                  configs
                    .find((d) => d.lv === 'H')
                    ?.fields?.find((d) =>
                      ['ZifWtyw', 'ZifWtywTxt'].includes(d.field)
                    )
                "
              >
                <el-col :span="8">
                  <el-form-item
                    :label="`是否存在委托业务:`"
                    prop="ZifWtyw"
                    :class="[
                      ns.e('form-item'),
                      {
                        [ns.em('form-item', 'mini-lineH')]:
                          longLabels.includes('ZifWtyw'),
                      },
                    ]"
                  >
                    <template v-if="pageType !== 'view'">
                      <el-checkbox
                        v-model="currFormData.ZifWtyw"
                        :disabled="
                          configs
                            .find((d) => d.lv === 'H')
                            ?.fields?.find((d) => ['ZifWtyw'].includes(d.field))
                            ?.disabled
                        "
                        @change="(val) => handleFormInputChange('ZifWtyw', val)"
                      ></el-checkbox>
                    </template>
                    <div v-else>{{ currFormData['ZifWtywTxt'] }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <contract-edit-table
                v-if="item.lv !== 'H6'"
                v-model:formData="currFormData"
                :config-item="item"
                :rules="rules"
                :page-type="pageType"
                :wrap-scroll-top="wrapScrollTop"
                @handle-del-item="handleDelItem"
                @handle-table-item-add="handleTableItemAdd"
                @handle-table-item-transposition="handleTableItemTransposition"
                @handle-table-input-click="handleTableInputClick"
                @handle-table-input-change="handleTableInputChange"
                @handle-table-select-visible="handleTableSelectVisible"
                @handle-table-tree-select-check="handleTableTreeSelectCheck"
                @handle-upload-att-c="handleUploadAttC"
              />
              <attachment-table
                v-else
                :page-type="pageType"
                :form-data="formData"
                :z-is-template="formData.ZisTemplate"
                @handle-upload-file="handleUploadFile"
              />
            </div>
          </div>
        </div>
      </el-form>
    </el-scrollbar>
    <div
      v-if="configs?.filter((c) => !c.hidden).length > 0"
      :class="ns.e('anchor')"
    >
      <el-tooltip v-model:visible="tooltipVisible" placement="top">
        <template #content>{{ collapseAnchor ? '展开' : '收起' }}</template>
        <el-icon
          size="20px"
          :class="ns.e('collapsebtn')"
          @click="handleCollapseAnchor"
          @mouseenter="tooltipVisible = true"
          @mouseleave="tooltipVisible = false"
        >
          <component :is="collapseAnchor ? 'd-arrow-left' : 'd-arrow-right'" />
        </el-icon>
      </el-tooltip>
      <el-bgy-anchor :get-container="getContainer" :offset="120">
        <el-bgy-anchor-link
          v-for="item of configs.filter((c) => !c.hidden)"
          :key="item.lv"
          :href="`#content-${item.lv}`"
          :title="item.lvName"
          type="default"
        ></el-bgy-anchor-link>
      </el-bgy-anchor>
    </div>
  </div>
  <organization-tree-dialog
    ref="orgDiaRef"
    :value="formData.Znodeid"
    @save="handleOrgSelectSave"
  />
  <region-dialog
    ref="regionDiaRef"
    :form-data="formData"
    :region-value="formData.Zssqy"
    :project-value="formData.Zxmzj"
    :zxmzj-value="formData.Zbm"
    @save="handleRegSelectSave"
  />
  <common-search-help-dialog
    ref="commonSearchHelpDiaRef"
    :dialog-configs="dialogConfigs"
    :party-list="partyList"
    @save="handleCommonSearchHelpSave"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  nextTick,
  provide,
  inject,
  computed,
  onMounted,
} from 'vue'
import { NOOP } from '@vue/shared'
import { cloneDeep, isEqual } from 'lodash'
import { DArrowLeft, DArrowRight } from '@element-plus/icons-vue'
import {
  ElForm,
  ElFormItem,
  ElCheckbox,
  ElButton,
  ElRow,
  ElCol,
  ElScrollbar,
  ElBgyAnchor,
  ElBgyAnchorLink,
  ElTooltip,
  ElIcon,
  ElMessage,
} from '@element-plus/components'
import { useNamespace } from '@element-plus/hooks'
import {
  checkBcje,
  fetchFuncImportZnodeid,
  getExchangeRateByCurrency,
} from '../requests'
import {
  getProfitCenterDiaConfigs,
  getCompanyDiaConfigs,
  getSealDiaConfigs,
  getRangeDiaConfigs,
  getBankAccountDiaConfigs,
} from '../searchHelpConfigs'
import OrganizationTreeDialog from './DiaOrganizationTree.vue'
import RegionDialog from './DiaRegion.vue'
import CommonSearchHelpDialog from './DiaCommonSearchHelp.vue'
import AttachmentTable from './AttachmentTable.vue'
import ContractEditTable from './ContractEditTable.vue'
import ContractEditForm from './ContractEditForm.vue'
import ContractSubtitle from './ContractSubtitle.vue'
import type {
  Config,
  ContractConfigParams,
  ContractStore,
  DepTreeData,
} from '../interface'
import type {
  AddOrDelBankSet,
  AddPaySetByItem,
  AddSignSet,
  AllOrNoZfzmk,
  AutoCalcPercOrAmt,
  AutoCalcProgressAmt,
  CheckClassNoAndSet,
  CheckCompanyAndAccountName,
  CheckTaxType,
  ClearWtCompanyInfo,
  CommonCheckFunc,
  CommonFunc,
  ContractEditData,
  DelAttCFile,
  DelPartySet,
  DelPaySet,
  DelRangeSet,
  DelSignSet,
  DownSignSet,
  GetConfigs,
  GetKpProvider,
  GetPayerProvider,
  GetSkProvider,
  GetTabs,
  HandleClassNoChange,
  HandleUploadAttC,
  HandleUploadFile,
  SetBankInfo,
  SetBankSetProviderInfo,
  SetCheckboxSingle,
  SetCompanyInfo,
  SetFormChangeFlag,
  SetFormData,
  SetRangeInfo,
  SetSealInfo,
  SetTableItemChangeFlag,
  UpdateSignSetByParty,
  UpSignSet,
} from '../interface/contractEdit'
import type { PropType } from 'vue'
import type { DialogConfig } from '../interface/commonSearchHelpDia'

export default defineComponent({
  name: 'ContractMainInfo',
  components: {
    ElForm,
    ElFormItem,
    ElCheckbox,
    ElButton,
    ElRow,
    ElCol,
    ElScrollbar,
    ElBgyAnchor,
    ElBgyAnchorLink,
    ElTooltip,
    ElIcon,
    ContractSubtitle,
    ContractEditForm,
    ContractEditTable,
    AttachmentTable,
    DArrowLeft,
    DArrowRight,
    OrganizationTreeDialog,
    RegionDialog,
    CommonSearchHelpDialog,
  },
  props: {
    formData: {
      type: Object as PropType<ContractEditData>,
      required: true,
    },
    configs: {
      type: Array as PropType<Config[]>,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
    configParams: {
      type: Object as PropType<ContractConfigParams>,
      required: true,
    },
    pageType: {
      type: String,
      required: true,
    },
    documentType: {
      type: String,
      required: true,
    },
  },
  emits: ['update:formData', 'loading'],
  setup(props, { emit }) {
    const currFormData = computed<ContractEditData>({
      get() {
        return props.formData
      },
      set(v) {
        emit('update:formData', v)
      },
    })

    const ns = useNamespace('contract-tab-main-info')

    const store = inject<ContractStore>('store', {
      domainList: [],
      classList: [],
      contTableEnum: {},
    })

    // 字段名太长导致换行的所有字段集合，统一处理行高样式
    const longLabels = [
      'ZisTemplate',
      'ZisTemplateTxt',
      'ZnotTemplateRemark',
      'ZsamtTax',
      'ZsnewAmtTax',
      'Zsamt',
      'Sftphzxmzjglyq',
      'Sfsjjtgszwgdzt',
      'Sfjttzzdzxm',
    ]
    // 三方甲指合同二级分类编码
    const sfjzht = inject<string>('sfjzht')
    // 合同二级分类
    const ZconClassNo2 = computed(() => props.formData.ZconClassNo2)
    const ContTableEnum = computed(() => store.contTableEnum)
    // 锚点组件相关
    const containerRef = ref<any>(null)
    const getContainer = () => containerRef.value.$refs.wrap$
    const wrapScrollTop = ref(0)
    onMounted(() => {
      containerRef.value.$refs.wrap$.onscroll = (e) => {
        wrapScrollTop.value = e.target.scrollTop
      }
    })

    const tooltipVisible = ref(false)
    const collapseAnchor = ref(false)
    const handleCollapseAnchor = () => {
      collapseAnchor.value = !collapseAnchor.value
    }
    // loading
    const loading = ref(false)
    const setLoading = (val) => {
      loading.value = val
    }
    provide('setLoading', setLoading)
    watch(loading, (val) => {
      emit('loading', val)
    })

    // form组件ref
    const formRef = ref<InstanceType<typeof ElForm>>()
    // 表单组件的key
    const formKey = ref(0)

    // 获取页签配置并更新
    const getTabs = inject<GetTabs>('getTabs', NOOP)
    // 记录修改，用于触发Operation字段修改
    const setFormChangeFlag = inject<SetFormChangeFlag>(
      'setFormChangeFlag',
      NOOP
    )
    const setTableItemChangeFlag = inject<SetTableItemChangeFlag>(
      'setTableItemChangeFlag',
      NOOP
    )
    /** 表单数据 **/
    const handleClassNoChange = inject<HandleClassNoChange>(
      'handleClassNoChange',
      NOOP
    )
    const setFormData = inject<SetFormData>('setFormData', NOOP)
    const checkClassNoAndSet = inject<CheckClassNoAndSet>(
      'checkClassNoAndSet',
      () => false
    )
    /** 配置信息 **/
    const getConfigs = inject<GetConfigs>('getConfigs', NOOP)
    const setConfigs = inject<CommonFunc>('setConfigs', NOOP)
    const resetSupplementContCfg = inject<CommonFunc>(
      'resetSupplementContCfg',
      NOOP
    )
    const getContReasonEditable = inject<GetConfigs>(
      'getContReasonEditable',
      NOOP
    )
    const setConfigsEditable = inject<CommonFunc>('setConfigsEditable', NOOP)
    /** 签约主体 **/
    const addPartySet = inject<CommonFunc>('addPartySet', NOOP)
    const delPartySet = inject<DelPartySet>('delPartySet', NOOP)
    const setCheckboxSingle = inject<SetCheckboxSingle>(
      'setCheckboxSingle',
      () => false
    )
    const setCompanyInfo = inject<SetCompanyInfo>('setCompanyInfo', NOOP)
    const setWtCompanyInfo = inject<SetCompanyInfo>('setWtCompanyInfo', NOOP)
    const clearWtCompanyInfo = inject<ClearWtCompanyInfo>(
      'clearWtCompanyInfo',
      NOOP
    )
    const checkTaxType = inject<CheckTaxType>('checkTaxType', NOOP)
    const allOrNoZfzmk = inject<AllOrNoZfzmk>('allOrNoZfzmk', NOOP)
    /** 银行信息 **/
    const addBankSet = inject<AddOrDelBankSet>('addBankSet', NOOP)
    const delBankSet = inject<AddOrDelBankSet>('delBankSet', NOOP)
    const getPayerProvider = inject<GetPayerProvider>('getPayerProvider', NOOP)
    const getSkProvider = inject<GetSkProvider>('getSkProvider', NOOP)
    const getKpProvider = inject<GetKpProvider>('getKpProvider', NOOP)
    const clearBankDataByOptions = inject<CommonFunc>(
      'clearBankDataByOptions',
      NOOP
    )
    const setBankSetProviderInfo = inject<SetBankSetProviderInfo>(
      'setBankSetProviderInfo',
      NOOP
    )
    const setBankInfo = inject<SetBankInfo>('setBankInfo', NOOP)
    const checkCompanyAndAccountName = inject<CheckCompanyAndAccountName>(
      'checkCompanyAndAccountName',
      NOOP
    )
    const checkZzhlxIsUnique = inject<CommonCheckFunc>(
      'checkZzhlxIsUnique',
      () => false
    )
    /** 签章信息 **/
    const upSignSet = inject<UpSignSet>('upSignSet', NOOP)
    const downSignSet = inject<DownSignSet>('downSignSet', NOOP)
    const addSignSet = inject<AddSignSet>('addSignSet', NOOP)
    const delSignSet = inject<DelSignSet>('delSignSet', NOOP)
    const updateSignSetByParty = inject<UpdateSignSetByParty>(
      'updateSignSetByParty',
      NOOP
    )
    const setSealInfo = inject<SetSealInfo>('setSealInfo', NOOP)
    const resetSignSetData = inject<CommonFunc>('resetSignSetData', NOOP)
    /** 行项目信息 **/
    const setContItemSet = inject<CommonFunc>('setContItemSet', NOOP)
    const calcAmtAndTax = inject<CommonFunc>('calcAmtAndTax', NOOP)
    /** 付款条件 **/
    const addPaySet = inject<CommonFunc>('addPaySet', NOOP)
    const delPaySet = inject<DelPaySet>('delPaySet', NOOP)
    const autoCalcPercOrAmt = inject<AutoCalcPercOrAmt>(
      'autoCalcPercOrAmt',
      NOOP
    )
    const tailDiffAdjustment = inject<CommonFunc>('tailDiffAdjustment', NOOP)
    const addPaySetByItem = inject<AddPaySetByItem>('addPaySetByItem', NOOP)
    const autoCalcProgressAmt = inject<AutoCalcProgressAmt>(
      'autoCalcProgressAmt',
      NOOP
    )
    const delPaySetOnClass3Change = inject<CommonFunc>(
      'delPaySetOnClass3Change',
      NOOP
    )
    /** 合同文本信息 **/
    const handleUploadFile = inject<HandleUploadFile>('handleUploadFile', NOOP)
    /** 合同支撑材料 **/
    const addAttC = inject<CommonFunc>('addAttC', NOOP)
    const delAttCFile = inject<DelAttCFile>('delAttCFile', NOOP)
    const handleUploadAttC = inject<HandleUploadAttC>('handleUploadAttC', NOOP)
    const setContAttCSet = inject<CommonFunc>('setContAttCSet', NOOP)
    /** 适用范围 **/
    const setRangeInfo = inject<SetRangeInfo>('setRangeInfo', NOOP)
    const addRangeSet = inject<CommonFunc>('addRangeSet', NOOP)
    const delRangeSet = inject<DelRangeSet>('delRangeSet', NOOP)
    /** 费用预算 **/
    // const updateBudgetData = inject<any>('updateBudgetData')

    // 更新配置信息同时看情况设置补充合同的配置
    const updateConfigs: CommonFunc = () => {
      // 先更新所有配置
      setConfigs()
      // 补充合同要把可编辑的项重新设置一下
      if (
        ['20', '40'].includes(props.documentType) &&
        props.pageType !== 'view'
      ) {
        setConfigsEditable()
      }
    }

    watch(
      () => props.configs,
      () => {
        nextTick(() => {
          formRef.value?.clearValidate()
        })
      },
      { deep: true }
    )

    // 缓存三级分类，用于对比前后三级分类变化执行后续逻辑
    const lastClassNo3 = ref<string[]>([])
    const nextClassNo3 = ref<string[]>([])

    /** 通用搜索帮助 **/
    const dialogConfigs = ref<DialogConfig>({
      dialogTitle: '',
      dialogWidth: '',
      field: '',
      f4field: '',
      searchFormConfigs: [],
      tableConfigs: {
        tableHeight: '',
        multiSelect: false,
        columns: [],
      },
    })
    const partyList = ref<string[]>([])
    const commonSearchHelpDiaRef = ref<typeof CommonSearchHelpDialog | null>(
      null
    )
    let searchHelpFieldIndex = 0
    const handleCommonSearchHelpSave = async (field, f4field, data) => {
      if (f4field === 'Prctr') {
        // 利润中心搜索帮助
        setFormData((formData) => {
          formData.value.Prctr = data.PRCTR
          formData.value.ZnodeName = data.ZNODE_NAME
        })
      } else if (['H1Provider', 'NH1Provider'].includes(f4field)) {
        // 公司名称搜索帮助
        setTableItemChangeFlag({
          target: 'ContPartySet',
          index: searchHelpFieldIndex,
        })
        if (field === 'Provider') {
          setCompanyInfo(searchHelpFieldIndex, data)
          // 同步更新签章信息对应行的公司名称
          const partyItem =
            props.formData.ContPartySet.results[searchHelpFieldIndex]
          updateSignSetByParty(partyItem)
          // 甲方公司校验提示
          if (f4field === 'H1Provider') {
            checkTaxType(props.formData.Zdinvoicetype, partyItem)
          }
        } else if (field === 'ProviderWt') {
          setWtCompanyInfo(searchHelpFieldIndex, data)
        }
        // 同步更新银行信息 付款方 收款方 开票方 的单位信息
        getPayerProvider(ZconClassNo2.value === sfjzht)
        if (f4field === 'NH1Provider') {
          getSkProvider()
          getKpProvider()
        }
      } else if (f4field === 'Zseal') {
        // 印章搜索帮助
        setTableItemChangeFlag({
          target: 'ContSignSet',
          index: searchHelpFieldIndex,
        })
        setSealInfo(data, searchHelpFieldIndex)
      } else if (f4field === 'ZapplyNo') {
        // 适用范围搜索帮助
        setTableItemChangeFlag({
          target: 'ContRangeSet',
          index: searchHelpFieldIndex,
        })
        setRangeInfo(data, searchHelpFieldIndex)
      } else if (['H1BankAccount', 'NH1BankAccount'].includes(f4field)) {
        // 银行账号搜索帮助
        setBankInfo(data, searchHelpFieldIndex, ZconClassNo2.value === sfjzht)
        if (f4field === 'NH1BankAccount') {
          checkCompanyAndAccountName(
            props.formData.ContBankSet.results[searchHelpFieldIndex]
          )
          const check = checkZzhlxIsUnique()
          if (!check) {
            ElMessage.warning('收款方的账户类别不能重复，请检查')
          }
        }
      }

      nextTick(() => {
        updateConfigs()
      })
    }

    /** 所属组织搜索帮助 **/
    const orgDiaRef = ref<typeof OrganizationTreeDialog | null>(null)
    const handleOrgSelectSave = async (data: DepTreeData) => {
      const res = await fetchFuncImportZnodeid(data.Zorgid)
      setFormData((formData) => {
        formData.value.ZnodeidName = data.Zoorgname
        formData.value.Znodeid = data.Zorgid
        formData.value.Zssqy = res.d?.Zssqy || ''
        formData.value.ZssqyMs = res.d?.ZssqyMs || ''
        formData.value.Prctr = res.d?.Prctr || ''
        formData.value.ZnodeName = res.d?.ZnodeName || ''
      })
    }
    /** 区域名称/项目名称搜索帮助 **/
    const regionDiaRef = ref<typeof RegionDialog | null>(null)
    const handleRegSelectSave = ({ id, label, param, region }) => {
      switch (param) {
        case 'region':
          setFormData((formData) => {
            formData.value.Zssqy = id
            formData.value.ZssqyMs = label
            formData.value.Zxmzj = ''
            formData.value.ZproTxt = ''
            formData.value.Zbm = ''
            formData.value.ZfqmcMdg = ''
          })
          break
        case 'project':
          setFormData((formData) => {
            formData.value.Zxmzj = id
            formData.value.ZproTxt = label
            formData.value.Zbm = ''
            formData.value.ZfqmcMdg = ''
            // 取成本选择项目后，回写区域信息
            formData.value.Zssqy = region.regionId
            formData.value.ZssqyMs = region.regionKey
          })
          break
        case 'stage':
          setFormData((formData) => {
            formData.value.Zbm = id
            formData.value.ZfqmcMdg = label
          })
          break
      }
    }

    // 根据印花税科目code设置印花税科目描述
    const setZtaxType = (no) => {
      const fields = props.configs.find((d) => d.lv === 'H')?.fields || []
      const taxTypeNoOptions =
        fields.find((d) => d.field === 'ZtaxTypeNo')?.selectOptions || []
      const currTaxType =
        taxTypeNoOptions.find((d) => d.value === no)?.label || ''
      setFormData((formData) => {
        formData.value.ZtaxType = currTaxType
      })
    }

    // 三级分类改变时执行的逻辑，在收起下拉和删除tag时触发
    const onClass3Changed = async () => {
      loading.value = true
      // 处理数据
      handleClassNoChange('ZconClassNo3', props.formData.ZconClassNo3)
      // 更新行项目数据
      setContItemSet()
      // 更新合同支撑材料数据
      setContAttCSet()
      // 更新费用预算数据
      // updateBudgetData()

      await getTabs({
        ZconClassNo1: props.formData.ZconClassNo1,
      })
      await getConfigs({
        ...props.configParams,
        ZconClassNo1: props.formData.ZconClassNo1,
        ZconClassNo2: props.formData.ZconClassNo2,
        ZconClassNo3: Array.isArray(props.formData.ZconClassNo3)
          ? props.formData.ZconClassNo3.join(',')
          : '',
      })
      // 清空实际管理人员数据，重新选择 todo

      updateConfigs()
      if (props.pageType === 'add') {
        // 法务合同业务逻辑
        if (props.formData.ZconClass2.indexOf('法务') > -1) {
          setFormData((formData) => {
            formData.value.ZconName = ''
          })
          const remark =
            '乙方受甲方委托，作为甲方的代理人参与【   公司】诉【   公司】【   纠纷】一案【案号：   】的【一审/二审/执行阶段】的诉讼程序。' +
            '乙方的代理权限为一般授权。在甲方制空权范围内，乙方向甲方提供本合同第三条约定的法律服务。'
          if (!props.formData.Remark) {
            setFormData((formData) => {
              formData.value.Remark = remark
            })
          }
        }
      }
      delPaySetOnClass3Change()
      loading.value = false
      // 更新formKey强制表单整个重新渲染
      formKey.value++
    }

    // 补充合同原因改变时执行的逻辑，在收起下拉和删除tag时触发
    const onReasonChanged = async () => {
      loading.value = true
      if (props.formData.ZsReasonNo.length) {
        await getContReasonEditable({
          ZconCategoryNo: props.formData.ZconCategoryNo,
          ZsReasonNo: Array.isArray(props.formData.ZsReasonNo)
            ? props.formData.ZsReasonNo.join(',')
            : props.formData.ZsReasonNo,
        })
        // 先将配置还原（保证切换补充合同原因时配置正确）
        setConfigs()
        // 再设置是否可编辑
        setConfigsEditable()
      } else {
        // 将配置还原
        setConfigs()
        resetSupplementContCfg()
        setConfigsEditable()
      }
      loading.value = false
    }

    // 下拉选项展示时回调
    const handleFormSelectVisible = async (
      targetKey: string,
      show: boolean
    ) => {
      const reasonNo = props.formData.ZsReasonNo || []
      switch (targetKey) {
        // 签章方式
        case 'ZsignType':
          if (
            show &&
            props.formData.ContSignSet.results.filter(
              (d) => d.Operation !== 'D'
            ).length
          ) {
            ElMessage({
              showClose: true,
              message: '改变签章方式将重置签章信息，请谨慎选择',
              type: 'warning',
              duration: 5000,
            })
          }
          break
        // 合同三级分类
        case 'ZconClassNo3':
          if (show) {
            lastClassNo3.value = Array.isArray(props.formData.ZconClassNo3)
              ? cloneDeep(props.formData.ZconClassNo3)
              : props.formData.ZconClassNo3.split(',')
          } else {
            // 三级分类下拉列表收起，触发表单配置更新
            nextClassNo3.value = Array.isArray(props.formData.ZconClassNo3)
              ? cloneDeep(props.formData.ZconClassNo3)
              : props.formData.ZconClassNo3.split(',')
            if (!isEqual(lastClassNo3.value, nextClassNo3.value)) {
              onClass3Changed()
            }
          }
          break
        // 补充合同原因
        case 'ZsReasonNo':
          if (!show) {
            if (reasonNo.length) {
              // 选中‘作废主合同’则清理掉其他只保留‘作废主合同’
              if (reasonNo.includes('15')) {
                setFormData((formData) => {
                  formData.value.ZsReasonNo = ['15']
                })
              }
            }
            onReasonChanged()
          } else {
            ElMessage.warning('如选择“作废主合同”将只支持单选！')
          }
          break
      }
    }

    // form表单控件点击事件
    const handleFormInputClick = (targetKey: string) => {
      switch (targetKey) {
        case 'ZnodeidName':
          orgDiaRef.value?.open()
          break
        case 'ZssqyMs':
          regionDiaRef.value?.open('region')
          break
        case 'ZproTxt':
          regionDiaRef.value?.open('project')
          break
        case 'Prctr':
          dialogConfigs.value = getProfitCenterDiaConfigs('Prctr')
          commonSearchHelpDiaRef.value?.open()
          break
      }
    }

    // form表单多选控件移除tag事件
    const handleFormSelectRemoveTag = async (
      targetKey: string,
      value: string
    ) => {
      setFormChangeFlag({
        target: targetKey,
      })
      switch (targetKey) {
        // 合同三级分类
        case 'ZconClassNo3':
          onClass3Changed()
          break
        // 补充合同原因
        case 'ZsReasonNo':
          onReasonChanged()
          break
      }
    }

    // form表单数据改变回调
    const handleFormInputChange = async (
      targetKey: string,
      value: string | number | boolean | string[]
    ) => {
      formRef.value?.clearValidate()
      setFormChangeFlag({
        target: targetKey,
      })
      switch (targetKey) {
        // 合同类别
        case 'ZconCategoryNo':
          loading.value = true
          // 更新配置信息
          await getConfigs({
            ...props.configParams,
            ZconCategoryNo: value as string,
          })
          setConfigs()
          loading.value = false
          // 更新formKey强制表单整个重新渲染
          formKey.value++
          break
        // 合同一级分类
        case 'ZconClassNo1':
          // 处理数据
          handleClassNoChange('ZconClassNo1', value as string)
          // 更新配置信息
          nextTick(() => {
            const check = checkClassNoAndSet(2)
            if (check) {
              handleClassNoChange('ZconClassNo2', props.formData.ZconClassNo2)
              const check3 = checkClassNoAndSet(3)
              if (check3) {
                onClass3Changed()
              } else {
                setConfigs()
              }
            } else {
              setConfigs()
            }
          })
          break
        // 合同二级分类
        case 'ZconClassNo2':
          // 处理数据
          handleClassNoChange('ZconClassNo2', value as string)
          // 更新配置信息
          nextTick(() => {
            setConfigs()
            const check = checkClassNoAndSet(3)
            if (check) {
              onClass3Changed()
            }
          })
          break
        // 签章方式
        case 'ZsignType':
          // 重置签章信息
          resetSignSetData()
          break
        // 币种
        case 'ZcurrencyNo':
          // 根据币种获取汇率
          getExchangeRateByCurrency(value).then((res) => {
            if (res.d?.ZexchangeRate) {
              setFormData((formData) => {
                formData.value.ZexchangeRate = res.d.ZexchangeRate
              })
            }
          })
          break
        // 印花税科目
        case 'ZtaxTypeNo':
          setZtaxType(value)
          break
        // 发票类型
        case 'Zdinvoicetype':
          checkTaxType(value as string, props.formData.ContPartySet.results[0])
          break
      }
      if (
        [
          'ZsignType',
          'Sfsydgxm',
          'Sftphzxmzjglyq',
          'Sfsjghzfjk',
          'Jklx',
          'ZisTemplate',
          'ZifWtyw',
        ].includes(targetKey)
      ) {
        // 更新配置信息
        nextTick(() => {
          updateConfigs()
          if (targetKey === 'ZsignType') {
            formKey.value++
          } else if (targetKey === 'ZifWtyw') {
            clearBankDataByOptions()
          }
        })
      }
    }

    const handleFormTreeSelectCheck = (
      targetKey: string,
      currNode: any,
      checkedNode: any
    ) => {
      // console.log(targetKey, currNode, checkedNode)
    }

    // 块数据头部新增按钮点击事件
    const handleHeadBtnClick = (lv: string, index: number) => {
      switch (lv) {
        case 'H1':
          if (index === 0) {
            addPartySet()
          }
          break
        case 'H5':
          if (index === 0) {
            // 尾差调整
            tailDiffAdjustment()
          } else if (index === 1) {
            addPaySet()
          }
          break
        case 'H6':
          if (index === 0) {
            // console.log('生成合并文件')
          }
          break
        case 'H7':
          if (index === 0) {
            addAttC()
          }
          break
        case 'H8':
          if (index === 0) {
            addRangeSet()
          }
          break
      }
      nextTick(() => {
        updateConfigs()
      })
    }

    // 块数据删除按钮点击事件
    const handleDelItem = async (lv: string, index: number) => {
      setFormChangeFlag({
        target: ContTableEnum.value[lv],
      })
      switch (lv) {
        case 'H1':
          if (
            ZconClassNo2.value === sfjzht &&
            props.formData.ContPartySet.results[index].ZbodyType === '30'
          ) {
            ElMessage.warning('三方甲指合同不能删除丙方')
          } else {
            delPartySet(index)
          }
          break
        case 'H2':
          delSignSet(index)
          break
        case 'H5':
          delPaySet(index)
          break
        case 'H7':
          loading.value = true
          await delAttCFile(lv, index)
          loading.value = false
          break
        case 'H8':
          delRangeSet(index)
          break
        case 'HA':
          delBankSet(index)
          break
      }
      nextTick(() => {
        updateConfigs()
      })
    }

    // 列表数据每一行的新增按钮点击事件
    const handleTableItemAdd = (lv: string, index: number) => {
      switch (lv) {
        case 'H2':
          if (props.formData.ZsignType === '20') {
            ElMessage.error('选择线下用印时，不能再新增个人签名')
          } else {
            addSignSet(index)
          }
          break
        case 'HA':
          addBankSet(index)
          break
      }
      nextTick(() => {
        updateConfigs()
      })
    }

    // 列表数据上移和下移按钮点击事件
    const handleTableItemTransposition = (
      lv: string,
      index: number,
      upOrDown: string
    ) => {
      if (lv === 'H2') {
        setFormChangeFlag({
          target: `ContSignSet${index}`,
        })
        if (upOrDown === 'up') {
          upSignSet(index)
        } else {
          downSignSet(index)
        }
      }
      nextTick(() => {
        formRef.value?.clearValidate()
        updateConfigs()
      })
    }

    // 列表控件点击事件
    const handleTableInputClick = (
      target: string,
      index: number,
      targetKey: string
    ) => {
      switch (target) {
        case 'ContPartySet':
          if (targetKey === 'Provider' || targetKey === 'ProviderWt') {
            // 公司名称
            let isFirstParty =
              props.formData.ContPartySet.results[index].ZbodyType === '10'
            if (props.formData.ZconClassNo1 === '06') {
              isFirstParty =
                props.formData.ContPartySet.results[index].ZbodyType === '50'
            }
            let Znodeid = ''
            if (
              isFirstParty &&
              targetKey === 'Provider' &&
              props.formData.ZconClassNo1 !== '06'
            ) {
              Znodeid = props.formData.Znodeid
              if (!Znodeid) {
                ElMessage.warning('请先选择所属组织')
                return false
              }
            }
            searchHelpFieldIndex = index
            dialogConfigs.value = getCompanyDiaConfigs(
              isFirstParty,
              targetKey,
              Znodeid,
              props.formData.ZconClassNo1
            )
            const currPartyList: string[] = []
            props.formData.ContPartySet.results.forEach((d) => {
              if (d.ProviderNo) {
                currPartyList.push(d.ProviderNo)
              }
              if (d.ProviderNoWt) {
                currPartyList.push(d.ProviderNoWt)
              }
            })
            partyList.value = currPartyList
            commonSearchHelpDiaRef.value?.open()
          }
          break
        case 'ContBankSet':
          if (targetKey === 'BankAccount') {
            const currBankSet = props.formData.ContBankSet.results[index]
            const firstParty = props.formData.ContPartySet.results.find(
              (d) => d.ZbodyType === '10'
            )
            const companyCode = currBankSet.ProviderNo
            if (!companyCode) {
              ElMessage.warning('请先选择单位！')
            } else {
              searchHelpFieldIndex = index
              let f4field = 'H1BankAccount'
              if (currBankSet.ZbodyType1 === '500') {
                if (props.formData.ZconClassNo2 !== sfjzht) {
                  f4field = !firstParty?.ZisPayer
                    ? 'H1BankAccount'
                    : 'NH1BankAccount'
                } else {
                  f4field = 'NH1BankAccount'
                }
              } else if (currBankSet.ZbodyType1 === '510') {
                f4field = 'NH1BankAccount'
              } else {
                f4field =
                  props.formData.ZconClassNo2 === sfjzht
                    ? 'H1BankAccount'
                    : 'NH1BankAccount'
              }
              dialogConfigs.value = getBankAccountDiaConfigs(
                'BankAccount',
                f4field,
                companyCode
              )
              commonSearchHelpDiaRef.value?.open()
            }
          }
          break
        case 'ContSignSet':
          if (targetKey === 'ZsealName') {
            // 印章
            const currProvider =
              props.formData.ContSignSet.results[index].Provider
            if (currProvider) {
              searchHelpFieldIndex = index
              const signType =
                props.formData.ZsignType === '10' ? 'ELECTRONIC' : 'PHYSICS'
              dialogConfigs.value = getSealDiaConfigs(
                currProvider,
                signType,
                'ZsealName'
              )
              commonSearchHelpDiaRef.value?.open()
            } else {
              ElMessage.error('公司名称缺失，请先选择公司')
            }
          }
          break
        case 'ContRangeSet':
          if (targetKey === 'Zorgname') {
            // 适用范围
            searchHelpFieldIndex = index
            dialogConfigs.value = getRangeDiaConfigs('Zorgname')
            commonSearchHelpDiaRef.value?.open()
          }
          break
      }
    }

    const handleTableSelectVisible = (
      target: string,
      index: number,
      targetKey: string,
      show: boolean
    ) => {
      switch (target) {
        case 'ContPartySet':
          break
      }
    }

    // table表单数据改变回调
    const handleTableInputChange = async (
      target: string,
      index: number,
      targetKey: string,
      value: string | number | boolean
    ) => {
      formRef.value?.clearValidate()
      setTableItemChangeFlag({
        target,
        index,
      })
      const domainList = computed(() => store.domainList)
      const partyItem = props.formData.ContPartySet.results[index]
      switch (target) {
        case 'ContPartySet':
          if (targetKey === 'ZbodyType') {
            // 改了主体性质则清空公司信息
            setFormData((formData) => {
              formData.value.ContPartySet.results[index].Provider = ''
              formData.value.ContPartySet.results[index].ProviderNo = ''
              formData.value.ContPartySet.results[index].Ztyshxydm = ''
            })
            updateSignSetByParty(partyItem)
          } else if (targetKey === 'ZisPayer') {
            clearWtCompanyInfo(index, value as boolean)
            // 同步更新银行信息付款方行的单位信息
            getPayerProvider(ZconClassNo2.value === sfjzht)
            updateConfigs()
          } else if (['ZisKp', 'ZisSk'].includes(targetKey)) {
            setCheckboxSingle(index, targetKey, value as boolean)
            clearWtCompanyInfo(index, value as boolean)
            if (targetKey === 'ZisSk') {
              getSkProvider()
            } else {
              getKpProvider(ZconClassNo2.value === sfjzht)
            }
            updateConfigs()
            clearBankDataByOptions()
          }
          break
        case 'ContBankSet':
          if (targetKey === 'Provider') {
            setBankSetProviderInfo(index, value as string)
            updateConfigs()
          }
          break
        case 'ContItemSet':
          // 行项目自动计算逻辑
          if (
            ['Menge', 'Uprice', 'ZtaxRateNo', 'ZitemAmtTax', 'Zbcje'].includes(
              targetKey
            )
          ) {
            calcAmtAndTax()
            if (targetKey === 'Zbcje') {
              // 补充金额改变调接口校验
              const currSetData = props.formData.ContItemSet.results[index]
              if (Number(currSetData.ZnitemAmtTax) < 0) {
                ElMessage.warning('累计金额不允许为负数，请检查')
              }
              const res = await checkBcje({
                Zywhdbm: currSetData.Zywhdbm,
                ZdocumentNo: props.formData.ZmainDocumentNo,
                ZnitemAmtTax: currSetData.ZnitemAmtTax,
              })
              if (res.d?.Message) {
                ElMessage.error(res.d?.Message)
              }
            }
            // 金额改变后，也要更新费用预算数据
            // updateBudgetData()
            // 费用类合同，签约金额（不含税）或累计金额（不含税）有值时，自动带出进度款
            if (
              (props.formData.ContItemSet.results[index].ZitemAmt ||
                props.formData.ContItemSet.results[index].ZnitemAmt) &&
              props.formData.ZconCategoryNo === '20'
            ) {
              autoCalcProgressAmt(props.configParams.ZconCategoryNo as string)
              addPaySetByItem(
                props.formData.ContItemSet.results[index],
                props.configParams.ZconCategoryNo as string
              )
              updateConfigs()
            }
          }
          if (targetKey === 'ZtaxRateNo') {
            setFormData((formData) => {
              const domain = domainList.value.filter(
                (d) => d.Fieldname === 'ZtaxRateNo'
              )
              const ZtaxRateNoTxt =
                domain.find((d) => d.Code === value)?.Text || ''
              formData.value.ContItemSet.results[index].ZtaxRateNoTxt =
                ZtaxRateNoTxt
            })
          }
          break
        case 'ContPaySet':
          if (targetKey === 'ZpaymentPerc') {
            autoCalcPercOrAmt(index, 'amt')
          } else if (targetKey === 'ZpaymentAmtTax') {
            autoCalcPercOrAmt(index, 'perc')
          }
          break
      }
    }

    const handleTableTreeSelectCheck = (
      target: string,
      index: number,
      targetKey: string,
      currNode: any,
      checkedNode: any
    ) => {
      console.log(target, index, targetKey, currNode, checkedNode)
      switch (target) {
        case 'ContPartySet':
          if (targetKey === 'Zfzmk') {
            allOrNoZfzmk(index, currNode)
          }
          break
      }
    }

    const validateForm = () => {
      return new Promise((resolve) => {
        formRef.value?.validate((res) => {
          resolve(res)
        })
      })
    }

    return {
      ns,
      formRef,
      currFormData,
      containerRef,
      wrapScrollTop,
      tooltipVisible,
      collapseAnchor,
      orgDiaRef,
      regionDiaRef,
      formKey,
      loading,
      longLabels,
      dialogConfigs,
      partyList,
      commonSearchHelpDiaRef,
      handleCommonSearchHelpSave,
      getContainer,
      handleHeadBtnClick,
      handleDelItem,
      handleTableItemAdd,
      handleTableItemTransposition,
      handleFormSelectVisible,
      handleFormSelectRemoveTag,
      handleFormInputClick,
      handleFormInputChange,
      handleFormTreeSelectCheck,
      handleTableInputClick,
      handleTableInputChange,
      handleTableSelectVisible,
      handleTableTreeSelectCheck,
      handleUploadFile,
      handleUploadAttC,
      handleCollapseAnchor,
      handleOrgSelectSave,
      handleRegSelectSave,
      validateForm,
    }
  },
})
</script>
