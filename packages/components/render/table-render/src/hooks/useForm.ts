//@ts-nocheck
import { ref, reactive, computed, watch } from 'vue'
import { hasOwn, isArray, isFunction } from '@vue/shared'
import { isBoolean as isBool } from '@element-plus/utils'
import { ItemType } from '@element-plus/components'
import type { ItemRenderProps } from '@element-plus/components'
import type { FormItemRule } from '@element-plus/tokens'

/**
 * 设置字段的默认属性
 * @param item 字段
 * @returns 返回处理后的字段
 */
function setDefaultProps(item: ItemRenderProps): ItemRenderProps {
  // 默认为 text
  if (!item.type) {
    item.type = ItemType.Text
  }

  // 跨字段
  item.colSpan = isNaN(item.colSpan) ? 1 : Number(item.colSpan)

  if (ItemType.Text === item.type || ItemType.TextArea === item.type) {
    // 默认长度
    const maxLengthMap = {
      [ItemType.Text]: 60,
      [ItemType.TextArea]: 200,
    }
    if (!hasOwn(item, 'maxlength')) {
      item.maxlength = maxLengthMap[item.type]
    }
  } else if (ItemType.Select === item.type || ItemType.Radio === item.type) {
    if (!hasOwn(item, 'options')) {
      item.options = []
    }
  }
  return item
}

/**
 * 构造字段的校验规则
 * @param item 字段
 * @returns 返回处理后的字段
 */
function buildRules(item: ItemRenderProps, rangeLabel = '') {
  return item.rules!.map((rule: FormItemRule) => {
    // 未设置触发方式，则默认为 blur & change
    if (!rule.trigger) {
      // 因为是 fork ElementPlus 的代码，所以代码已经落后好多版本了，这里使用的是 字符串
      rule.trigger = 'blur, change' // ['blur', 'change']
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

export function useForm(items: ItemRenderProps[] = [], defaultFormData = {}) {
  const formData = reactive({})
  const formRules = reactive({})
  const formItem = ref<ItemRenderProps[]>(initFormItem(items))

  const showFormItem = computed(() =>
    formItem.value.filter((item: ItemRenderProps) => {
      if (isBool(item.visible)) {
        return item.visible
      }
      if (isFunction(item.visible)) {
        return item.visible(item, formData)
      }
      return true
    })
  )

  /**
   * 设置默认值
   * @param item 字段
   */
  function setDefaultValue(item: ItemRenderProps) {
    if (item.range && item.start && item.end) {
      formData[item.start] = item.defaultValue
        ? item.defaultValue[0]
        : defaultFormData[item.start]
      formData[item.end] = item.defaultValue
        ? item.defaultValue[1]
        : defaultFormData[item.start]
    } else {
      formData[item.prop] = item.defaultValue ?? defaultFormData[item.prop]
    }
  }

  function initFormItem(items: ItemRenderProps[]) {
    return items.map((item: ItemRenderProps) => {
      // 设置默认属性
      setDefaultProps(item)

      // 设置了 rules 时
      if (isArray(item.rules)) {
        // 如果是区间输入框
        if (item.range && item.start && item.end) {
          formRules[item.start] = buildRules(item, '起始')
          formRules[item.end] = buildRules(item, '结束')
        } else {
          formRules[item.prop] = buildRules(item)
        }
      }

      // 设置默认值
      setDefaultValue(item)

      return item
    })
  }

  function resetFormData() {
    formItem.value.forEach((item) => {
      setDefaultValue(item)
    })
  }

  watch(
    defaultFormData,
    (val) => {
      Object.assign(formData, val)
    },
    {
      deep: true,
    }
  )

  return {
    formItem,
    formData,
    formRules,
    showFormItem,
    resetFormData,
  }
}
