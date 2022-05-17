import { buildProps } from '@element-plus/utils'

// 属性
export const queryFormProps = buildProps({
  // 查询参数对象
  model: Object,
  // form rules
  rules: Object,
  // form label 宽度
  labelWidth: {
    type: [String, Number],
    default: '100px',
  },
  // form label-position
  labelPosition: {
    type: String,
  },
  // form label-suffix
  labelSuffix: {
    type: String,
    default: '',
  },
  // form hide-required-asterisk
  hideRequiredAsterisk: {
    type: Boolean,
    default: false,
  },
  // form show-message
  showMessage: {
    type: Boolean,
    default: true,
  },
  // form disabled
  disabled: Boolean,
  // 尺寸
  size: {
    type: String,
    default: 'default',
  },
  // 是否收起
  collapse: {
    type: Boolean,
    default: true,
  },
  // 收起按钮描述
  collapseText: {
    type: String,
    default: '收起',
  },
  // 展开按钮描述
  expandText: {
    type: String,
    default: '展开',
  },
  // 查询按钮描述
  searchText: {
    type: String,
    default: '查询',
  },
  // 重置按钮描述
  resetText: {
    type: String,
    default: '重置',
  },
})

// 事件
export const queryFormEmits = ['reset', 'search', 'validate']
