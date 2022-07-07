<script lang="ts">
//@ts-nocheck
import { defineComponent, ref, h, watch } from 'vue'
import {
  ElConfigProvider,
  ElInput,
  ElTree,
  ElButton,
  ElDialog,
  ElScrollbar,
} from '@element-plus/components'
import { getDepTreeList } from '../requests'
import type { DepTreeData } from '../interface'

export default defineComponent({
  name: 'ElContractOrgTreeDialog',
  props: {
    value: String,
    orgid: String,
  },
  emits: ['save'],
  setup(props, { emit, expose }) {
    const btnConfig = {
      autoInsertSpace: true,
    }
    const expandedKey = ref<string[]>([])
    const currentKey = ref('')
    const treeData = ref<DepTreeData[]>([])
    let currentData = {}

    // 懒加载获取数据
    const loadData = async (node, resolve) => {
      // 10000000 碧桂园集团
      if (node.level === 0) {
        const res = await getDepTreeList('10000000')
        resolve([res.d])
      } else {
        const res = await getDepTreeList(node.data.Zorgid)
        resolve(res.d.NextLevelSet)
      }
    }

    // 根据目标id找到所有父级id
    const findParents = (treeData: DepTreeData[], id: string) => {
      if (treeData.length === 0) return
      for (let i = 0; i < treeData.length; i++) {
        if (treeData[i].Zorgid === id) {
          return []
        } else {
          if (treeData[i].NextDep) {
            const res = findParents(treeData[i].NextDep || [], id)
            if (res !== undefined) {
              return res.concat(treeData[i].Zorgid)
            }
          }
        }
      }
    }

    const setKeys = () => {
      if (props.value) {
        currentKey.value = props.value
        const parentIds =
          findParents(treeData.value, props.value)?.reverse() || []
        expandedKey.value = [...parentIds]
      }
    }

    const onOpened = async () => {
      setKeys()
    }
    const handleNodeClick = (data: DepTreeData) => {
      currentKey.value = data.Zorgid
      currentData = data
    }

    const dialogVisible = ref(false)
    const open = () => {
      dialogVisible.value = true
    }

    const handleOk = () => {
      emit('save', currentData)
      dialogVisible.value = false
    }

    const treeProps = {
      value: 'Zorgid',
      label: 'Zoorgname',
      children: 'NextLevelSet',
      isLeaf: 'Leaf',
    }
    const query = ref('')
    const treeRef = ref<InstanceType<typeof ElTree>>()

    watch(query, (val) => {
      treeRef.value?.filter(val)
    })
    const filterMethod = (query: string, node: DepTreeData) => {
      if (!query) return true
      return node.Zoorgname?.indexOf(query) !== -1
    }

    expose({
      open,
    })

    return () => {
      return h(
        ElDialog,
        {
          title: '所属组织',
          width: '800px',
          modelValue: dialogVisible.value,
          'onUpdate:modelValue': (val) => (dialogVisible.value = val),
          onOpened,
        },
        {
          default: () => [
            h(ElInput, {
              modelValue: query.value,
              'onUpdate:modelValue': (val) => (query.value = val),
              placeholder: '输入关键字过滤',
              clearable: true,
            }),
            h(
              ElScrollbar,
              {
                style: { height: '400px', overflowY: 'auto' },
              },
              [
                h(ElTree, {
                  ref: treeRef,
                  data: treeData.value,
                  props: treeProps,
                  highlightCurrent: true,
                  defaultExpandedKeys: expandedKey.value,
                  currentNodeKey: currentKey.value,
                  filterNodeMethod: filterMethod,
                  lazy: true,
                  load: loadData,
                  'onNode-click': handleNodeClick,
                }),
              ]
            ),
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
                        disabled: !currentKey.value,
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
