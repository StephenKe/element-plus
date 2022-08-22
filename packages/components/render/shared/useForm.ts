//@ts-nocheck
import { ref, reactive } from 'vue'
import { hasOwn, isArray, isObject, isString } from '@vue/shared'
import { isUndefined } from '@element-plus/utils'
import {
  FieldFlags,
  isInputFlags,
  isSelectableFlags,
  isRangeFlags,
} from './FieldFlags'
import type { FormRenderItemProps } from '@element-plus/components'
import type { FormItemRule } from '@element-plus/tokens'
import type { SelectFieldProps } from '../item-render/src/index'

/**
 * 设置字段的默认属性
 * @param item 字段
 * @returns 返回处理后的字段
 */
function setDefaultProps(item: FormRenderItemProps): FormRenderItemProps {
  // 默认为 text
  if (!item.type) {
    item.type = FieldFlags.text
  }

  // 将字符串 type 转为 数字 type
  item.type = (
    isString(item.type) ? FieldFlags[item.type] : item.type
  ) as number

  // 跨字段
  item.colSpan = isNaN(item.colSpan) ? 1 : Number(item.colSpan)

  // 默认长度限制
  if (isInputFlags(item.type)) {
    // 默认长度: text 默认 30， textarea 默认 200
    if (!hasOwn(item, 'maxlength')) {
      item.maxlength = item.type & FieldFlags.textarea ? 200 : 30
    }
  } else if (item.type & FieldFlags.select) {
    // 如果是下拉选择框
    const selectItem = item as FormRenderItemProps & SelectFieldProps
    selectItem.options = selectItem.options ?? []
  }

  // 默认placeholder
  if (!item.placeholder) {
    const prefix = isSelectableFlags(item.type) ? '请选择' : '请输入'
    // 分离框
    if (item.split) {
      item.placeholder = [
        `${prefix}${item.label}起始值`,
        `${prefix}${item.label}结束值`,
      ]
    } else {
      ;(item.placeholder as string) = `${prefix}${item.label}`
    }
  }
  // 如果是禁用的输入框，不提示 placeholder
  if (item.disabled === true) {
    ;(item.placeholder as string) = ''
  }
  return item
}

/**
 * 设置默认值
 * @param item 字段
 */
function setDefaultValue(
  item: FormRenderItemProps,
  formData = ref({})
): FormRenderItemProps {
  // 如果是区间类型字段
  if (isRangeFlags(item.type)) {
    if (isArray(item.prop) && item.prop.length) {
      // prop 为数组类型
      formData.value[item.prop[0]] =
        formData.value[item.prop[0]] ?? (item.defaultValue as Array<any>)?.[0]
      formData.value[item.prop[1]] =
        formData.value[item.prop[1]] ?? (item.defaultValue as Array<any>)?.[1]
    } else {
      // prop 为字符串类型
      isUndefined(formData.value[item.prop as string]) &&
        (formData.value[item.prop as string] = [
          (item.defaultValue as Array<any>)?.[0],
          (item.defaultValue as Array<any>)?.[1],
        ])
    }
  } else {
    isUndefined(formData.value[item.prop as string]) &&
      (formData.value[item.prop as string] = item.defaultValue)
  }
  return item
}

/**
 * 设置校验规则
 * @param item 字段
 */
function setRules(
  item: FormRenderItemProps,
  formRules = reactive({})
): FormRenderItemProps {
  if (!isArray(item.rules) && isObject(item.rules)) {
    // rules为对象时
    item.rules = [item.rules as FormItemRule]
  }
  if (isArray(item.rules)) {
    if (isRangeFlags(item.type) && item.split && isArray(item.prop)) {
      // 如果是区间分离输入框
      formRules[item.prop[0]] = buildRules(item, '起始')
      formRules[item.prop[1]] = buildRules(item, '结束')
    } else if (
      isArray(item.prop) &&
      item.type &
        (FieldFlags.datetimerange |
          FieldFlags.daterange |
          FieldFlags.monthrange)
    ) {
      // 如果是区间输入框
      formRules[item.prop[0]] = buildRules(item)
    } else {
      formRules[item.prop as string] = buildRules(item)
    }
  }
  return item
}

/**
 * 构造字段的校验规则
 * @param item 字段
 * @returns 返回处理后的字段
 */
function buildRules(
  item: FormRenderItemProps,
  rangeLabel = ''
): FormItemRule[] {
  return (item.rules as Array<FormItemRule>).map((rule: FormItemRule) => {
    // 未设置触发方式，则默认为 blur & change
    if (!rule.trigger) {
      // 因为是 fork ElementPlus 的代码，所以代码已经落后好多版本了，这里使用的是 字符串
      rule.trigger = 'change' // ['blur', 'change']
    }

    if (rule.required) {
      rule.message = rule.message ?? `${item.label}${rangeLabel}为必填项`
    }

    if (rule.min && rule.min >= 0 && rule.max) {
      // 最大长度，最小长度都设置了
      rule.message =
        rule.message ??
        `${item.label}长度应在 ${rule.min} ~ ${rule.max} 个字符之间`
    } else if (rule.min) {
      // 设置了最小长度
      rule.message =
        rule.message ?? `${item.label}长度至少为 ${rule.min} 个字符`
    } else if (rule.max) {
      // 设置了最大长度
      rule.message =
        rule.message ?? `${item.label}长度最多为 ${rule.max} 个字符`
    }
    return rule
  })
}

export function useForm() {
  return {
    setDefaultProps,
    setDefaultValue,
    setRules,
  }
}
