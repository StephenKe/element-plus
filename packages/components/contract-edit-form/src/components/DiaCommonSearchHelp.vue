<script lang="ts">
import { defineComponent, ref, watch, h, withDirectives } from 'vue'
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElTable,
  ElTableColumn,
  ElRadio,
  ElConfigProvider,
  ElMessage,
} from '@element-plus/components'
import { useNamespace } from '@element-plus/hooks'
import { vLoading } from '@element-plus/components/loading/src/directive'
import { commonSearchHelp } from '../requests'
import type { CommonType } from '../interface'
import type { PropType } from 'vue'
import type {
  DialogConfig,
  TableDataRow,
} from '../interface/commonSearchHelpDia'

export default defineComponent({
  name: 'ElContractSearchHelpDialog',
  props: {
    dialogConfigs: {
      type: Object as PropType<DialogConfig>,
      required: true,
    },
    partyList: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  emits: ['save'],
  setup(props, { emit, expose }) {
    const ns = useNamespace('contract-common-search-help')
    const btnConfig = {
      autoInsertSpace: true,
    }
    const dialogVisible = ref(false)
    const searchForm = ref({})

    const defaultRowData = {
      id: '',
    }
    props.dialogConfigs.tableConfigs.columns.forEach((d) => {
      Object.assign(defaultRowData, {
        [d.prop]: '',
      })
    })
    const tableData = ref<TableDataRow[]>([])
    const currentRow = ref<CommonType>({
      ...defaultRowData,
    })
    const selectedData = ref<CommonType[]>([])
    const loading = ref(false)
    const tableRef = ref<InstanceType<typeof ElTable>>()

    const radioModel = ref('')
    watch(radioModel, (val) => {
      currentRow.value =
        tableData.value.find((d) => d.id === val) || defaultRowData
    })
    const handleCurrentChange = (val) => {
      currentRow.value = val
      radioModel.value = val.id
    }
    const handleSelectionChange = (val) => {
      selectedData.value = val
    }
    const handleRowClick = (row) => {
      const index = selectedData.value.findIndex((d) => d.id === row.id)
      if (index !== -1) {
        tableRef.value?.toggleRowSelection(row, false)
      } else {
        tableRef.value?.toggleRowSelection(row, true)
      }
    }

    function randomId() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16) // Number.toString(16)  表示将其转换为16进制
    }

    const onSearch = () => {
      const F4field = props.dialogConfigs.f4field
      let conditions: object[] = []
      if (props.dialogConfigs.searchFormConfigs?.length) {
        conditions = props.dialogConfigs.searchFormConfigs.map((d) => {
          return {
            [d.model]: searchForm.value[d.model],
          }
        })
      }
      const params = {
        F4field,
        conditions,
      }
      loading.value = true
      commonSearchHelp(params).then((res) => {
        loading.value = false
        const result = res.d?.results || []
        const FIELDDATA = JSON.parse(result[0]?.Result || '{}')?.FIELDDATA || []
        if (FIELDDATA.length) {
          tableData.value = FIELDDATA.map((d) => {
            return {
              ...d,
              id: randomId(),
            }
          })
        } else {
          tableData.value = []
        }
      })
    }

    const onOpen = () => {
      tableData.value = []
      searchForm.value = {}
      if (props.dialogConfigs.searchFormConfigs?.length) {
        props.dialogConfigs.searchFormConfigs.forEach((d) => {
          Object.assign(searchForm.value, {
            [d.model]: d.value || '',
          })
        })
      }
      onSearch()
    }
    const handleOk = () => {
      const data = props.dialogConfigs.tableConfigs.multiSelect
        ? selectedData.value
        : currentRow.value
      let canSave = true
      if (props.dialogConfigs.f4field === 'Zseal') {
        for (const item of selectedData.value) {
          const tmpSealId = item.ZSEAL_ID
          if (
            selectedData.value.filter((d) => d.ZSEAL_ID === tmpSealId).length >
            1
          ) {
            ElMessage.error('印章选择重复，请检查')
            canSave = false
            break
          }
        }
      }

      if (['H1Provider', 'NH1Provider'].includes(props.dialogConfigs.f4field)) {
        if (props.partyList?.includes((data as CommonType).NODEID)) {
          ElMessage.error('公司选择重复，请检查')
          canSave = false
        }
      }

      if (canSave) {
        emit(
          'save',
          props.dialogConfigs.field,
          props.dialogConfigs.f4field,
          data
        )
        dialogVisible.value = false
      }
    }
    let firstColKey = 0
    const open = () => {
      dialogVisible.value = true
      firstColKey++
    }
    expose({
      open,
    })

    return () => {
      let searchBar
      const noHiddenSearchConfigs =
        props.dialogConfigs.searchFormConfigs.filter((d) => !d.hidden)
      if (noHiddenSearchConfigs.length) {
        searchBar = h(
          ElForm,
          {
            inline: true,
            model: searchForm.value,
          },
          [
            noHiddenSearchConfigs.map((item) => {
              return h(ElFormItem, { key: item.model, label: item.label }, [
                h(ElInput, {
                  clearable: true,
                  modelValue: searchForm.value[item.model],
                  'onUpdate:modelValue': (val) =>
                    (searchForm.value[item.model] = val),
                }),
              ])
            }),
            h(ElFormItem, { style: 'margin-right: 0' }, [
              h(
                ElButton,
                {
                  type: 'primary',
                  onClick: onSearch,
                },
                '搜索'
              ),
            ]),
          ]
        )
      }
      return h(
        ElDialog,
        {
          class: ns.b(),
          width: props.dialogConfigs.dialogWidth,
          closeOnClickModal: false,
          modelValue: dialogVisible.value,
          'onUpdate:modelValue': (val) => (dialogVisible.value = val),
          onOpen,
        },
        {
          default: () => [
            searchBar,
            withDirectives(
              h(
                ElTable,
                {
                  ref: tableRef,
                  data: tableData.value,
                  rowKey: (row) => row.id,
                  border: true,
                  height: props.dialogConfigs.tableConfigs.tableHeight || '350',
                  elementLoadingText: '加载中',
                  emptyText: '暂无数据',
                  highlightCurrentRow:
                    !props.dialogConfigs.tableConfigs.multiSelect,
                  currentRowKey: currentRow.value.id || '',
                  onCurrentChange: handleCurrentChange,
                  onSelectionChange: handleSelectionChange,
                  onRowClick: handleRowClick,
                },
                [
                  !props.dialogConfigs.tableConfigs.multiSelect
                    ? h(
                        ElTableColumn,
                        {
                          key: firstColKey,
                          align: 'center',
                          width: '55',
                        },
                        {
                          default: (scope) => [
                            h(ElRadio, {
                              class: ns.e('first-radio'),
                              label: scope.row.id,
                              modelValue: radioModel.value,
                              'onUpdate:modelValue': (val) =>
                                (radioModel.value = String(val)),
                            }),
                          ],
                        }
                      )
                    : h(ElTableColumn, {
                        key: firstColKey,
                        type: 'selection',
                        align: 'center',
                        width: '50',
                      }),
                  h(ElTableColumn, {
                    type: 'index',
                    align: 'center',
                    label: '序号',
                    width: '55',
                  }),
                  props.dialogConfigs.tableConfigs.columns.map((item) => {
                    return h(ElTableColumn, {
                      key: item.prop,
                      prop: item.prop,
                      label: item.label,
                      width: item.width,
                    })
                  }),
                ]
              ),
              [[vLoading, loading.value]]
            ),
          ],
          title: () =>
            h(
              'span',
              { class: 'el-dialog__title' },
              props.dialogConfigs.dialogTitle
            ),
          footer: () =>
            h(
              'span',
              {
                class: 'dialog-footer',
              },
              [
                h(
                  ElConfigProvider,
                  {
                    button: btnConfig,
                  },
                  [
                    h(
                      ElButton,
                      {
                        onClick: () => (dialogVisible.value = false),
                      },
                      '取消'
                    ),
                    h(
                      ElButton,
                      {
                        type: 'primary',
                        disabled: props.dialogConfigs.tableConfigs.multiSelect
                          ? !selectedData.value.length
                          : !currentRow.value.id,
                        onClick: handleOk,
                      },
                      '确认'
                    ),
                  ]
                ),
              ]
            ),
        }
      )
    }
  },
})
</script>
