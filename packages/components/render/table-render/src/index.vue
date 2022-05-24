<template>
  <div :class="ns.b()">
    <!-- 搜索区域 -->
    <el-card v-if="searchItem.length" :class="ns.b('search')" :shadow="shadow">
      <el-form
        ref="formRef"
        inline
        :size="size"
        :label-width="labelWidth"
        :model="searchForm"
        :rules="searchFormRules"
      >
        <transition v-for="(item, index) in searchItem" :key="item.prop">
          <el-form-item
            v-show="searchExpanded || index < expandSize"
            :label="`${item.label}${item.colon ?? colon ? '：' : ''}`"
            :label-width="item.labelWidth || labelWidth"
            :prop="item.prop"
            :size="size"
            :class="item.prop"
            :style="formItemStyle(item)"
          >
            <template v-if="item.type === 'slot'">
              <slot
                v-if="$slots[item.prop]"
                :name="item.prop"
                :form="searchForm"
                :item="item"
                :index="index"
              ></slot>
            </template>
            <el-item-range-render
              v-else-if="item.range"
              v-model="searchForm"
              v-bind="item"
            ></el-item-range-render>
            <el-item-render
              v-else
              v-model="searchForm[item.prop]"
              v-bind="item"
            ></el-item-render>
          </el-form-item>
        </transition>
        <el-form-item :style="searchButtonStyle">
          <el-button
            v-if="searchExpandVisible"
            type="text"
            @click="handleExpand"
          >
            {{ searchExpanded ? '收起' : '展开' }}
            <el-icon class="el-icon--right">
              <component :is="searchExpanded ? 'arrow-up' : 'arrow-down'" />
            </el-icon>
          </el-button>
          <el-button @click="handleSearchReset">重置</el-button>
          <el-button type="primary" @click="handleSearchSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据区域 -->
    <el-card :class="ns.b('view')" :shadow="shadow">
      <el-row>
        <el-col v-if="$slots.bodyLeft" :span="bodyLeftSpan">
          <slot name="bodyLeft"></slot>
        </el-col>
        <el-col :span="bodyRightSpan">
          <!-- 操作栏 -->
          <el-row v-if="actionVisible" :class="ns.b('action')">
            <el-col :xs="24" :sm="12" :class="ns.be('action', 'left')">
              <!-- 操作栏左栏 -->
              <template
                v-for="(btn, i) in actionLeftButton"
                :key="`action-left-btn-${i}`"
              >
                <el-button
                  v-if="buttonVisible(btn)"
                  :size="btn.size"
                  :type="btn.type"
                  :plain="btn.plain"
                  :round="btn.round"
                  :circle="btn.circle"
                  :loading="btn.loading"
                  :icon="btn.icon"
                  :disabled="buttonDisabled(btn)"
                  @click="handleActionClick(btn)"
                >
                  {{ btn.label }}
                </el-button>
              </template>
              <slot name="actionLeft"></slot>
            </el-col>
            <el-col :xs="24" :sm="12" :class="ns.be('action', 'right')">
              <!-- 操作栏右栏 -->
              <template
                v-for="(btn, i) in actionRightButton"
                :key="`action-right-btn-${i}`"
              >
                <el-button
                  v-if="buttonVisible(btn)"
                  :size="btn.size"
                  :type="btn.type"
                  :plain="btn.plain"
                  :round="btn.round"
                  :circle="btn.circle"
                  :loading="btn.loading"
                  :icon="btn.icon"
                  :disabled="buttonDisabled(btn)"
                  @click="handleActionClick(btn)"
                >
                  {{ btn.label }}
                </el-button>
              </template>
              <slot name="actionRight"></slot>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <!-- 表格 -->
              <el-table
                v-bind="tableAttrs"
                ref="tableRef"
                :class="ns.b('table')"
                :data="tableData"
                v-on="tableEmitsBinding"
              >
                <el-table-column
                  v-for="col in tableColumn"
                  :key="col.prop"
                  v-bind="col"
                  :min-width="col.width"
                  width="auto"
                >
                  <!-- 插槽列 -->
                  <template v-if="hasOwn(col, 'slot')" #default="scopedData">
                    <!-- 内置功能，slot 为 operation 时 -->
                    <template v-if="col.slot === 'operation'">
                      <template v-for="(btn, i) in col.operation">
                        <el-dropdown
                          v-if="
                            btn.children &&
                            btn.children.length &&
                            buttonVisible(btn, scopedData)
                          "
                          :key="`operation-dropdown-btn-${i}`"
                          style="margin: 0 10px"
                          @command="(cmd) => handleActionClick(cmd, scopedData)"
                        >
                          <el-button
                            :size="btn.size"
                            :type="btn.type"
                            :plain="btn.plain"
                            :round="btn.round"
                            :circle="btn.circle"
                            :loading="btn.loading"
                            :icon="btn.icon"
                            :disabled="buttonDisabled(btn, scopedData)"
                          >
                            {{ btn.label }}
                          </el-button>
                          <template #dropdown>
                            <el-dropdown-menu>
                              <el-dropdown-item
                                v-for="childBtn in btn.children"
                                :key="childBtn.label"
                                :disabled="buttonDisabled(childBtn, scopedData)"
                                :command="childBtn"
                              >
                                {{ childBtn.label }}
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </template>
                        </el-dropdown>
                        <el-button
                          v-else-if="buttonVisible(btn, scopedData)"
                          :key="`operation-btn-${i}`"
                          :size="btn.size"
                          :type="btn.type"
                          :plain="btn.plain"
                          :round="btn.round"
                          :circle="btn.circle"
                          :loading="btn.loading"
                          :icon="btn.icon"
                          :disabled="buttonDisabled(btn, scopedData)"
                          @click="handleActionClick(btn, scopedData)"
                        >
                          {{ btn.label }}
                        </el-button>
                      </template>
                    </template>
                    <!-- 内置功能，slot 为 link 时 -->
                    <template v-else-if="col.slot === 'link'">
                      <el-button
                        type="text"
                        @click="col.onClick && col.onClick(scopedData)"
                      >
                        {{ scopedData.row[col.prop] }}
                      </el-button>
                    </template>
                    <template v-else>
                      <slot
                        :name="isString(col.slot) ? col.slot : col.prop"
                        v-bind="scopedData"
                      ></slot>
                    </template>
                  </template>
                </el-table-column>
                <template v-if="$slots.append" #append>
                  <slot
                    name="append"
                    :tableData="tableData"
                    :pagination="paginationAttr"
                  ></slot>
                </template>
              </el-table>
              <!-- 状态栏 -->
              <el-row :class="ns.b('status')">
                <el-col
                  :xs="24"
                  :sm="24"
                  :md="6"
                  :class="ns.be('status', 'left')"
                >
                  <!-- 状态栏左栏 -->
                  <slot name="statusLeft" />
                </el-col>
                <el-col
                  :xs="24"
                  :sm="24"
                  :md="18"
                  :class="ns.be('status', 'right')"
                >
                  <!-- 状态栏右栏 -->
                  <slot name="statusRight" />
                  <!-- 分页插槽，如未提供，使用内置默认 -->
                  <slot
                    v-if="pagerVisible"
                    name="pagination"
                    :pagination="paginationAttr"
                  >
                    <!-- 分页区域 -->
                    <el-pagination
                      v-model:currentPage="paginationAttr.currentPage"
                      v-model:page-size="paginationAttr.pageSize"
                      v-bind="paginationAttr"
                      v-on="paginationEmitsBinding"
                    />
                  </slot>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>

    <!-- 编辑弹窗功能 -->
    <component
      :is="dialogComponent"
      v-if="dialogVisible"
      v-model="dialogVisible"
      v-bind="dialogProps"
    >
      <el-form-render
        ref="editFormRef"
        v-model="editForm"
        :form-item="formItem"
        :rules="editFormRules"
        :reset-visible="false"
        :submit-visible="false"
        :row-key="rowKey"
        :row-size="formRowSize"
        :size="size"
        :label-width="labelWidth"
        :colon="colon"
        @on-submit="handleSubmit"
        @validate-fields-error="handleValidateFieldsError"
      ></el-form-render>
      <template #footer>
        <el-button type="default" @click="triggerReset">取消</el-button>
        <el-button type="primary" :loading="loading" @click="triggerSubmit">
          提交
        </el-button>
      </template>
    </component>
  </div>
</template>

<script lang="ts">
//@ts-nocheck
import { defineComponent, ref, computed, watch, onBeforeMount } from 'vue'
import {
  NOOP,
  isFunction,
  hasOwn,
  isString,
  camelize,
  isArray,
} from '@vue/shared'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import _ from 'lodash'
import { useNamespace } from '@element-plus/hooks'
import {
  ElCard,
  ElTable,
  ElTableColumn,
  ElButton,
  ElPagination,
  ElRow,
  ElCol,
  ElIcon,
  ElForm,
  ElFormItem,
  ElDialog,
  ElDrawer,
  ElMessage,
  ElMessageBox,
  ElLoading,
  // ElFormRender,
  ElItemRender,
  ElItemRangeRender,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
} from '@element-plus/components'
import { debugWarn } from '@element-plus/utils'
import { isBoolean as isBool, isNumber } from '@element-plus/utils'
import { isEqual } from 'lodash-unified'
import { merge } from 'lodash'
import tableProps from '@element-plus/components/table/src/table/defaults'
import { paginationEmits } from '@element-plus/components/pagination/src/pagination'
import ElFormRender from '../../form-render'
import { useForm, useHttp, usePagination } from './hooks'
import {
  tableRenderProps,
  tableRenderEmits,
  tableEmits,
  ActionType,
} from './index'
import type { SetupContext } from 'vue'
import type { ItemRenderProps } from '@element-plus/components'
import type {
  TableRenderProps,
  TableRenderColumn,
  TableRenderButtonProps,
} from './index'
import type { CrudHttpRequestOptions } from './request.type'

const COMPONENT_NAME = 'ElTableRender'
const tableDebugWarn = _.curry(debugWarn)(COMPONENT_NAME)
const mapSetToArray = (map: Map<number, Set<any>>) => {
  const arr = []
  for (const set of map.values()) {
    arr.push(...set)
  }
  return arr
}

export default defineComponent({
  name: COMPONENT_NAME,
  components: {
    ElCard,
    ElTable,
    ElTableColumn,
    ElButton,
    ElPagination,
    ElRow,
    ElCol,
    ElIcon,
    ElForm,
    ElFormItem,
    ArrowDown,
    ArrowUp,
    ElFormRender,
    ElItemRender,
    ElItemRangeRender,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
  },
  props: tableRenderProps,
  emits: tableRenderEmits,
  setup(props: TableRenderProps, { expose, emit, attrs, slots }: SetupContext) {
    const ns = useNamespace('table-render')
    const size = ref(props.size)
    const colon = ref(props.colon)
    const rowKey = ref(props.rowKey)
    const key = computed(() =>
      isFunction(rowKey.value) ? rowKey.value() : rowKey.value
    )
    const dialogVisible = ref(false)
    const loading = ref(false)
    const bodyRightSpan = computed(() =>
      slots.bodyLeft ? 24 - props.bodyLeftSpan : 24
    )

    const { insertApi, selectApi, updateApi, deleteApi } = useHttp(
      props.requests
    )

    // dialog
    const editFormRef = ref<InstanceType<typeof ElFormRender>>()
    const dialogTitle = computed(() => (editForm[key.value] ? '编辑' : '新增'))
    const dialogComponent = computed(() =>
      props.dialogType === 'dialog' ? ElDialog : ElDrawer
    )
    const dialogProps = computed(() => {
      const commonProps = {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        title: dialogTitle.value,
      }
      if (props.dialogType === 'drawer') {
        return {
          ...commonProps,
          direction: props.dialogDirection,
          customClass: 'el-crud-drawer',
          size: props.dialogWidth,
        }
      } else {
        return {
          ...commonProps,
          customClass: 'el-crud-dialog',
          draggable: true,
          width: props.dialogWidth,
        }
      }
    })
    const formRowSize = computed(() => props.formRowSize)
    const {
      formItem,
      formData: editForm,
      formRules: editFormRules,
      resetFormData: resetEditFormData,
    } = useForm(props.formItem)
    const triggerReset = () => {
      editFormRef.value?.onReset()
      dialogVisible.value = false
      emit('form-reset', editForm)
    }
    const triggerSubmit = () => {
      loading.value = true
      editFormRef.value?.onSubmit()
    }
    // 表单提交
    const handleSubmit = (formData, stopLoading) => {
      const isUpdate = key.value in formData
      const caller = isUpdate ? updateApi : insertApi
      caller(formData)
        .then((result) => {
          emit('form-submit', editForm, result)
          dialogVisible.value = false
          handleSearchSubmit()
          ElMessage.success(`${dialogTitle.value}成功`)
        })
        .finally(() => {
          loading.value = false
          stopLoading()
        })
    }
    const handleValidateFieldsError = (fields) => {
      loading.value = false
      emit('validate-fields-error', fields)
    }

    watch(
      () => dialogVisible.value,
      (val) => {
        if (!val) {
          loading.value = false
          resetEditFormData()
        }
      }
    )

    // search
    const formRef = ref<InstanceType<typeof ElForm>>()
    const {
      formItem: searchItem,
      formData: searchForm,
      formRules: searchFormRules,
      resetFormData: resetSearchFormData,
    } = useForm(props.searchItem)
    const widthPercent = computed<number>(
      () => +(100 / props.rowSize).toFixed(2)
    )
    const labelWidth = computed(() => props.labelWidth)
    const searchExpanded = ref(false)
    const searchExpandVisible = computed(
      () => searchItem.value.length > props.expandSize
    )
    const searchButtonStyle = computed(() => ({
      width: `${widthPercent.value}%`,
    }))
    const formItemStyle = (col: ItemRenderProps) => {
      // 跨度值不能大于 rowSize
      const colSpan = Math.min(col.colSpan, props.rowSize)
      return {
        flex: `0 0 ${widthPercent.value * colSpan}%`,
        maxWidth: `${widthPercent.value * colSpan}%`,
      }
    }

    // 搜索栏字段展示或收起
    const handleExpand = () => {
      searchExpanded.value = !searchExpanded.value
      emit('search-expanded', searchExpanded.value)
    }

    // 表单查询重置
    const handleSearchReset = () => {
      // 清空 searchForm 属性
      resetSearchFormData()
      formRef.value?.resetFields()
      emit('search-reset', searchForm)
    }

    // 表单查询提交
    const handleSearchSubmit = async () => {
      await fetchPageData()
      emit('search-submit', searchForm)
    }

    onBeforeMount(() => {
      if (isArray(props.searchItem)) {
        props.searchItem.forEach((item: ItemRenderProps) => {
          if (item.prop) {
            searchForm[item.prop] = ''
          }
          if (item.start) {
            searchForm[item.start] = ''
          }
          if (item.end) {
            searchForm[item.end] = ''
          }
        })
      }
    })

    // table
    const tableRef = ref<InstanceType<typeof ElTable>>()
    // el-table attrs
    const tableAttrs = computed(() => {
      const mergeAttrsAndProps = merge(props, attrs)
      const tblAttrs = {}
      for (const key in mergeAttrsAndProps) {
        const camelizeKey = camelize(key)
        if (camelizeKey in tableProps) {
          tblAttrs[camelizeKey] = mergeAttrsAndProps[key]
        }
      }
      return tblAttrs
    })

    /**
     * 记录选择的表格行数据
     * key 为页码
     * value 为该页选中的数据项，切换每页显示数量时将清空 map
     */
    const selectionMap = new Map<number, Set<any>>()
    const tableData = ref<Array<any>>([])
    const tableColumn = computed<Array<TableRenderColumn>>(() =>
      props.tableColumn.map((col: TableRenderColumn) => {
        // 设置了 slot 的列
        if (hasOwn(col, 'slot')) {
          // 如果是操作列，赋值一些默认属性
          if (col.slot === 'operation') {
            col.label = col.label || '操作'
            col.fixed = col.fixed ?? 'right'
            col.operation = (col.operation || []).map(
              (e: TableRenderButtonProps) => {
                e.type = e.type || 'text'
                e.size = e.size || size.value || 'small'
                return e
              }
            )
          } else if (col.slot === 'link') {
            col.onClick = col.onClick || NOOP
          }
        }
        return col
      })
    )

    const handlerActionButton = (e: TableRenderButtonProps) => {
      // 有使用了内置的批量删除功能，但没有找到表格列 type 为 selection的时候
      if (
        e.action === ActionType.Deletes &&
        !tableColumn.value.some((e) => e.type === 'selection')
      ) {
        tableDebugWarn(
          '表格中未找到属性为 type = selection 的列，因此不能使用 action = deletes'
        )
      }
      e.type = e.type || 'primary'
      e.size = e.size || size.value || 'small'
      return e
    }
    const actionLeftButton = computed(() =>
      props.actionLeftButton.map(handlerActionButton)
    )
    const actionRightButton = computed(() =>
      props.actionRightButton.map(handlerActionButton)
    )
    const actionVisible = computed(
      () =>
        actionLeftButton.value.length ||
        actionRightButton.value.length ||
        slots.actionLeft ||
        slots.actionRight
    )

    // 删除方法
    const onDelete = (rows: any) => {
      const loadingInstance = ElLoading.service()
      const params: Record<string, any> = {
        [key.value]: [].concat(rows).map((row) => row[key.value]),
      }
      deleteApi(params)
        .then(() => {
          ElMessage.success('删除成功')
          handleSearchSubmit()
        })
        .catch(() => {
          ElMessage.error('删除失败')
        })
        .finally(() => {
          loadingInstance.close()
        })
    }

    const confirmDelete = (row: any) => {
      ElMessageBox.confirm('确认要删除此行吗？', '确认提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          onDelete(row)
        })
        .catch(() => {
          // nothing for canncel
        })
    }

    const confirmDeletes = () => {
      if (!selectionMap.size) {
        ElMessage.warning('请至少选择一行')
        return
      }
      const selectRows = mapSetToArray(selectionMap)
      ElMessageBox.confirm(
        `确认删除选中的 ${selectRows.length} 行吗？`,
        '确认提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          onDelete(selectRows)
        })
        .catch(NOOP)
    }

    const handleActionClick = (
      self: TableRenderButtonProps,
      scopedData?: any
    ) => {
      // 内置的功能
      switch (self.action) {
        case ActionType.Insert: // 新增
          dialogVisible.value = true
          break
        case ActionType.Delete: // 删除
          if (scopedData) {
            confirmDelete(scopedData.row)
          }
          break
        case ActionType.Deletes: // 批量删除
          confirmDeletes()
          break
        case ActionType.Update: // 更新
          if (scopedData) {
            dialogVisible.value = true
            Object.assign(editForm, scopedData.row)
          }
          break
        default:
          break
      }
      if (isFunction(self.onClick)) {
        // 选中的行数据
        const selectRows = mapSetToArray(selectionMap)
        /**
         * 如果提供了 click 函数，则传递给该方法的参数有
         * 1. 当前页数据
         * 2. 选中的行数据
         * 3. 当前行的数据
         */
        self.onClick(tableData.value, selectRows, scopedData)
      }
    }

    const handleSelect = (selection: any[], row?: any) => {
      if (selection.length) {
        const set = new Set()
        selection.forEach((item) => {
          set.add(item)
        })
        selectionMap.set(paginationAttr.currentPage as number, set)
      } else {
        selectionMap.delete(paginationAttr.currentPage as number)
      }
      emit('select', selection, row)
    }

    const handleSelectAll = (selection: any[]) => {
      handleSelect(selection)
      emit('select-all', selection)
    }

    const throwUpEmits = (emits: string[]) =>
      emits.reduce((emits, emitName) => {
        emits[emitName] = (...args: any) => emit(emitName, ...args)
        return emits
      }, {})

    const tableThrowUpEmits = throwUpEmits(tableEmits)

    // el-table 事件对象
    const tableEmitsBinding = {
      ...tableThrowUpEmits,
      select: handleSelect,
      'select-all': handleSelectAll,
    }

    // pagination
    const {
      pager: paginationAttr,
      visible: pagerVisible,
      handleSizeChange,
      handleCurrentChange,
    } = usePagination(props.pagination)

    const paginationThrowUpEmits = throwUpEmits(Object.keys(paginationEmits))

    // el-pagination 事件
    const paginationEmitsBinding = {
      ...paginationThrowUpEmits,
      'size-change': handleSizeChange,
      'current-change': handleCurrentChange,
    }

    watch(
      () => paginationAttr.pageSize,
      () => {
        // 页展示数量切换时，清空原选中的所有行数据
        selectionMap.clear()
      }
    )

    const fetchPageData = async () => {
      const { currentPage, pageSize } = paginationAttr
      await selectApi({
        [props.props.currentPage]: currentPage,
        [props.props.pageSize]: pageSize,
        ...searchForm,
      } as Record<string, any>).then((result: any) => {
        paginationAttr.total = _.result(result, props.props.total) // 总记录数
        tableData.value = wrapperTableData(
          _.result(result, props.props.records, [])
        )

        // 如果记录之前选中的项
        if (props.persistent) {
          const selectionRows = selectionMap.get(
            paginationAttr.currentPage as number
          )
          if (isArray(selectionRows)) {
            tableData.value.forEach((row: any) => {
              selectionRows.forEach((selectionRow: any) => {
                if (isEqual(row, selectionRow)) {
                  tableRef.value!.toggleRowSelection(row, true)
                }
              })
            })
          }
        } else {
          selectionMap.clear()
        }
      })
    }

    const wrapperTableData = (data: any): object[] => {
      let wrapperData = data.slice()
      if (isFunction(props.wrapperTableData)) {
        wrapperData = props.wrapperTableData(data)
      }
      return wrapperData.slice(0, paginationAttr.pageSize)
    }

    watch(
      () => tableData.value.length,
      (val) => {
        if (val > (paginationAttr.pageSize as number)) {
          tableData.value = wrapperTableData(tableData.value)
        }
      }
    )

    watch(
      () => [paginationAttr.currentPage, paginationAttr.pageSize],
      fetchPageData,
      {
        immediate: props.autoSearch,
      }
    )

    watch((props.requests as CrudHttpRequestOptions)?.select?.params, () => {
      if (props.autoSearch) {
        handleSearchSubmit()
      }
    })

    // 控制按钮是否展示
    const buttonVisible = (
      btn: TableRenderButtonProps,
      scopedData?: object
    ) => {
      if (isBool(btn.visible)) return btn.visible

      if (isFunction(btn.visible))
        return btn.visible(btn, scopedData || tableData.value)

      // 默认展示
      return true
    }

    // 控制按钮是否禁用
    const buttonDisabled = (
      btn: TableRenderButtonProps,
      scopedData?: object
    ) => {
      if (isBool(btn.disabled)) return btn.disabled

      if (isFunction(btn.disabled))
        return btn.disabled(btn, scopedData || tableData.value)

      // 默认不禁用
      return false
    }

    // 根据 rowKey 从 selectionMap 找所在位置
    const findIndexInMapByRowKey = (key: any): number[] => {
      const indexs: number[] = []
      for (const [pageNumber, rows] of selectionMap.entries()) {
        let rowIndex = -1
        const has = Array.from(rows).some((row, index) => {
          if (row[rowKey.value as string] === key) {
            rowIndex = index
            return true
          }
          return false
        })
        // 找到了
        if (has) {
          indexs[0] = pageNumber
          indexs[1] = rowIndex
          break
        }
      }
      return indexs
    }

    /**
     * 用于多选表格，清空用户的选择
     * @params rowKeys rowKey 指定的数据 行ID 集合，为空时则全部清空
     */
    const clearSelection = (rowKeys: any[]) => {
      if (isArray(rowKeys) && rowKeys.length) {
        rowKeys.forEach((key: any) => {
          const [pageNumber, rowIndex] = findIndexInMapByRowKey(key)
          if (isNumber(pageNumber) && isNumber(rowIndex)) {
            const selectionDataOfPage = selectionMap.get(pageNumber) as Set<any>
            if (selectionDataOfPage.size) {
              const row = Array.from(selectionDataOfPage)[rowIndex]
              selectionDataOfPage.delete(row)
              tableRef.value!.toggleRowSelection(row, false)
              if (selectionDataOfPage.size <= 0) {
                selectionMap.delete(pageNumber)
              }
            }
          }
        })
      } else {
        tableRef.value!.clearSelection()
        selectionMap.clear()
      }
    }

    /**
     * 返回当前选中的行
     */
    const getSelectionRows = () => mapSetToArray(selectionMap)

    /**
     * 设置行选是否选中
     */
    const toggleRowSelection = (row, selected) => {
      // 获取当前页 selection
      const selection = Array.from(
        selectionMap.get(paginationAttr.currentPage as number) || []
      )
      const index = selection.indexOf(row)
      const included = index > -1

      const addRow = () => {
        selection.push(row)
        selectionMap.set(
          paginationAttr.currentPage as number,
          new Set(selection)
        )
      }

      const removeRow = () => {
        selection.splice(index, 1)
        selectionMap.set(
          paginationAttr.currentPage as number,
          new Set(selection)
        )
      }

      if (typeof selected === 'boolean') {
        if (selected && !included) {
          addRow()
        } else if (!selected && included) {
          removeRow()
        }
      } else {
        if (included) {
          removeRow()
        } else {
          addRow()
        }
      }
      tableRef.value?.toggleRowSelection(row, selected)
    }

    expose({
      // 清空选中行
      clearSelection,
      // 获取选中行
      getSelectionRows,
      // 设置行选是否选中
      toggleRowSelection,
      // 搜索查询事件
      triggerSearch: handleSearchSubmit,
      // 表格数据
      tableData: computed(() => tableData.value),
      // 分页信息
      pagination: paginationAttr,
    })

    return {
      ns,
      size,
      colon,
      loading,
      hasOwn,
      isString,
      bodyRightSpan,

      // 查询区
      formRef,
      labelWidth,
      searchItem,
      searchForm,
      searchFormRules,
      searchExpandVisible,
      searchExpanded,
      searchButtonStyle,
      formItemStyle,
      handleExpand,
      handleSearchReset,
      handleSearchSubmit,

      // 操作栏
      actionVisible,
      actionLeftButton,
      actionRightButton,

      // 弹窗编辑
      rowKey,
      dialogComponent,
      dialogProps,
      dialogVisible,
      editFormRef,
      formItem,
      editForm,
      editFormRules,
      formRowSize,
      triggerReset,
      triggerSubmit,
      handleSubmit,
      handleValidateFieldsError,

      // table
      tableAttrs,
      tableEmitsBinding,
      tableData,
      tableRef,
      tableColumn,
      handleActionClick,

      // pagination
      paginationAttr,
      pagerVisible,
      paginationEmitsBinding,

      buttonVisible,
      buttonDisabled,
    }
  },
})
</script>
