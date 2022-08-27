// @ts-nocheck
import {
  inject,
  nextTick,
  computed,
  watch,
  ref,
  reactive,
  shallowRef,
  triggerRef,
  unref,
} from 'vue'
import { isObject } from '@vue/shared'
import lodashDebounce from 'lodash/debounce'
import isEqual from 'lodash/isEqual'
import {
  UPDATE_MODEL_EVENT,
  CHANGE_EVENT,
  EVENT_CODE,
} from '@element-plus/constants'
import {
  scrollIntoView,
  isKorean,
  getValueByPath,
  isFunction,
} from '@element-plus/utils'
import { useLocale, useSize } from '@element-plus/hooks'
import { elFormKey, elFormItemKey } from '@element-plus/tokens'

import type { ComponentPublicInstance } from 'vue'
import type ElTooltip from '@element-plus/components/tooltip'
import type ElTree from '@element-plus/components/tree'
import type { ElFormContext, ElFormItemContext } from '@element-plus/tokens'
import type { TreeSelectPropsType } from './tree-select'
import type { QueryChangeCtx } from './token'
import type {
  TreeNodeData,
  TreeKey,
} from '@element-plus/components/tree/src/tree.type'

export function useSelectStates(props: TreeSelectPropsType) {
  const { t } = useLocale()
  return reactive({
    options: new Map(), // todo: 干掉
    cachedOptions: new Map(),
    createdLabel: null,
    createdSelected: false,
    selected: props.multiple ? [] : ({} as any),
    inputLength: 20,
    inputWidth: 0,
    initialInputHeight: 0,
    optionsCount: 0,
    filteredOptionsCount: 0,
    visible: false,
    softFocus: false,
    selectedLabel: '',
    hoverIndex: -1, // TODO:当前选中的树节点
    query: '',
    previousQuery: null,
    inputHovering: false,
    cachedPlaceHolder: '',
    currentPlaceholder: t('el.treeSelect.placeholder'),
    menuVisibleOnFocus: false,
    isOnComposition: false,
    isSilentBlur: false,
    prefixWidth: 0,
    tagInMultiLine: false,
  })
}

type States = ReturnType<typeof useSelectStates>

export const useSelect = (props: TreeSelectPropsType, states: States, ctx) => {
  const { t } = useLocale()

  // template refs
  const reference = ref<ComponentPublicInstance<{
    focus: () => void
    blur: () => void
    input: HTMLInputElement
  }> | null>(null)
  const input = ref<HTMLInputElement | null>(null)
  const tooltipRef = ref<InstanceType<typeof ElTooltip> | null>(null)
  const tags = ref<HTMLElement | null>(null)
  const treeSelectWrapper = ref<HTMLElement | null>(null)
  const treeRef = ref<InstanceType<typeof ElTree> | null>(null) // 树形结构 ref
  const scrollbar = ref<{
    handleScroll: () => void
  } | null>(null)
  const hoverOption = ref(-1)
  const queryChange = shallowRef<any>({ query: '' })
  const defaultCheckedKeys = ref<TreeKey[]>(props.defaultCheckedKeys)

  const treeLabelProp = computed(() =>
    props.props ? props.props['label'] : 'label'
  )
  const treeChildrenProp = computed(() =>
    props.props ? props.props['children'] : 'children'
  )
  const treeDisabledProp = computed(() =>
    props.props ? props.props['disabled'] : 'disabled'
  )

  // inject
  const elForm = inject(elFormKey, {} as ElFormContext)
  const elFormItem = inject(elFormItemKey, {} as ElFormItemContext)

  const readonly = computed(
    () => !props.filterable || props.multiple || !states.visible
  )

  const selectDisabled = computed(() => props.disabled || elForm.disabled)

  const showClose = computed(() => {
    const hasValue = props.multiple
      ? Array.isArray(props.modelValue) && props.modelValue.length > 0
      : props.modelValue !== undefined &&
        props.modelValue !== null &&
        props.modelValue !== ''

    const criteria =
      props.clearable &&
      !selectDisabled.value &&
      states.inputHovering &&
      hasValue
    return criteria
  })
  const iconComponent = computed(() =>
    props.remote && props.filterable ? '' : props.suffixIcon
  )
  const iconReverse = computed(() =>
    iconComponent.value && states.visible ? 'is-reverse' : ''
  )

  // debounce 延迟时长
  const debounce = ref(0)

  // 空文本
  const emptyText = computed(() => {
    if (props.loading) {
      return props.loadingText || t('el.treeSelect.loading')
    } else {
      if (props.remote && states.query === '' && states.options.size === 0)
        return false
      if (
        props.filterable &&
        states.query &&
        states.options.size > 0 &&
        states.filteredOptionsCount === 0
      ) {
        return props.noMatchText || t('el.treeSelect.noMatch')
      }
      if (states.options.size === 0) {
        return props.noDataText || t('el.treeSelect.noData')
      }
    }
    return null
  })

  // 选择框尺寸
  const selectSize = useSize()

  // 折叠 tag 的 size
  const collapseTagSize = computed(() =>
    ['small'].indexOf(selectSize.value) > -1 ? 'small' : 'default'
  )

  // 下拉框显示控制标识
  const dropMenuVisible = computed({
    get() {
      return states.visible && emptyText.value !== false
    },
    set(val: boolean) {
      states.visible = val
    },
  })

  // 默认筛选函数
  const defaultFilterMethod = (changes: QueryChangeCtx) => {
    const { query } = unref(changes)
    treeRef.value?.filter(query)
  }

  // 重置输入框高度
  const resetInputHeight = () => {
    // 合并标签且不是可筛选时，跳出
    if (props.collapseTags && !props.filterable) return
    nextTick(() => {
      if (!reference.value) return
      const input = reference.value.$el.querySelector(
        'input'
      ) as HTMLInputElement
      const _tags = tags.value
      const sizeInMap = states.initialInputHeight || 40
      input.style.height =
        states.selected.length === 0
          ? `${sizeInMap}px`
          : `${Math.max(
              _tags
                ? _tags.clientHeight + (_tags.clientHeight > sizeInMap ? 6 : 0)
                : 0,
              sizeInMap
            )}px`

      states.tagInMultiLine = parseFloat(input.style.height) > sizeInMap

      if (states.visible && emptyText.value !== false) {
        tooltipRef.value?.updatePopper?.()
      }
    })
  }

  // 重置input大小
  const handleResize = () => {
    resetInputWidth()
    tooltipRef.value?.updatePopper?.()
    if (props.multiple && !props.filterable) resetInputHeight()
  }

  const resetInputWidth = () => {
    states.inputWidth = reference.value?.$el.getBoundingClientRect().width
  }

  // 提交 change 事件
  const emitChange = (val) => {
    if (!isEqual(props.modelValue, val)) {
      ctx.emit(CHANGE_EVENT, val)
    }
  }

  const deleteTag = (event, tag) => {
    const index = states.selected.indexOf(tag)
    if (index > -1 && !selectDisabled.value) {
      const value = props.modelValue.slice()
      value.splice(index, 1)
      ctx.emit(UPDATE_MODEL_EVENT, value)
      emitChange(value)
      ctx.emit('remove-tag', tag.value)
    }
    event.stopPropagation()
  }

  const deleteSelected = (event) => {
    event.stopPropagation()
    const value: string | any[] = props.multiple ? [] : ''
    if (typeof value !== 'string') {
      for (const item of states.selected) {
        if (item.isDisabled) value.push(item)
      }
    }
    ctx.emit(UPDATE_MODEL_EVENT, value)
    emitChange(value)
    states.visible = false
    ctx.emit('clear')
  }

  const getValueIndex = (arr: any[] = [], value) => {
    if (!isObject(value)) return arr.indexOf(value)

    const nodeKey = props.nodeKey
    let index = -1
    arr.some((item, i) => {
      if (getValueByPath(item, nodeKey) === getValueByPath(value, nodeKey)) {
        index = i
        return true
      }
      return false
    })
    return index
  }

  const resetInputState = (e: KeyboardEvent) => {
    if (e.code !== EVENT_CODE.backspace) toggleLastOptionHitState(false)
    states.inputLength = input.value!.value.length * 15 + 20
    resetInputHeight()
  }

  const toggleLastOptionHitState = (hit?: boolean) => {
    if (!Array.isArray(states.selected)) return
    const option = states.selected[states.selected.length - 1]
    if (!option) return

    if (hit === true || hit === false) {
      option.hitState = hit
      return hit
    }

    option.hitState = !option.hitState
    return option.hitState
  }

  const handleMenuEnter = () => {
    nextTick(() => scrollToOption(states.selected))
  }

  const handleFocus = (event) => {
    if (!states.softFocus) {
      if (props.automaticDropdown) {
        states.visible = true
        if (props.filterable) {
          states.menuVisibleOnFocus = true
        }
      }
      ctx.emit('focus', event)
    } else {
      states.softFocus = false
    }
  }

  const blur = () => {
    states.visible = false
    reference.value?.blur()
  }

  const handleBlur = (event: Event) => {
    nextTick(() => {
      if (states.isSilentBlur) {
        states.isSilentBlur = false
      } else {
        ctx.emit('blur', event)
      }
    })
    states.softFocus = false
  }

  const handleClearClick = (event: Event) => {
    deleteSelected(event)
  }

  const handleClose = () => {
    states.visible = false
  }

  const toggleMenu = () => {
    if (props.automaticDropdown) return
    if (!selectDisabled.value) {
      if (states.menuVisibleOnFocus) {
        states.menuVisibleOnFocus = false
      } else {
        states.visible = !states.visible
      }
      if (states.visible) {
        ;(input.value || reference.value)?.focus()
      }
    }
  }

  // 获取node的唯一key
  const getNodeKey = (item) => {
    return isObject(item) ? getValueByPath(item, props.nodeKey) : item
  }

  // 设置选中节点
  const setSelected = () => {
    if (!props.multiple) {
      const currentNode = getNode(props.modelValue)
      states.selectedLabel = currentNode.label
      states.selected = currentNode
      if (props.filterable) states.query = states.selectedLabel
      return
    }
    states.selected = getSelectedNodes()
    nextTick(() => {
      resetInputHeight()
    })
  }

  // 设置node的额外属性
  const setNodeProperties = (node) => {
    node.currentLabel = getNodeValByProp('label', node)
    if (props.multiple) {
      node.hitState = false
    }
  }

  // 获取所有已选中的节点
  const getSelectedNodes = () => {
    const selectedNodes: TreeNodeData[] =
      treeRef.value?.getCheckedNodes(true, false) || []
    if (props.multiple && (<any[]>props.modelValue)?.length) {
      ;(<any[]>props.modelValue).forEach((nodeData) => {
        const node = treeRef.value?.getNode(nodeData)
        node &&
          node.checked &&
          !selectedNodes.find(
            (selectedNode) => selectedNode[key.value] === node.data[key.value]
          ) &&
          selectedNodes.push(node.data)
      })
    }
    if (selectedNodes.length) {
      selectedNodes.forEach((selectedNode) => {
        setNodeProperties(selectedNode)
      })
    }
    return selectedNodes
  }

  // 根据条件获取节点
  const getNode = (node) => {
    const targetNode = treeRef.value?.getNode(node)?.data || {}
    setNodeProperties(targetNode)
    return targetNode
  }

  // 选中 node
  const selectNode = (node) => {
    if (!states.visible) {
      toggleMenu()
    } else {
      handleNodeSelect(node)
    }
  }
  // 选中 tree node
  const handleNodeSelect = (node) => {
    if (props.multiple) {
      // 获取当前选中的node节点，仅叶子节点
      const selectedNodes = getSelectedNodes()
      let value = (props.modelValue || []).slice()
      if (
        props.multipleLimit <= 0 ||
        selectedNodes.length < props.multipleLimit
      ) {
        value = selectedNodes.map((selectedNode) => selectedNode[props.nodeKey])
      }
      ctx.emit(UPDATE_MODEL_EVENT, value)
      emitChange(value)
      if (props.filterable) input.value?.focus()
    } else {
      // 若为单选，触发 modelValue:update 和 change 事件，并关闭弹窗
      const value = node.data[props.nodeKey]
      ctx.emit(UPDATE_MODEL_EVENT, value)
      emitChange(value)
      states.visible = false
    }
    if (states.visible) return
  }

  /***************************  tree start *******************/
  const key = computed(() => props.nodeKey || 'id')
  const propsMap = computed(() => ({
    value: key.value,
    ...props.props,
  }))

  // 通过 prop 获取节点值
  const getNodeValByProp = (
    prop: 'value' | 'label' | 'children' | 'disabled' | 'isLeaf',
    data: TreeNodeData
  ) => {
    const propVal = propsMap.value[prop]
    if (isFunction(propVal)) {
      return propVal(
        data,
        treeRef.value?.getNode(
          getNodeValByProp('value', data)
        ) as unknown as Node
      )
    } else {
      return data[propVal as string]
    }
  }
  // 筛选节点方法
  const filterNodeMethod = (value, data, node) => {
    if (props.filterNodeMethod) return props.filterNodeMethod(value, data, node)
    if (!value) return true
    return getNodeValByProp('label', data)?.includes(value)
  }

  const managePlaceholder = () => {
    if (states.currentPlaceholder !== '') {
      states.currentPlaceholder = input.value!.value
        ? ''
        : states.cachedPlaceHolder
    }
  }

  const onInputChange = () => {
    if (props.filterable && states.query !== states.selectedLabel) {
      states.query = states.selectedLabel
      handleQueryChange(states.query)
    }
  }

  // 防抖的 input 输入变更处理函数
  const debouncedOnInputChange = lodashDebounce(() => {
    onInputChange()
  }, debounce.value)

  // 防抖的筛选变更处理函数
  const debouncedQueryChange = lodashDebounce((e) => {
    handleQueryChange(e.target.value)
  }, debounce.value)

  // 删除上一个 tag
  const deletePrevTag = (e) => {
    if (e.target.value.length <= 0 && !toggleLastOptionHitState()) {
      const value = props.modelValue.slice()
      value.pop()
      ctx.emit(UPDATE_MODEL_EVENT, value)
      emitChange(value)
    }

    if (e.target.value.length === 1 && props.modelValue.length === 0) {
      states.currentPlaceholder = states.cachedPlaceHolder
    }
  }

  // 当节点被点击的时候触发
  const handleNodeClick = (nodeData, node, instance) => {
    if (!props.multiple && !getNodeValByProp('children', nodeData)) {
      selectNode(node)
    }
    ctx.emit('node-click', nodeData, node, instance)
  }

  // 当某一节点被鼠标右键点击时会触发该事件
  const handleNodeContextMenu = (event, nodeData, node, instance) => {
    ctx.emit('node-contextmenu', event, nodeData, node, instance)
  }

  // 当复选框被点击的时候触发
  const handleCheckChange = (nodeData, checked) => {
    ctx.emit('check-change', nodeData, checked)
  }

  // 点击节点复选框之后触发
  const handleCheck = (nodeData, checkedObj) => {
    selectNode(null)
    ctx.emit('check', nodeData, checkedObj)
  }

  // 当前选中节点变化时触发的事件
  const handleCurrentChange = (nodeData, node) => {
    ctx.emit('current-change', nodeData, node)
  }

  // 节点被展开时触发的事件
  const handleNodeExpand = (nodeData, node, instance) => {
    ctx.emit('node-expand', nodeData, node, instance)
  }

  // 节点被关闭时触发的事件
  const handleNodeCollapse = (nodeData, node, instance) => {
    ctx.emit('node-collapse', nodeData, node, instance)
  }

  // 节点开始拖拽时触发的事件
  const handleNodeDragStart = (node, event) => {
    ctx.emit('node-drag-start', node, event)
  }

  // 拖拽进入其他节点时触发的事件
  const handleNodeDragEnter = (draggingNode, dropNode, event) => {
    ctx.emit('node-drag-enter', draggingNode, dropNode, event)
  }

  // 拖拽离开某个节点时触发的事件
  const handleNodeDragLeave = (draggingNode, oldDropNode, event) => {
    ctx.emit('node-drag-leave', draggingNode, oldDropNode, event)
  }

  // 在拖拽节点时触发的事件（类似浏览器的 mouseover 事件）
  const handleNodeDragOver = (draggingNode, dropNode, event) => {
    ctx.emit('node-drag-over', draggingNode, dropNode, event)
  }

  // 拖拽结束时（可能未成功）触发的事件
  const handleNodeDragEnd = (draggingNode, dropNode, dropType, event) => {
    ctx.emit('node-drag-end', draggingNode, dropNode, dropType, event)
  }

  // 拖拽成功完成时触发的事件
  const handleNodeDrop = (draggingNode, dropNode, dropType, event) => {
    ctx.emit('node-drop', draggingNode, dropNode, dropType, event)
  }
  /***************************  tree 事件处理 end *******************/
  // 筛选方法
  const filterMethod = (keyword = '') => {
    if (props.filterMethod) props.filterMethod(keyword)
    nextTick(() => {
      // 筛选树节点
      treeRef.value?.filter(keyword)
    })
  }

  // 远程搜索方法
  const remoteMethod = (keyword = '') => {
    if (props.remoteMethod) props.remoteMethod(keyword)
    nextTick(() => {
      // 筛选树节点
      treeRef.value?.filter(keyword)
    })
  }

  const handleQueryChange = (val) => {
    if (states.previousQuery === val || states.isOnComposition) return
    if (
      states.previousQuery === null &&
      (typeof props.filterMethod === 'function' ||
        typeof props.remoteMethod === 'function')
    ) {
      states.previousQuery = val
      return
    }
    states.previousQuery = val
    nextTick(() => {
      if (states.visible) tooltipRef.value?.updatePopper?.()
    })
    states.hoverIndex = -1
    if (props.multiple && props.filterable) {
      nextTick(() => {
        const length = input.value!.value.length * 15 + 20
        states.inputLength = props.collapseTags ? Math.min(50, length) : length
        managePlaceholder()
        resetInputHeight()
      })
    }
    if (props.remote && typeof props.remoteMethod === 'function') {
      states.hoverIndex = -1
      remoteMethod(val)
    } else if (typeof props.filterMethod === 'function') {
      filterMethod(val)
    } else {
      states.filteredOptionsCount = states.optionsCount
      queryChange.value.query = val?.trim()

      triggerRef(queryChange)
    }
    if (
      props.defaultFirstOption &&
      (props.filterable || props.remote) &&
      states.filteredOptionsCount
    ) {
      checkDefaultFirstOption()
    }
  }

  watch(
    () => selectDisabled.value,
    () => {
      nextTick(() => {
        resetInputHeight()
      })
    }
  )

  watch(
    () => props.placeholder,
    (val) => {
      states.cachedPlaceHolder = states.currentPlaceholder = val
    }
  )

  watch(
    () => props.modelValue,
    (val, oldVal) => {
      if (props.multiple) {
        resetInputHeight()
        if ((val && val.length > 0) || (input.value && states.query !== '')) {
          states.currentPlaceholder = ''
        } else {
          states.currentPlaceholder = states.cachedPlaceHolder
        }
        if (props.filterable && !props.reserveKeyword) {
          states.query = ''
          handleQueryChange(states.query)
        }
        // 更新选中的 tree node
        defaultCheckedKeys.value = (val || []).map((item) =>
          typeof item === 'object' ? item[key.value] : item
        )
        const oldSelectedNodeKeys = (
          treeRef.value?.getCheckedNodes(true, false) || []
        ).map((oldSelectedNode) => oldSelectedNode[props.nodeKey])
        if (!isEqual(val, oldSelectedNodeKeys)) {
          treeRef.value?.setCheckedKeys(val, true)
        }
      }
      setSelected()
      if (props.filterable && !props.multiple) {
        states.inputLength = 20
      }
      if (!isEqual(val, oldVal)) {
        elFormItem.validate?.('change')
      }
    },
    {
      flush: 'post',
      deep: true,
      immediate: true,
    }
  )

  watch(
    () => states.visible,
    (val) => {
      if (!val) {
        input.value && input.value.blur()
        states.query = ''
        states.previousQuery = null
        states.selectedLabel = ''
        states.inputLength = 20
        states.menuVisibleOnFocus = false
        nextTick(() => {
          if (
            input.value &&
            input.value.value === '' &&
            states.selected.length === 0
          ) {
            states.currentPlaceholder = states.cachedPlaceHolder
          }

          if (!props.multiple) {
            if (states.selected) {
              states.selectedLabel = states.selected.currentLabel
              if (props.filterable) states.query = states.selectedLabel
            }
            if (props.filterable) {
              states.currentPlaceholder = states.cachedPlaceHolder
            }
          }
        })
      } else {
        tooltipRef.value?.updatePopper?.()

        if (props.filterable) {
          states.filteredOptionsCount = states.optionsCount
          states.query = props.remote ? '' : states.selectedLabel
          if (props.multiple) {
            input.value?.focus()
          } else {
            if (states.selectedLabel) {
              states.currentPlaceholder = states.selectedLabel
              states.selectedLabel = ''
            }
          }
          handleQueryChange(states.query)
          if (!props.multiple && !props.remote) {
            queryChange.value.query = ''

            triggerRef(queryChange)
          }
        }
      }
      // 每次打开下拉框都刷新数据
      if (val && props.filterable) {
        filterMethod()
        setSelected()
      }
      ctx.emit('visible-change', val)
    }
  )

  watch(queryChange, (value) => {
    // 执行默认查询方法
    defaultFilterMethod(value)
  })

  /************************** TODO：filterable，scrollToNode start ********************************/
  const optionsArray = computed(() => Array.from(states.options.values()))

  const optionsAllDisabled = computed(() =>
    optionsArray.value
      .filter((option) => option.visible)
      .every((option) => option.disabled)
  )

  const onOptionDestroy = (key) => {
    states.optionsCount--
    states.filteredOptionsCount--
    states.options.delete(key)
  }

  const scrollToOption = (option) => {
    const targetOption = Array.isArray(option) ? option[0] : option
    let target = null

    if (targetOption?.value) {
      const options = optionsArray.value.filter(
        (item) => item.value === targetOption.value
      )
      if (options.length > 0) {
        target = options[0].$el
      }
    }

    if (tooltipRef.value && target) {
      const menu = tooltipRef.value?.popperRef?.contentRef?.querySelector?.(
        '.el-select-dropdown__wrap'
      )
      if (menu) {
        scrollIntoView(menu as HTMLElement, target)
      }
    }
    scrollbar.value?.handleScroll()
  }

  const handleComposition = (event) => {
    const text = event.target.value
    if (event.type === 'compositionend') {
      states.isOnComposition = false
      nextTick(() => handleQueryChange(text))
    } else {
      const lastCharacter = text[text.length - 1] || ''
      states.isOnComposition = !isKorean(lastCharacter)
    }
  }

  const navigateOptions = (direction) => {
    if (!states.visible) {
      states.visible = true
      return
    }
    if (states.options.size === 0 || states.filteredOptionsCount === 0) return
    if (states.isOnComposition) return

    if (!optionsAllDisabled.value) {
      if (direction === 'next') {
        states.hoverIndex++
        if (states.hoverIndex === states.options.size) {
          states.hoverIndex = 0
        }
      } else if (direction === 'prev') {
        states.hoverIndex--
        if (states.hoverIndex < 0) {
          states.hoverIndex = states.options.size - 1
        }
      }
      const option = optionsArray.value[states.hoverIndex]
      if (
        option.disabled === true ||
        option.states.groupDisabled === true ||
        !option.visible
      ) {
        navigateOptions(direction)
      }
      nextTick(() => scrollToOption(hoverOption.value))
    }
  }

  /**
   * find and highlight first option as default selected
   * @remark
   * - if the first option in dropdown list is user-created,
   *   it would be at the end of the optionsArray
   *   so find it and set hover.
   *   (NOTE: there must be only one user-created option in dropdown list with query)
   * - if there's no user-created option in list, just find the first one as usual
   *   (NOTE: exclude options that are disabled or in disabled-group)
   */
  const checkDefaultFirstOption = () => {
    const optionsInDropdown = optionsArray.value.filter(
      (n) => n.visible && !n.disabled && !n.states.groupDisabled
    )
    const userCreatedOption = optionsInDropdown.filter((n) => n.created)[0]
    const firstOriginOption = optionsInDropdown[0]
    states.hoverIndex = getValueIndex(
      optionsArray.value,
      userCreatedOption || firstOriginOption
    )
  }

  /************************** TODO end ********************************/

  return {
    optionsArray,
    selectSize,
    handleResize,
    debouncedOnInputChange,
    debouncedQueryChange,
    deletePrevTag,
    deleteTag,
    deleteSelected,
    scrollToOption,
    readonly,
    resetInputHeight,
    showClose,
    iconComponent,
    iconReverse,
    collapseTagSize,
    setSelected,
    managePlaceholder,
    selectDisabled,
    emptyText,
    toggleLastOptionHitState,
    resetInputState,
    handleComposition,
    onOptionDestroy,
    handleMenuEnter,
    handleFocus,
    blur,
    handleBlur,
    handleClearClick,
    handleClose,
    toggleMenu,
    getNodeKey,
    getSelectedNodes,
    navigateOptions,
    dropMenuVisible,
    queryChange,
    treeLabelProp,
    treeChildrenProp,
    treeDisabledProp,

    // DOM ref
    reference,
    input,
    tooltipRef,
    tags,
    treeSelectWrapper,
    scrollbar,
    treeRef,

    defaultCheckedKeys,
    filterNodeMethod,
    // tree events
    handleNodeClick,
    handleNodeContextMenu,
    handleCheckChange,
    handleCheck,
    handleCurrentChange,
    handleNodeExpand,
    handleNodeCollapse,
    handleNodeDragStart,
    handleNodeDragEnter,
    handleNodeDragLeave,
    handleNodeDragOver,
    handleNodeDragEnd,
    handleNodeDrop,
  }
}
