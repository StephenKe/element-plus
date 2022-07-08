<template>
  <el-table
    :data="
      (currFormData[ContTableEnum[configItem.lv]]?.results || []).filter(
        (d) => d.Operation !== 'D'
      )
    "
    border
    :show-summary="configItem.showSum"
    :summary-method="(params) => getSummaries(params, configItem.sumFields)"
    :class="ns.b()"
  >
    <el-table-column
      v-for="column of configItem.tableColumns?.filter((c) => !c.hidden)"
      :key="column.prop"
      :label="column.label"
      :prop="column.prop"
      :width="column.width"
      :min-width="column.minWidth"
      :fixed="column.prop === 'actions' ? 'right' : false"
    >
      <template v-if="pageType !== 'view'" #header>
        <span :class="{ [ns.e('required-col')]: column.required }">{{
          column.label
        }}</span>
      </template>
      <template #default="scope">
        <el-form-item
          v-if="
            !['actions', 'ZsealName'].includes(column.prop) ||
            (column.prop === 'ZsealName' &&
              scope.row.ZsealTypeNo !== 'PERSONAL')
          "
          :prop="`${ContTableEnum[configItem.lv]}.results.${scope.$index}.${
            column.prop
          }`"
          :rules="rules[column.prop]"
          :inline-message="true"
          :class="[
            ns.e('form-item'),
            {
              [ns.em('form-item', 'checkbox-center')]:
                column.inputType === '70',
              [ns.em('form-item', 'view')]: pageType === 'view',
              [ns.em('form-item', 'edit')]: pageType !== 'view',
            },
          ]"
        >
          <template v-if="pageType !== 'view'">
            <el-select
              v-if="column.inputType === '20'"
              :ref="(el) => selectRefs.push(el)"
              v-model="scope.row[column.prop]"
              :disabled="column.disabled[scope.$index]"
              :multiple="column.selectMultiple"
              @change="
                (val) =>
                  handleTableInputChange(
                    ContTableEnum[configItem.lv],
                    scope.$index,
                    column.prop,
                    val
                  )
              "
              @visible-change="
                (show) =>
                  handleTableSelectVisible(
                    ContTableEnum[configItem.lv],
                    scope.$index,
                    column.prop,
                    show
                  )
              "
            >
              <template v-if="Array.isArray(column.selectOptions[0])">
                <el-option
                  v-for="option in column.selectOptions[scope.$index]"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </template>
              <template v-else>
                <el-option
                  v-for="option in column.selectOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </template>
            </el-select>
            <el-tree-select
              v-else-if="column.inputType === '30'"
              :ref="(el) => treeSelectRefs.push(el)"
              v-model="scope.row[column.prop]"
              :data="column.selectOptions"
              :disabled="column.disabled[scope.$index]"
              :multiple="column.selectMultiple"
              :default-expanded-keys="column.defaultExpandedKeys"
              @change="
                (val) =>
                  handleTableInputChange(
                    ContTableEnum[configItem.lv],
                    scope.$index,
                    column.prop,
                    val
                  )
              "
              @check="
                (currNode, checkedNode) =>
                  handleTableTreeSelectCheck(
                    ContTableEnum[configItem.lv],
                    scope.$index,
                    column.prop,
                    currNode,
                    checkedNode
                  )
              "
            ></el-tree-select>
            <el-input
              v-else-if="column.inputType === '40'"
              v-model="scope.row[column.prop]"
              :disabled="column.disabled[scope.$index]"
              readonly
              @click="
                (e) =>
                  handleTableInputClick(
                    ContTableEnum[configItem.lv],
                    scope.$index,
                    column.prop
                  )
              "
              @change="
                (val) =>
                  handleTableInputChange(
                    ContTableEnum[configItem.lv],
                    scope.$index,
                    column.prop,
                    val
                  )
              "
            >
              <template #suffix>
                <el-icon
                  @click="
                    (e) =>
                      !column.disabled[scope.$index]
                        ? handleTableInputClick(
                            ContTableEnum[configItem.lv],
                            scope.$index,
                            column.prop
                          )
                        : null
                  "
                  ><search
                /></el-icon>
              </template>
            </el-input>
            <el-date-picker
              v-else-if="column.inputType === '50'"
              v-model="scope.row[column.prop]"
              type="date"
              :disabled="column.disabled[scope.$index]"
              value-format="YYYY-MM-DD"
              @change="
                (val) =>
                  handleTableInputChange(
                    ContTableEnum[configItem.lv],
                    scope.$index,
                    column.prop,
                    val
                  )
              "
            ></el-date-picker>
            <el-input
              v-else-if="column.inputType === '60'"
              v-model="scope.row[column.prop]"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 6 }"
              :disabled="column.disabled[scope.$index]"
              :show-word-limit="(column.maxlength || 0) > 0"
              :maxlength="column.maxlength || null"
              @change="
                (val) =>
                  handleTableInputChange(
                    ContTableEnum[configItem.lv],
                    scope.$index,
                    column.prop,
                    val
                  )
              "
            />
            <el-checkbox
              v-else-if="column.inputType === '70'"
              v-model="scope.row[column.prop]"
              :disabled="column.disabled[scope.$index]"
              @change="
                (val) =>
                  handleTableInputChange(
                    ContTableEnum[configItem.lv],
                    scope.$index,
                    column.prop,
                    val
                  )
              "
            ></el-checkbox>
            <el-input
              v-else
              v-model="scope.row[column.prop]"
              :disabled="column.disabled[scope.$index]"
              :maxlength="column.maxlength || null"
              @change="
                (val) =>
                  handleTableInputChange(
                    ContTableEnum[configItem.lv],
                    scope.$index,
                    column.prop,
                    val
                  )
              "
            />
          </template>
          <template v-else>
            <span>{{ scope.row[column.prop] }}</span>
          </template>
        </el-form-item>
        <div v-else-if="column.prop === 'ZsealName'" style="text-align: center">
          &nbsp;
        </div>
        <div v-else>
          <el-button
            v-if="configItem.lv === 'H1'"
            type="text"
            :disabled="['10', '20'].includes(scope.row['ZbodyType'])"
            @click="handleDelItem(configItem.lv, scope.$index)"
            >删除</el-button
          >
          <el-button
            v-if="configItem.lv === 'HA' && formData.ZconCategoryNo !== '20'"
            type="text"
            :disabled="['500', '520'].includes(scope.row.ZbodyType1)"
            @click="handleTableItemAdd(configItem.lv, scope.$index)"
            >新增</el-button
          >
          <el-button
            v-if="configItem.lv === 'HA'"
            type="text"
            :disabled="['500', '520'].includes(scope.row.ZbodyType1)"
            @click="handleDelItem(configItem.lv, scope.$index)"
            >删除</el-button
          >
          <el-button
            v-if="configItem.lv === 'H2'"
            type="text"
            :disabled="
              scope.$index ===
              currFormData[ContTableEnum[configItem.lv]]?.results?.filter(
                (d) => d.Operation !== 'D'
              ).length -
                1
            "
            @click="
              handleTableItemTransposition(configItem.lv, scope.$index, 'down')
            "
          >
            <el-icon>
              <sort-down />
            </el-icon>
          </el-button>
          <el-button
            v-if="configItem.lv === 'H2'"
            type="text"
            :disabled="scope.$index === 0"
            @click="
              handleTableItemTransposition(configItem.lv, scope.$index, 'up')
            "
          >
            <el-icon>
              <sort-up />
            </el-icon>
          </el-button>
          <el-button
            v-if="configItem.lv === 'H2'"
            type="text"
            @click="handleTableItemAdd(configItem.lv, scope.$index)"
            >新增签名</el-button
          >
          <el-button
            v-if="configItem.lv === 'H2'"
            type="text"
            @click="handleDelItem(configItem.lv, scope.$index)"
            >删除</el-button
          >
          <el-button
            v-if="configItem.lv === 'H5'"
            type="text"
            @click="handleDelItem(configItem.lv, scope.$index)"
            >删除</el-button
          >
          <el-bgy-upload
            v-if="configItem.lv === 'H7'"
            style="display: inline-block"
            title="上传"
            :show-file-list="false"
            :action="action"
            :data="data"
            :preview-info="previewInfo"
            :request-domain="requestDomain"
            :on-change="(val) => handleUploadAttC(scope.$index, val)"
          >
            <el-button v-if="pageType !== 'view'" type="text">上传</el-button>
          </el-bgy-upload>
          <el-button
            v-if="configItem.lv === 'H7' && pageType === 'view'"
            type="text"
            :disabled="!scope.row.ZfileidZt"
            @click="handleDownloadItem(configItem.lv, scope.$index, scope.row)"
            >下载</el-button
          >
          <el-button
            v-if="configItem.lv === 'H7'"
            type="text"
            :disabled="!scope.row.ZfileidZt"
            @click="handlePreviewAttach(configItem.lv, scope.$index, scope.row)"
            >预览</el-button
          >
          <el-button
            v-if="configItem.lv === 'H7' && pageType !== 'view'"
            type="text"
            @click="handleDelItem(configItem.lv, scope.$index)"
            >删除</el-button
          >
          <el-button
            v-if="configItem.lv === 'H8'"
            type="text"
            @click="handleDelItem(configItem.lv, scope.$index)"
            >删除</el-button
          >
        </div>
      </template>
    </el-table-column>
  </el-table>
  <el-bgy-upload
    v-if="configItem.lv === 'H7'"
    ref="uploadRef"
    style="display: none"
    :show-file-list="false"
    :action="action"
    :data="data"
    :preview-info="previewInfo"
    :request-domain="requestDomain"
  />
</template>

<script lang="ts">
//@ts-nocheck
import { defineComponent, ref, computed, inject, watch } from 'vue'
import dayjs from 'dayjs'
import { Search, SortUp, SortDown } from '@element-plus/icons-vue'
import {
  ElTable,
  ElTableColumn,
  ElFormItem,
  ElSelect,
  ElTreeSelect,
  ElOption,
  ElInput,
  ElDatePicker,
  ElCheckbox,
  ElButton,
  ElIcon,
  ElBgyUpload,
  ElMessage,
} from '@element-plus/components'
import { useNamespace } from '@element-plus/hooks'
import { getBgyUploadConfigs } from '../utils'
import type { PropType } from 'vue'
import type { Config, ContractStore } from '../interface'
import type { ContractEditData, ContractUser } from '../interface/contractEdit'

export default defineComponent({
  name: 'ContractEditTable',
  components: {
    ElTable,
    ElTableColumn,
    ElFormItem,
    ElInput,
    ElSelect,
    ElTreeSelect,
    ElOption,
    ElDatePicker,
    ElCheckbox,
    ElButton,
    ElIcon,
    Search,
    SortUp,
    SortDown,
    ElBgyUpload,
  },
  props: {
    configItem: {
      type: Object as PropType<Config>,
      required: true,
    },
    pageType: {
      type: String,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
    formData: {
      type: Object as PropType<ContractEditData>,
      required: true,
    },
    wrapScrollTop: {
      type: Number,
      default: 0,
    },
  },
  emits: [
    'update:formData',
    'handleDelItem',
    'handleTableItemAdd',
    'handleTableItemTransposition',
    'handleTableInputClick',
    'handleTableInputChange',
    'handleTableSelectVisible',
    'handleTableTreeSelectCheck',
    'handleUploadAttC',
  ],
  setup(props: any, { emit }) {
    const ns = useNamespace('contract-edit-table')
    const currFormData = computed<ContractEditData>({
      get() {
        return props.formData
      },
      set(v) {
        emit('update:formData', v)
      },
    })

    // 三方甲指合同二级分类code
    const sfjzht = inject<string>('sfjzht')
    // 三级分类缓存
    const classNo3Cache = inject<string[]>('classNo3Cache')

    const uploadRef = ref<typeof ElBgyUpload | null>(null)
    const env = inject<string>('env')
    const user = inject<ContractUser>('user', { name: '' })
    const ContAttCSetList: any = ref({})
    const handleUploadAttC = (index, val) => {
      if (val.status === 'success') {
        const fieleId = val.response?.data?.id
        ContAttCSetList.value = {
          ContType: '03',
          ZfileidZt: String(fieleId),
          Filename: val.name,
          Ernam: user.bip || '',
          Erdat: dayjs().format('YYYY-MM-DD'),
          file: val,
        }
        ElMessage.success('上传成功')
        emit('handleUploadAttC', ContAttCSetList.value, index)
      }
    }

    const store = inject<ContractStore>('store', {
      domainList: [],
      classList: [],
      contTableEnum: {},
    })
    // 所有阈值
    const domainList = computed(() => store.domainList)

    const ContTableEnum = store.contTableEnum

    /**
     * 合计行自定义计算方法
     * @param params table组件summary-method传的params
     * @param sumProps 需要合计的列的字段集合
     */
    const getSummaries = (params: any, sumProps: string[] = []) => {
      const { columns, data } = params
      const sums: string[] = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (!sumProps.includes(column.property)) return
        const values = data.map((item) => Number(item[column.property]))
        if (!values.every((value) => isNaN(value))) {
          let sum = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sum = sum.toFixed(2)
          sums[index] = `${sum}`
        } else {
          sums[index] = ' '
        }
      })
      return sums
    }

    const handleDownloadItem = (lv: string, index: number, row: any) => {
      const params = {
        name: row.Filename,
        response: { data: { id: row.ZfileidZt } },
      }
      uploadRef.value?.handleDownload(params)
    }
    const handleDelItem = (lv: string, index: number) => {
      emit('handleDelItem', lv, index)
    }
    const handleTableItemAdd = (lv: string, index: number) => {
      emit('handleTableItemAdd', lv, index)
    }
    const handlePreviewAttach = (lv: string, index: number, row: any) => {
      const params = {
        name: row.Filename,
        response: { data: { id: row.ZfileidZt } },
      }
      uploadRef.value?.handlePreview(params)
    }
    const handleTableItemTransposition = (
      lv: string,
      index: number,
      upOrDown: string
    ) => {
      emit('handleTableItemTransposition', lv, index, upOrDown)
    }
    const handleTableInputClick = (
      targetSet: string,
      index: number,
      targetKey: string
    ) => {
      emit('handleTableInputClick', targetSet, index, targetKey)
    }
    const handleTableInputChange = (
      targetSet: string,
      index: number,
      targetKey: string,
      value: string | Event
    ) => {
      emit('handleTableInputChange', targetSet, index, targetKey, value)
    }
    const handleTableSelectVisible = (
      targetSet: string,
      index: number,
      targetKey: string,
      show: boolean
    ) => {
      emit('handleTableSelectVisible', targetSet, index, targetKey, show)
    }
    const handleTableTreeSelectCheck = (
      targetSet: string,
      index: number,
      targetKey: string,
      currNode: any,
      checkedNode: any
    ) => {
      emit(
        'handleTableTreeSelectCheck',
        targetSet,
        index,
        targetKey,
        currNode,
        checkedNode
      )
    }

    const selectRefs: any = []
    const treeSelectRefs: any = []
    const hideDropMenu = () => {
      const selectRef = selectRefs.find((d) => d?.dropMenuVisible)
      const treeSelectRef = treeSelectRefs.find((d) => d?.dropMenuVisible)
      if (selectRef) selectRef.handleClose()
      if (treeSelectRef) treeSelectRef.handleClose()
    }
    let timeStamp = new Date().valueOf()
    watch(
      () => props.wrapScrollTop,
      () => {
        const currTimeStamp = new Date().valueOf()
        const diff = (currTimeStamp - timeStamp) / 1000
        timeStamp = currTimeStamp
        // 每次wrapScrollTop改变在0.8秒内认为是同一次滚动，只执行一次方法
        if (diff > 0.8) {
          hideDropMenu()
        }
      }
    )

    const { action, data, previewInfo, requestDomain } = getBgyUploadConfigs(
      env || '',
      user
    )

    return {
      ns,
      sfjzht,
      classNo3Cache,
      currFormData,
      domainList,
      ContTableEnum,
      uploadRef,
      selectRefs,
      treeSelectRefs,
      action,
      data,
      previewInfo,
      requestDomain,
      ContAttCSetList,
      getSummaries,
      handleUploadAttC,
      handleDownloadItem,
      handleDelItem,
      handleTableItemAdd,
      handlePreviewAttach,
      handleTableItemTransposition,
      handleTableInputClick,
      handleTableInputChange,
      handleTableSelectVisible,
      handleTableTreeSelectCheck,
    }
  },
})
</script>
