//@ts-nocheck
import { buildProps, definePropType } from '@element-plus/utils'
import { UPDATE_MODEL_EVENT } from '@element-plus/constants'
import type { ExtractPropTypes } from 'vue'
import type { ComponentSize } from '@element-plus/constants'
import type { ItemRenderProps } from '@element-plus/components/render/item-render'

/**
 * 表单属性
 */
export const renderFormProps = buildProps({
  /**
   * v-model 值
   */
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  /**
   * 表单字段
   */
  formItem: {
    type: definePropType<Array<ItemRenderProps>>(Array),
    default: () => [],
  },
  /**
   * 元素尺寸
   *
   * 该值将影响 表单字段，操作按钮 size 属性
   */
  size: {
    type: definePropType<ComponentSize>(String),
    default: 'default',
  },
  /**
   * 数据行ID，将用于表格行数据的编辑，删除传参使用
   */
  rowKey: {
    type: definePropType<string | ((row: any) => string)>([String, Function]),
    default: 'id',
  },
  /**
   * 查询区域 label 字段标签宽度，例如 '50px'。 可以使用 auto
   */
  labelWidth: {
    type: definePropType<string | number>([String, Number]),
    default: '120px',
  },
  /**
   * 配合 label 属性使用，表示是否显示 label 后面的冒号,默认 true
   */
  colon: {
    type: Boolean,
    default: true,
  },
  /**
   * 每行展示字段数量
   */
  rowSize: {
    type: Number,
    default: 3,
    validator(value: number) {
      return [1, 2, 3, 4].includes(value)
    },
  },
  /**
   * 重置按钮展示文案
   */
  resetText: {
    type: String,
    default: '重置',
  },
  /**
   * 提交按钮展示文案
   */
  submitText: {
    type: String,
    default: '提交',
  },
  /**
   * 重置按钮是否展示
   */
  resetVisible: {
    type: Boolean,
    default: true,
  },
  /**
   * 提交按钮是否展示
   */
  submitVisible: {
    type: Boolean,
    default: true,
  },
} as const)

export type RenderFormProps = ExtractPropTypes<typeof renderFormProps>

export const renderFormEmits = [
  'on-reset',
  'on-submit',
  'validateFieldsError',
  UPDATE_MODEL_EVENT,
]

export type RenderFormEmits = typeof renderFormEmits
