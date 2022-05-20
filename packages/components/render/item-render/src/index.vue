<template>
  <!-- 下拉选择框 -->
  <el-select
    v-if="type === 'select'"
    v-model="modelValue"
    v-bind="otherProps"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :multiple="multiple"
    filterable
    collapse-tags
    collapse-tags-tooltip
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    ></el-option>
  </el-select>

  <!-- 单选框 -->
  <el-radio-group
    v-else-if="type === 'radio'"
    v-model="modelValue"
    v-bind="otherProps"
    :disabled="disabled"
  >
    <component
      :is="radioType === 'radio' ? 'el-radio' : 'el-radio-button'"
      v-for="item in options"
      :key="item.value"
      :label="item.value"
      :disabled="item.disabled"
    >
      {{ item.label }}
    </component>
  </el-radio-group>

  <!-- 日期选择框 -->
  <el-date-picker
    v-else-if="dateTypes.includes(type)"
    v-model="modelValue"
    v-bind="otherProps"
    :placeholder="placeholder"
    :type="type"
    :format="format"
    :clearable="clearable"
    :disabled="disabled"
  />

  <!-- switch开关 -->
  <el-switch
    v-else-if="type === 'switch'"
    v-model="modelValue"
    v-bind="otherProps"
    :disabled="disabled"
  />

  <!-- 多行文本框 -->
  <el-input
    v-else-if="type === 'textarea'"
    v-model="modelValue"
    v-bind="otherProps"
    :placeholder="placeholder"
    type="textarea"
    :rows="rows"
    :show-word-limit="showWordLimit"
    :autosize="autosize"
    :maxlength="maxlength"
  ></el-input>

  <!-- 货币输入框 -->
  <!-- <el-input
    v-else-if="type === 'currency'"
    v-model="modelValue"
    v-bind="otherProps"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :maxlength="maxlength"
  >
    <template #prepend>￥</template>
  </el-input> -->

  <!-- 数字输入框 -->
  <el-input-number
    v-else-if="type === 'number'"
    v-model="modelValue"
    v-bind="otherProps"
    :placeholder="placeholder"
  />

  <!-- 文本输入框 -->
  <el-input
    v-else
    v-model="modelValue"
    v-bind="otherProps"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :maxlength="maxlength"
  ></el-input>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent, computed } from 'vue'
import { isFunction, isString } from '@vue/shared'
import {
  ElInput,
  ElRadioGroup,
  ElRadio,
  ElRadioButton,
  ElSelect,
  ElOption,
  ElSwitch,
  ElDatePicker,
  ElInputNumber,
} from '@element-plus/components'
import { UPDATE_MODEL_EVENT } from '@element-plus/constants'
import { itemRenderProps, ItemType } from './index'
import type { ItemRenderProps } from './index'
import type { SetupContext } from 'vue'

const dateTypes = [
  ItemType.Year,
  ItemType.Month,
  ItemType.Date,
  ItemType.Dates,
  ItemType.Datetime,
  ItemType.Week,
]
const dateFormat = {
  [ItemType.Year]: 'YYYY',
  [ItemType.Month]: 'YYYY-MM',
  [ItemType.Date]: 'YYYY-MM-DD',
  [ItemType.Dates]: 'YYYY-MM-DD',
  [ItemType.Datetime]: 'YYYY-MM-DD HH:mm:ss',
  [ItemType.Week]: 'YYYY年 第w周',
}
const placeholderPrefix = (type: ItemType) =>
  [ItemType.Select, ItemType.Radio].concat(dateTypes).includes(type)
    ? '请选择'
    : '请输入'

export default defineComponent({
  name: 'ElItemRender',
  components: {
    ElInput,
    ElRadioGroup,
    ElRadio,
    ElRadioButton,
    ElSelect,
    ElOption,
    ElSwitch,
    ElDatePicker,
    ElInputNumber,
  },
  props: itemRenderProps,
  emits: [UPDATE_MODEL_EVENT],
  setup(props: ItemRenderProps, { attrs, emit }: SetupContext) {
    const modelValue = computed({
      get() {
        // 如果提供的 valueFormat
        if (isFunction(props.valueFormat)) {
          return props.valueFormat(props.modelValue)
        }
        if (props.modelValue) {
          return props.modelValue
        }
        if ([ItemType.Text, ItemType.Radio].includes(props.type)) {
          return props.modelValue ?? ''
        }
        if (ItemType.Select === props.type) {
          return props.modelValue ?? (props.multiple ? [] : '')
        }
        if (ItemType.Switch === props.type) {
          return Boolean(props.modelValue) ?? false
        }
        if (ItemType.Number === props.type) {
          return Number(props.modelValue ?? props.min ?? 0)
        }
        return null
      },
      set(val) {
        emit(UPDATE_MODEL_EVENT, val)
      },
    })

    // el-date-picker format
    const format = computed(() => {
      if (dateTypes.includes(props.type)) {
        return props.format || dateFormat[props.type]
      }
      return ''
    })

    // placeholder 提示
    const placeholder = computed(() => {
      if (props.placeholder) {
        return props.placeholder
      }
      // 如果是禁用的输入框，且用户没有设置 placeholder，则不展示
      if (disabled.value) {
        return ''
      }
      return `${placeholderPrefix(props.type)}${props.label}`
    })

    // 是否禁用，可以给定一个 boolean 类型的值或者返回 boolean 的函数
    const disabled = computed(() =>
      isFunction(props.disabled)
        ? props.disabled(modelValue.value)
        : props.disabled
    )

    // 其他属性
    const otherProps = computed(() => attrs)

    return {
      dateTypes,
      modelValue,
      placeholder,
      disabled,
      format,
      otherProps,
    }
  },
})
</script>
