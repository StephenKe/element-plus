import { buildProps, definePropType } from '@element-plus/utils'
import { UPDATE_MODEL_EVENT } from '@element-plus/constants'
import { buttonProps } from '@element-plus/components/button/src/button'
import { formEmits, formItemProps, formProps } from '@element-plus/components'
import type { ExtractPropTypes } from 'vue'
import type { TruthOrResolver } from '@element-plus/utils'
import type {
  ItemRenderProps,
  ItemSplitRenderProps,
} from '@element-plus/components'

export const formButtonProps = buildProps({
  ...buttonProps,
  label: String,
} as const)

export const formRenderItemProps = Object.assign(
  {},
  formItemProps,
  buildProps({
    /**
     * 默认值
     */
    defaultValue: {
      type: definePropType<object | string | number | boolean | Array<any>>([
        Object,
        String,
        Number,
        Boolean,
        Array,
      ]),
    },
    /**
     * 属性值
     * type 为 slot 时，prop 将作为插槽名
     * split 为 true，则该属性可以给数组 [开始字段prop, 结束字段prop]
     */
    // prop: {
    //   type: definePropType<string | string[]>([String, Array]),
    //   required: true,
    // },
    /**
     * 配合 label 属性使用，表示是否显示 label 后面的冒号,默认 true
     */
    colon: {
      type: Boolean,
      default: true,
    },
    /**
     * 展示文字
     */
    // label: {
    //   type: String,
    //   default: '',
    // },
    /**
     * label 字段标签宽度，例如 '50px'。 可以使用 auto
     */
    // labelWidth: {
    //   type: definePropType<string | number>([String, Number]),
    //   default: '90px',
    // },
    /**
     * 跨度，值不能大于 rowSize
     * 可以设置为 1.5 这样的小数值，计数器步长为 0.5
     */
    colSpan: {
      type: Number,
      default: 1,
      validator(val: number) {
        return val >= 1 && val % 0.5 === 0
      },
    },
    /**
     * 校验规则
     */
    // rules: {
    //   type: definePropType<FormItemRule | FormItemRule[]>([Array, Object]),
    // },
    /**
     * 是否展示
     * 默认 true
     */
    visible: {
      type: definePropType<TruthOrResolver<any>>([Boolean, Function]),
      default: true,
    },
    /**
     * 字段 placeholder 提示信息
     * 分离输入框时才使用数组形式
     */
    placeholder: {
      type: definePropType<string | string[]>([String, Array]),
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
     * 对其他字段的影响
     * 暂只支持 select 框，下拉框值改变值影响其他字段值
     * 示例：[{
     *  prop: 'systemId',
     *  type: 'select',
     *  optionProps: { label: 'name', value: 'id' },
     *  options: [
     *    { id: 1001, name: '一体化财务', code: 'financial' },
     *    { id: 1002, name: '权限平台', code: 'authority' },
     *    { id: 1003, name: '业务中台', code: 'middle' },
     *  ],
     *  effect: {
     *    systemName: 'name',  // 下拉选项中的 name 字段填充到 prop 为 systemName 的字段
     *    systemCode: 'code'  // 下拉选项中的 code 字段填充到 prop 为 systemCode 的字段
     *  }
     * }, {
     *  prop: 'systemCode',
     *  disabled: true,
     *  label: '系统编码'
     * }, {
     *  prop: 'systemName',
     *  disabled: true,
     *  label: '系统名称'
     * }]
     */
    effect: {
      type: definePropType<Record<string, string>>(Object),
    },
    /**
     * 输入字段最大长度限制
     * input 默认 30，textarea 默认 200
     */
    maxlength: Number,
    /**
     * 区间框是否分离
     * 默认 false
     * 注意：如果为 true ，则 prop，placeholder，defaultValue 必须为数组
     */
    split: Boolean,
  } as const)
)

export type FormButtonProps = ExtractPropTypes<typeof formButtonProps>

export type FormRenderItemProps = ItemRenderProps &
  ItemSplitRenderProps &
  ExtractPropTypes<typeof formRenderItemProps>

/**
 * 表单属性
 */
export const formRenderProps = Object.assign(
  {},
  formProps,
  buildProps({
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
      type: definePropType<Array<FormRenderItemProps>>(Array),
      default: () => [],
    },
    /**
     * 元素尺寸
     *
     * 该值将影响 表单字段，操作按钮 size 属性
     */
    // size: {
    //   type: definePropType<ComponentSize>(String),
    //   default: 'default',
    // },
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
    // labelWidth: {
    //   type: definePropType<string | number>([String, Number]),
    //   default: '120px',
    // },
    /**
     * 配合 label 属性使用，表示是否显示 label 后面的冒号,默认 true
     * 优先级低于 formItem 内的 colon
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
     * 展示字段数量
     * 默认 -1 表示全部展示
     */
    expandSize: {
      type: Number,
      default: -1,
    },
    /**
     * 提交按钮配置
     * 为 Boolean 类型: 为 false 时，则表示不展示此按钮，为 true 时展示，且使用内置默认按钮
     * 为 Object 类型: 可配置按钮 size，type 等属性
     */
    submitButton: {
      type: definePropType<FormButtonProps | boolean>([Object, Boolean]),
      default: true,
    },
    /**
     * 重置按钮配置
     * 为 Boolean 类型: 为 false 时，则表示不展示此按钮，为 true 时展示，且使用内置默认按钮
     * 为 Object 类型: 可配置按钮 size，type 等属性
     */
    resetButton: {
      type: definePropType<FormButtonProps | boolean>([Object, Boolean]),
      default: true,
    },
    /**
     * 清空按钮配置
     * 为 Boolean 类型: 为 false 时，则表示不展示此按钮，为 true 时展示，且使用内置默认按钮
     * 为 Object 类型: 可配置按钮 size，type 等属性
     */
    clearButton: {
      type: definePropType<FormButtonProps | boolean>([Object, Boolean]),
      default: false,
    },
    /**
     * 提交前的额外校验工作，根据返回值 Boolean 决定是否提交成功
     */
    beforeSubmit: Function,
  } as const)
)

export type FormRenderProps = ExtractPropTypes<typeof formRenderProps>

export const formRenderEmits = [
  'clear',
  'reset',
  'submit',
  'validate-fields-error',
  'select-change',
  UPDATE_MODEL_EVENT,
]

export type FormRenderEmits = typeof formRenderEmits & typeof formEmits
