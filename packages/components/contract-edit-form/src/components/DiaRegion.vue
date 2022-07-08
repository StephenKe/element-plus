<script lang="ts">
//@ts-nocheck
import { defineComponent, ref, h } from 'vue'
import {
  ElConfigProvider,
  ElInput,
  ElTreeV2,
  ElButton,
  ElDialog,
} from '@element-plus/components'
import { getRegionList } from '../requests'
import type {
  TreeNode,
  TreeNodeData,
} from '@element-plus/components/tree-v2/src/types'
import type { PropType } from 'vue'
import type { ContractEditData } from '../interface/contractEdit'

export default defineComponent({
  name: 'ElContractRegionDialog',
  props: {
    value: String,
    formData: {
      type: Object as PropType<ContractEditData>,
      required: true,
    },
    regionValue: String,
    projectValue: String,
    zxmzjValue: String,
  },
  emits: ['save'],
  setup(props, { emit, expose }) {
    const btnConfig = {
      autoInsertSpace: true,
    }
    const isParam = ref('')
    const titleArr = {
      region: '区域名称',
      project: '项目名称',
      stage: '分期名称',
      build: '楼栋名称',
    }
    const title = ref('')
    const treeData = ref<any>([])
    const currentKey = ref('')
    const currentId = ref('')
    const regionKey = ref('')
    const regionId = ref('')
    const dialogVisible = ref(false)
    const loading = ref(false)
    const open = async (params) => {
      title.value = titleArr[params]
      dialogVisible.value = true
      isParam.value = params
      loading.value = true
      if (isParam.value === 'region') {
        let lv = '1'
        let id = ''
        let expand = 'children'
        if (props.formData.Znodeid === '10000000' && !props.formData.Zssqy) {
          id = '10000002'
        } else if (
          props.formData.Znodeid !== '10000000' &&
          !props.formData.Zssqy
        ) {
          id = props.formData.Znodeid
        } else if (
          props.formData.Znodeid !== '10000000' &&
          props.formData.Zssqy
        ) {
          lv = '2'
          id = props.formData.Zssqy
          expand = ''
        }
        const result = await getRegionList(lv, id, expand)
        treeData.value = result?.d?.children || []
        if (props.formData.Znodeid !== '10000000' && props.formData.Zssqy) {
          treeData.value = [result?.d]
        }
      } else if (isParam.value === 'project') {
        let result
        // eslint-disable-next-line no-constant-condition
        if (props.formData.ZconCategoryNo === '10') {
          // 成本类合同搜索项目
          result = await getRegionList('1', '', 'children/children')
        } else {
          result = await getRegionList('2', props.regionValue)
        }
        treeData.value = result?.d?.children || []
      } else if (isParam.value === 'stage') {
        const result = await getRegionList('3', props.projectValue)
        treeData.value = result?.d?.children || []
      } else if (isParam.value === 'build') {
        // 查询级联楼栋信息 todo
        const result = await getRegionList('4', props.zxmzjValue)
        treeData.value = result?.d?.children || []
      }

      changeLabel(treeData.value)
      loading.value = false
      currentKey.value = ''
      currentId.value = ''
    }
    expose({
      open,
    })

    // 递归处理label
    const changeLabel = (item) => {
      if (item && item.length > 0) {
        item.map((childrenItem) => {
          childrenItem.label = `${childrenItem.id}-${childrenItem.label}`
          if (childrenItem.children && childrenItem.children.length > 0) {
            changeLabel(childrenItem.children)
          }
          return childrenItem
        })
      }
    }

    const handleNodeClick = (data: TreeNodeData) => {
      if (
        data.level !== '3' &&
        isParam.value === 'project' &&
        props.formData.ZconCategoryNo === '10'
      ) {
        currentKey.value = ''
        currentId.value = ''
      } else {
        currentKey.value = data.label.split('-')[1]
        currentId.value = data.id
        if (data.level === '3') {
          // 选择项目后，回写区域信息
          regionKey.value = treeData.value
            .filter((item) => {
              return item.id === data.idUp
            })[0]
            .label.split('-')[1]
          regionId.value = data.idUp
        }
      }
    }
    const handleOk = () => {
      const param = {
        id: currentId.value,
        label: currentKey.value,
        param: isParam.value,
        region: {
          regionKey: regionKey.value,
          regionId: regionId.value,
        },
      }
      emit('save', param)
      dialogVisible.value = false
    }

    const query = ref('')
    const treeRef = ref<InstanceType<typeof ElTreeV2>>()

    const onQueryChanged = (query: any) => {
      // TODO: fix typing when refactor tree-v2
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      treeRef.value?.filter(query)
    }
    const filterMethod = (query: string, node: TreeNode) => {
      return node.label?.indexOf(query) !== -1
    }

    return () => {
      return h(
        ElDialog,
        {
          width: '800px',
          modelValue: dialogVisible.value,
          'onUpdate:modelValue': (val) => (dialogVisible.value = val),
        },
        {
          title: () => h('span', { class: 'el-dialog__title' }, title.value),
          default: () => [
            h(ElInput, {
              modelValue: query.value,
              'onUpdate:modelValue': (val) => (query.value = val),
              placeholder: '输入关键字过滤',
              onInput: onQueryChanged,
            }),
            h(ElTreeV2, {
              ref: treeRef,
              data: treeData.value,
              height: 400,
              highlightCurrent: true,
              emptyText: '暂无数据',
              key: isParam.value,
              currentNodeKey: currentKey.value,
              filterMethod,
              'onNode-click': handleNodeClick,
            }),
          ],
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
                      ['取消']
                    ),
                    h(
                      ElButton,
                      {
                        type: 'primary',
                        onClick: handleOk,
                      },
                      ['确认']
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
