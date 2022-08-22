import { buildProps, definePropType } from '@element-plus/utils'
import { paginationEmits } from '@element-plus/components/pagination/src/pagination'
import type { ExtractPropTypes } from 'vue'
import type {
  PaginationEmits,
  ButtonProps,
  FormRenderItemProps,
} from '@element-plus/components'
import type tableColumnProps from '@element-plus/components/table/src/table-column/defaults'
import type { TableApiConfig } from './request.type'
import type { ComponentSize } from '@element-plus/constants'
import type { TruthResolver, TruthOrResolver } from '@element-plus/utils'
import type { CardInstance } from '@element-plus/components'

export interface Pagination {
  pageSize?: number
  pageSizes?: number[]
  small?: boolean
  background?: boolean
  disabled?: boolean
  pagerCount?: number
  hideOnSinglePage?: boolean
  layout?: Array<'total' | 'sizes' | 'prev' | 'pager' | 'next' | 'jumper'>
}

export enum ActionType {
  Insert = 'insert',
  Update = 'update',
  Delete = 'delete',
  Deletes = 'deletes',
}

export enum DialogType {
  Dialog = 'dialog',
  Drawer = 'drawer',
}

export type TableRenderButtonProps = ButtonProps & {
  /**
   * 控制是否展示
   *
   * 返回 boolean 或 返回 boolean 值的函数
   */
  visible?: TruthOrResolver<any>
  /**
   * 控制是否禁用
   *
   * 返回 boolean 或 返回 boolean 值的函数
   */
  disabled?: TruthResolver<any>
  /**
   * 按钮点击事件
   */
  onClick: (...args: any) => void
  /**
   * 按钮展示文字
   */
  label: string
  /**
   * 子按钮
   */
  children?: TableRenderButtonProps[]
  /**
   * 功能类的按钮
   *
   * insert: 内置提供的弹窗新增操作，需提供 form-item 配置表单字段
   *
   * update: 内置提供的弹窗编辑操作，需提供 form-item 配置表单字段
   *
   * delete: 内置提供的行删除操作，仅在 列 slot = operation 时使用
   *
   * deletes: 内置提供的批量删除操作，用于操作栏上的按钮功能
   */
  action?: ActionType
}

export type TableRenderColumn = ExtractPropTypes<typeof tableColumnProps> & {
  /**
   * 表头插槽列设置此属性，为 true 时，则使用 prop 作为 插槽名，为 字符串时，则值作为插槽名
   */
  headerSlot?: string | boolean

  /**
   * 插槽列设置此属性，为 true 时，则使用 prop 作为 插槽名，为 字符串时，则值作为插槽名
   */
  slot?: string | boolean
  /**
   * 表格列操作按钮列表，仅当 type 为 operation 时有效
   */
  operation?: TableRenderButtonProps[]
  /**
   * 点击事件
   */
  onClick?: (...args: any) => void
}

/**
 * TableRender props
 */
export const tableRenderProps = buildProps({
  /**
   * 网络请求配置
   */
  api: {
    type: definePropType<TableApiConfig>(Object),
    required: true,
  },
  /**
   * 设置查询区和数据展示区边框阴影效果
   *
   * always: 总是出现
   *
   * hover: 鼠标移动上去时出现
   *
   * never: 从不出现
   *
   * none: 从不出现，且无边框
   */
  shadow: {
    type: definePropType<CardInstance['shadow']>(String),
    default: 'none',
  },
  /**
   * 是否自动查询
   */
  autoSearch: {
    type: Boolean,
    default: true,
  },
  /**
   * 元素尺寸
   *
   * 该值将影响 搜索区字段，表格列，操作按钮 size 属性
   */
  size: {
    type: definePropType<ComponentSize>(String),
    default: 'default',
  },
  /**
   * 查询区域 label 字段标签宽度，例如 '50px'。 可以使用 auto
   */
  labelWidth: {
    type: definePropType<string | number>([String, Number]),
    default: '120px',
  },
  /**
   * 弹窗类型，默认dialog，可选 dialog / drawer
   */
  dialogType: {
    type: String,
    values: ['dialog', 'drawer'],
    default: 'dialog',
  },
  /**
   * 弹窗的宽度
   *
   * 当 dialogType 为 drawer 时，该属性表示 drawer 组件的 size 属性
   */
  dialogWidth: {
    type: definePropType<string | number>([String, Number]),
  },
  /**
   * dialogType 为 drawer 时有效，设置 Drawer 打开的方向
   */
  dialogDirection: {
    type: String,
    values: [
      'ltr', // left to right
      'rtl', // right to left
      'ttb', // top to bottom
      'btt', // bottom to top
    ],
    default: 'rtl',
  },
  /**
   * 配合 label 属性使用，表示是否显示 label 后面的冒号,默认 true
   */
  colon: {
    type: Boolean,
    default: true,
  },
  /**
   * 表格数据进行包装函数，通常用户展示树状结构的表格时用到
   */
  wrapperTableData: {
    type: Function,
  },
  /**
   * 表格列
   *
   * 必填字段
   */
  tableColumn: {
    type: definePropType<Array<TableRenderColumn>>(Array),
    required: true,
  },
  /**
   * 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
   */
  defaultExpandAll: {
    type: Boolean,
    default: false,
  },
  /**
   * 查询字段
   *
   * 长度为0，则不展示搜索区
   */
  searchItem: {
    type: definePropType<FormRenderItemProps[]>(Array),
    default: () => [],
  },
  /**
   * 表单字段
   */
  formItem: {
    type: definePropType<FormRenderItemProps[]>(Array),
    default: () => [],
  },
  /**
   * 每行展示搜索字段数量
   */
  rowSize: {
    type: Number,
    default: 3,
    validator(value: number) {
      return [1, 2, 3, 4].includes(value)
    },
  },
  /**
   * 内容体左侧插槽占用栅格数
   */
  bodyLeftSpan: {
    type: Number,
    default: 6,
    validator(value: number) {
      return value >= 1 && value <= 24
    },
  },
  /**
   * 新增编辑每行展示字段数量
   */
  formRowSize: {
    type: Number,
    default: 2,
    validator(value: number) {
      return [1, 2, 3, 4].includes(value)
    },
  },
  /**
   * 查询区展示字段个数，超出这个数量则会显示 展开/收起 按钮
   */
  expandSize: {
    type: Number,
    default: 5,
  },
  /**
   * ElTable 属性
   * 行数据的 Key，用来优化 Table 的渲染； 在使用reserve-selection功能与显示树形数据时，该属性是必填的。
   * 类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。
   */
  rowKey: {
    type: definePropType<string | ((row?: any) => string)>([String, Function]),
    default: 'id',
  },
  /**
   * 是否带有纵向边框
   */
  border: {
    type: Boolean,
    default: true,
  },
  /**
   * ElTable 属性
   * 仅对  type=selection 的列有效， 请注意， 需指定 row-key 来让这个功能生效。
   */
  reserveSelection: {
    type: Boolean,
    default: true,
  },
  /**
   * 当存在列 type 为 selection 时，切换页码时是否仍记录原页面选中的项
   */
  persistent: {
    type: Boolean,
    default: false,
  },
  /**
   * 分页器
   */
  pagination: {
    type: definePropType<Pagination | boolean>([Object, Boolean]),
    default: true,
  },
  /**
   * 操作栏左侧按钮
   */
  actionLeftButton: {
    type: definePropType<TableRenderButtonProps[]>(Array),
    default: () => [],
  },
  onRowClick: {
    type: Function,
  },
  /**
   * 操作栏右侧按钮
   */
  actionRightButton: {
    type: definePropType<TableRenderButtonProps[]>(Array),
    default: () => [],
  },
} as const)

export type TableRenderProps = ExtractPropTypes<typeof tableRenderProps>

/**
 * ElTable emits
 */
export const tableEmits = [
  'select',
  'select-all',
  'selection-change',
  'cell-mouse-enter',
  'cell-mouse-leave',
  'cell-contextmenu',
  'cell-click',
  'cell-dblclick',
  'row-click',
  'row-contextmenu',
  'row-dblclick',
  'header-click',
  'header-contextmenu',
  'sort-change',
  'filter-change',
  'current-change',
  'header-dragend',
  'expand-change',
]

/**
 * TableRender emits
 */
export const tableRenderEmits = [
  'search-reset',
  'search-submit',
  'validate-fields-error',
  'form-reset',
  'form-submit',
  /**
   * ElTable emits
   */
  ...tableEmits,
  /**
   * ElPagination emits
   */
  ...Object.keys(paginationEmits),
]

export type TableRenderEmits = PaginationEmits & typeof tableRenderEmits
