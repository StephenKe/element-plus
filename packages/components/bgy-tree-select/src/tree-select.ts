import { ArrowUp, CircleClose } from '@element-plus/icons-vue'
import { isValidComponentSize, buildProps } from '@element-plus/utils'
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@element-plus/constants'
import type { ExtractPropTypes, Component, PropType } from 'vue'
import type { ComponentSize } from '@element-plus/constants'
import type {
  TreeComponentProps,
  TreeData,
  TreeNodeData,
} from '@element-plus/components/tree/src/tree.type'

// props
export const treeSelectProps = buildProps({
  /** 下拉属性 **/
  name: String, // 原生 input 的 name 属性
  id: String, // 原生 input 的 id 属性
  modelValue: {
    // v-model 的 value 值，也可直接使用 v-model
    type: [Array, String, Number, Boolean, Object],
    default: undefined,
  },
  autocomplete: {
    type: String,
    default: 'off',
  },
  automaticDropdown: Boolean, // 对于不可搜索的 Select，是否在输入框获得焦点后自动弹出选项菜单
  size: {
    // 输入框尺寸
    type: String as PropType<ComponentSize>,
    validator: isValidComponentSize,
  },
  disabled: Boolean, // 是否禁用
  clearable: Boolean, // 是否可以清空选项
  filterable: Boolean, // 是否可筛选
  remote: Boolean, // 是否可远程搜索
  loading: {
    type: Boolean,
    default: false,
  }, // 是否正在从远程获取数据
  popperClass: {
    // 弹窗样式
    type: String,
    default: '',
  },
  loadingText: String, // 搜索内容加载中的文字
  noMatchText: String, // 搜索条件无匹配时显示的文字，也可以使用 empty 插槽设置
  noDataText: String, // 选项为空时显示的文字，也可以使用 empty 插槽设置
  filterMethod: Function, // 自定义筛选方法
  remoteMethod: Function, // 远程搜索方法
  multiple: Boolean, // 是否多选
  multipleLimit: {
    // 多选限制
    type: Number,
    default: 0,
  },
  placeholder: {
    // 占位符
    type: String,
  },
  defaultFirstOption: Boolean, // todo: 在输入框按下回车，选择第一个匹配项。 需配合 filterable 或 remote 使用
  reserveKeyword: Boolean, // todo: 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词
  collapseTags: {
    type: Boolean,
    default: false,
  }, // 多选时是否将选中值按文字的形式展示
  popperAppendToBody: {
    // 是否将弹出框插入至 body 元素。 在弹出框的定位出现问题时，可将该属性设置为 false
    type: Boolean,
    default: true,
  },
  clearIcon: {
    // 自定义清除当前选择的图标
    type: [String, Object] as PropType<string | Component>,
    default: () => CircleClose,
  },
  fitInputWidth: {
    // 下拉框是否与输入框同宽
    type: Boolean,
    default: false,
  },
  suffixIcon: {
    // 自定义后缀图标组件
    type: [String, Object] as PropType<string | Component>,
    default: () => ArrowUp,
  },
  // 标签类型
  tagType: {
    type: String as PropType<'success' | 'info' | 'warning' | 'danger' | ''>,
    default: 'info',
  },

  /** 树状结构属性 **/
  data: {
    // 展示数据
    type: Object as PropType<TreeData | TreeNodeData>,
    default: () => ({}),
  },
  renderAfterExpand: {
    // 是否在第一次展开某个树节点后才渲染其子节点
    type: Boolean,
    default: true,
  },
  nodeKey: {
    type: String,
    default: 'id',
  }, // 	每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
  checkStrictly: {
    // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
    type: Boolean,
    default: false,
  },
  defaultExpandAll: {
    // 是否默认展开所有节点, 默认为 false
    type: Boolean,
    default: false,
  },
  expandOnClickNode: {
    // 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点
    type: Boolean,
    default: true,
  },
  checkOnClickNode: {
    // 是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点
    type: Boolean,
    default: false,
  },
  checkDescendants: {
    // 选中后代
    type: Boolean,
    default: false,
  },
  autoExpandParent: {
    // 	展开子节点的时候是否自动展开父节点
    type: Boolean,
    default: true,
  },
  defaultCheckedKeys: Array as PropType<
    TreeComponentProps['defaultCheckedKeys']
  >, // 默认勾选的节点的 key 的数组
  defaultExpandedKeys: Array as PropType<
    TreeComponentProps['defaultExpandedKeys']
  >, // 默认展开的节点的 key 的数组
  currentNodeKey: [String, Number] as PropType<string | number>, // 当前选中的节点
  renderContent: Function, // 树节点的内容区的渲染 Function
  draggable: {
    // 是否开启拖拽节点功能
    type: Boolean,
    default: false,
  },
  allowDrag: Function, // 判断节点能否被拖拽 如果返回 false ，节点不能被拖动
  allowDrop: Function, // 拖拽时判定目标节点能否成为拖动目标位置。 如果返回 false ，拖动节点不能被拖放到目标节点。 type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
  props: {
    // 配置选项
    type: Object as PropType<TreeComponentProps['props']>,
    default: () => ({
      children: 'children',
      label: 'label',
      disabled: 'disabled',
      isLeaf: 'isLeaf',
      class: 'class',
    }),
  },
  lazy: {
    // 是否懒加载子节点，需与 load 方法结合使用
    type: Boolean,
    default: false,
  },
  highlightCurrent: {
    type: Boolean,
    default: true,
  }, // 是否高亮当前选中节点，默认值是 true。
  load: Function as PropType<TreeComponentProps['load']>, // 加载子树数据的方法，仅当 lazy 属性为true 时生效
  filterNodeMethod: Function as PropType<
    TreeComponentProps['filterNodeMethod']
  >, // todo: 对树节点进行筛选时执行的方法， 返回 false 则表示这个节点会被隐藏
  accordion: {
    type: Boolean,
    default: false,
  }, // 是否每次只打开一个同级树节点展开
  indent: {
    // 相邻级节点间的水平缩进，单位为像素
    type: Number,
    default: 18,
  },
  icon: [String, Object] as PropType<string | Component>, // 自定义图标组件
})

export type TreeSelectPropsType = ExtractPropTypes<typeof treeSelectProps>

// emits
export const treeSelectEmits = [
  // 下拉 emits
  UPDATE_MODEL_EVENT,
  CHANGE_EVENT,
  'remove-tag',
  'clear',
  'visible-change',
  'focus',
  'blur',
  // tree emits
  'check-change',
  'current-change',
  'node-click',
  'node-contextmenu',
  'node-collapse',
  'node-expand',
  'check',
  'node-drag-start',
  'node-drag-end',
  'node-drop',
  'node-drag-leave',
  'node-drag-enter',
  'node-drag-over',
]

export type TreeSelectEmitsType = typeof treeSelectEmits
