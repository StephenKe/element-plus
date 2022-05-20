//@ts-nocheck
import { buildProps, definePropType } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'
import type { TruthOrResolver } from '@element-plus/utils'
import type { FormItemRule } from '@element-plus/tokens'

// 字段类型
export enum ItemType {
  Text = 'text',
  TextArea = 'textarea',
  Select = 'select',
  Radio = 'radio',
  Date = 'date',
  Year = 'year',
  Month = 'month',
  Dates = 'dates',
  Datetime = 'datetime',
  Week = 'week',
  Switch = 'switch',
  Slot = 'slot',
  Number = 'number',
  // Currency = 'currency',
}

// 下拉框选项
export type OptionType = {
  /**
   * 展示的值
   */
  label: string
  /**
   * 实际值
   */
  value: string
  /**
   * 选项是否禁用
   */
  disabled?: boolean
}

/**
 * 查询区域字段
 */
export const itemRenderProps = buildProps({
  /**
   * v-model 值
   */
  modelValue: {
    type: [Object, String, Number, Boolean, Array],
    required: true,
  },
  /**
   * 默认值
   */
  defaultValue: {
    type: [Object, String, Number, Boolean, Array],
  },
  /**
   * 字段类型
   */
  type: {
    type: definePropType<ItemType>(String),
    default: ItemType.Text,
  },
  /**
   * 属性值，或 type 为 slot 时，作为插槽名
   */
  prop: {
    type: String,
    required: true,
  },
  /**
   * 区间字段时有效，起始字段的 key 值
   *
   * 注：如同时提供了 prop，则会将字段值填充到 prop 指定的字段内
   */
  start: String,
  /**
   * 区间字段时有效，结束字段的 key 值
   *
   * 注：如同时提供了 prop，则会将字段值填充到 prop 指定的字段内
   */
  end: String,
  /**
   * 展示文字
   */
  label: {
    type: String,
  },
  /**
   * 配合 label 属性使用，表示是否显示 label 后面的冒号,默认 true
   */
  colon: {
    type: Boolean,
    default: true,
  },
  /**
   * 查询区域 label 字段标签宽度，例如 '50px'。 可以使用 auto，优先级高
   */
  labelWidth: {
    type: definePropType<string | number>([String, Number]),
    default: '90px',
  },
  /**
   * 跨度，值不能大于 rowSize
   */
  colSpan: {
    type: Number,
    default: 1,
  },
  /**
   * 校验规则
   */
  rules: {
    type: definePropType<FormItemRule[]>(Array),
  },
  /**
   * 是否区间输入框
   *
   * 可设置为区间输入框的字段有type为 date/year/month/datetime
   */
  range: {
    type: Boolean,
    default: false,
  },
  /**
   * 区间输入框的分隔符号
   */
  rangeSeparator: {
    type: String,
    default: '-',
  },
  /**
   * 是否开区间(该属性只有range为true时才有效)，开区间表示区间范围输入框是2个分离的框
   */
  stage: {
    type: Boolean,
    default: false,
  },
  /**
   * 字段 placeholder 提示信息
   */
  placeholder: {
    type: String,
  },
  /**
   * 起始输入框 placeholder 提示信息
   *
   * 仅当 range 为 true 时有效
   */
  startPlaceholder: {
    type: String,
  },
  /**
   * 终止输入框 placeholder 提示信息
   *
   * 仅当 range 为 true 时有效
   */
  endPlaceholder: {
    type: String,
  },
  /**
   * 输入字段最大长度限制
   * 默认 100 个字符长度
   */
  maxlength: {
    type: [String, Number],
    default: 100,
  },
  /**
   * 是否展示
   * 默认 true
   */
  visible: {
    type: definePropType<TruthOrResolver<any>>([Boolean, Function]),
    default: true,
  },
  /**
   * 是否可清空
   * 默认 true
   */
  clearable: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否禁用
   * 默认 false
   */
  disabled: {
    type: definePropType<TruthOrResolver<any>>([Boolean, Function]),
    default: false,
  },
  /**
   * 下拉框选项
   */
  options: {
    type: definePropType<Array<OptionType>>(Array),
    default: () => [],
  },
  /**
   * 是否多选
   */
  multiple: {
    type: Boolean,
    default: false,
  },
  /**
   * 单选框类型，可选择 radio | button
   */
  radioType: {
    type: definePropType<'radio' | 'button'>(String),
    default: 'radio',
  },
  /**
   * 格式化
   */
  format: {
    type: String,
    default: 'YYYY-MM-DD',
  },
  /**
   * 值格式化
   */
  valueFormat: {
    type: String,
  },
  /**
   * 输入框行数，只对 type="textarea" 有效
   */
  rows: {
    type: Number,
    default: 2,
  },
  /**
   * textarea高度是否自适应，只在 type="textarea" 时生效。 可以接受一个对象，比如: { minRows: 2, maxRows: 6 }
   */
  autosize: {
    type: [Boolean, Object],
    default: false,
  },
  /**
   * 是否显示输入字数统计，只在 type = "text" 或 type = "textarea" 时有效
   */
  showWordLimit: Boolean,
} as const)

export type ItemRenderProps = ExtractPropTypes<typeof itemRenderProps>

export const itemRenderEmits = {}

export type ItemRenderEmits = typeof itemRenderEmits
