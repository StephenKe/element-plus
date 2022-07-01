<template>
  <component
    :is="component"
    v-model="currentValue"
    :class="prop"
    v-bind="otherProps"
  >
    <template
      v-for="slot in Object.keys($slots)"
      :key="slot"
      #[slot]="slotProps"
    >
      <slot :name="slot" v-bind="slotProps" />
    </template>
  </component>
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch, provide, toRaw } from 'vue'
import { isString, isArray } from '@vue/shared'
import { clone, merge } from 'lodash'
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
import { isUndefined } from '@element-plus/utils'
import { FieldFlags, isRangeFlags, isDateFlags } from '../../shared/FieldFlags'
import { formItemProps } from '../../form-render/src/index'
import fieldText from './field-text.vue'
import fieldDate from './field-date.vue'
import fieldNumber from './field-number.vue'
import fieldRadio from './field-radio.vue'
import fieldSelect from './field-select.vue'
import fieldSwitch from './field-switch.vue'
import { itemRenderProps } from './index'
import type { ItemRenderProps } from './index'
import type { SetupContext } from 'vue'

// 非以下几个属性外，其他属性排除掉
const excludeProps = Object.keys(formItemProps).filter(
  (key: string) =>
    !['disabled', 'maxlength', 'placeholder', 'prop'].includes(key)
)

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
  inheritAttrs: false,
  props: itemRenderProps,
  emits: [UPDATE_MODEL_EVENT, 'update:start', 'update:end'],
  setup(props: ItemRenderProps, { attrs, emit }: SetupContext) {
    const initialVal = computed(() => {
      if (isArray(props.prop) && isRangeFlags(props.type)) {
        return [props.start, props.end].every(isUndefined)
          ? undefined
          : [props.start, props.end]
      } else {
        return props.modelValue
      }
    })
    const currentValue = ref<any>(initialVal.value)

    // 字段类型标记
    const typeFlag = computed<number>(
      () =>
        (isString(props.type) ? FieldFlags[props.type] : props.type) as number
    )

    // 字段类型
    const type = computed<string>(() => FieldFlags[typeFlag.value] as string)

    // 其他未在 props 里声明的属性，通过 v-bind 传递给子组件
    const otherProps = computed(() => {
      const cloneAttrs = clone(toRaw(attrs))
      // 有值时
      if (isArray(excludeProps) && excludeProps.length) {
        // 属性少的用来循环
        if (Object.keys(cloneAttrs).length > excludeProps.length) {
          excludeProps.forEach((key: string) => {
            Reflect.deleteProperty(cloneAttrs, key)
          })
        } else {
          Object.keys(cloneAttrs).forEach((key: string) => {
            if (excludeProps.includes(key)) {
              Reflect.deleteProperty(cloneAttrs, key)
            }
          })
        }
      }
      return merge({}, cloneAttrs)
    })

    const component = computed(() => {
      if (typeFlag.value & FieldFlags.number) return fieldNumber
      if (isDateFlags(typeFlag.value)) return fieldDate
      if (typeFlag.value & FieldFlags.select) return fieldSelect
      if (typeFlag.value & FieldFlags.radio) return fieldRadio
      if (typeFlag.value & FieldFlags.switch) return fieldSwitch
      return fieldText
    })

    watch([() => props.start, () => props.end], (newVal) => {
      if (newVal.every(isUndefined)) {
        currentValue.value = []
      } else {
        currentValue.value = newVal
      }
    })

    watch(
      () => props.modelValue,
      (val) => {
        currentValue.value = val
      }
    )

    watch(
      () => currentValue.value,
      (val) => {
        if (isArray(props.prop)) {
          emit('update:start', val?.[0])
          emit('update:end', val?.[1])
        } else {
          emit(UPDATE_MODEL_EVENT, val)
        }
      }
    )

    // 提供给子组件使用的
    provide('type', type.value)

    return {
      currentValue,
      otherProps,
      component,
    }
  },
})
</script>
