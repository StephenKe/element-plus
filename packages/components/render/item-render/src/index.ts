import { buildProps, definePropType } from '@element-plus/utils'
import { FieldFlags } from '../../shared/FieldFlags'
import type { ApiConfig } from '../../table-render/src/request.type'
import type { ExtractPropTypes } from 'vue'

/**
 * 查询区域字段
 */
export const itemRenderProps = buildProps({
  /**
   * v-model 值
   */
  modelValue: {
    type: definePropType<object | string | number | boolean | Array<any>>([
      Object,
      String,
      Number,
      Boolean,
      Array,
    ]),
  },
  /**
   * 字段类型
   * 建议传字符串类型
   */
  type: {
    type: definePropType<FieldFlags>([String, Number]),
    default: FieldFlags.text,
  },
  /**
   * 属性值
   * 如果对应接口是两个字段，则建议使用数据，分别对应接口两个字段
   * 如果接口是一个字段，则存储在一个为数组中
   */
  prop: {
    type: definePropType<string | string[]>([String, Array]),
    default: '',
  },
  /**
   * 只有当 prop 为数组时使用
   * 起始值 v-model:start
   */
  start: {
    type: definePropType<object | string | number | boolean | Array<any>>([
      Object,
      String,
      Number,
      Boolean,
      Array,
    ]),
  },
  /**
   * 只有当 prop 为数组时使用
   * 结束值 v-model:end
   */
  end: {
    type: definePropType<object | string | number | boolean | Array<any>>([
      Object,
      String,
      Number,
      Boolean,
      Array,
    ]),
  },
} as const)

/**
 * 区间字段属性
 */
export const itemSplitRenderProps = buildProps({
  ...itemRenderProps,
  /**
   * 区间输入框的分隔符号
   */
  rangeSeparator: {
    type: String,
    default: '-',
  },
  /**
   * 开始结束字段 placeholder 提示信息
   */
  placeholder: {
    type: definePropType<string[]>(Array),
    default: () => [],
  },
} as const)

export type SelectModelValue = string | number | boolean | object

export const selectFieldProps = buildProps({
  modelValue: {
    type: definePropType<SelectModelValue>([String, Number, Boolean, Object]),
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  /**
   * 下拉选项映射
   */
  optionProps: {
    type: definePropType<{ label: string; value: string }>(Object),
    default: () => ({
      // 展示值
      label: 'label',
      // 实际值
      value: 'value',
    }),
  },
  /**
   * API 获取下拉框数据
   */
  api: {
    type: definePropType<ApiConfig>(Object),
  },
  /**
   * 下拉选项
   */
  options: {
    type: Array,
    default: () => [],
  },
  /**
   * 只包含哪些值
   */
  includes: {
    type: Array,
    default: () => [],
  },
  /**
   * 排除哪些值
   */
  excludes: {
    type: Array,
    default: () => [],
  },
})

export type SelectFieldProps = ExtractPropTypes<typeof selectFieldProps>

export type ItemRenderProps = ExtractPropTypes<typeof itemRenderProps>
export type ItemSplitRenderProps = ExtractPropTypes<typeof itemSplitRenderProps>

export const itemRenderEmits = {}

export type ItemRenderEmits = typeof itemRenderEmits
