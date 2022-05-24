<template>
  <!-- 开区间(两个输入框字段独立存在) -->
  <div v-if="stage" class="range-stage">
    <el-date-picker
      v-model="startModel"
      v-bind="otherProps"
      :type="type"
      :disabled="disabled"
      :placeholder="startPlaceholder"
      :disabled-date="disabledStartDate"
      @change="handleDateStartChange"
    />
    <div class="separator">{{ rangeSeparator }}</div>
    <el-date-picker
      v-model="endModel"
      v-bind="otherProps"
      :type="type"
      :disabled="disabled"
      :placeholder="endPlaceholder"
      :disabled-date="disabledEndDate"
      @change="handleDateEndChange"
    />
  </div>
  <!-- 闭区间 -->
  <template v-else>
    <el-date-picker
      v-model="model"
      v-bind="otherProps"
      :type="type + 'range'"
      :disabled="disabled"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :range-separator="rangeSeparator"
    />
  </template>
</template>
<script lang="ts">
//@ts-nocheck
import {
  defineComponent,
  ref,
  computed,
  onBeforeMount,
  watchEffect,
  watch,
} from 'vue'
import { isFunction, isArray } from '@vue/shared'
import _ from 'lodash'
import { ElDatePicker } from '@element-plus/components'
import { UPDATE_MODEL_EVENT } from '@element-plus/constants'
import { isUndefined, debugWarn } from '@element-plus/utils'
import { itemRenderProps, ItemType } from './index'
import type { SetupContext } from 'vue'
import type { ItemRenderProps } from './index'

const COMPONENT_NAME = 'ElItemRangeRender'
const rangeDebugWarn = _.curry(debugWarn)(COMPONENT_NAME)

export default defineComponent({
  name: COMPONENT_NAME,
  components: {
    ElDatePicker,
  },
  props: itemRenderProps,
  emits: [UPDATE_MODEL_EVENT],
  setup(props: ItemRenderProps, { attrs, emit }: SetupContext) {
    const rangeSeparator = ref(props.rangeSeparator)

    const startPlaceholder = computed(() => {
      if (props.startPlaceholder) return props.startPlaceholder
      if (props.disabled) return ''
      return `起始${props.label}`
    })

    const endPlaceholder = computed(() => {
      if (props.endPlaceholder) return props.endPlaceholder
      if (props.disabled) return ''
      return `结束${props.label}`
    })

    const hasOwnProp = !isUndefined(props.prop)

    const startModel = ref(null)
    const endModel = ref(null)
    if (hasOwnProp && Array.isArray(props.modelValue![props.prop!])) {
      startModel.value = props.modelValue![props.prop!][0] ?? null
      endModel.value = props.modelValue![props.prop!][1] ?? null
    } else {
      startModel.value = props.modelValue![props.start!] ?? null
      endModel.value = props.modelValue![props.end!] ?? null
    }

    const model = computed({
      get() {
        return [startModel.value, endModel.value]
      },
      set(val: any) {
        // 有 prop 属性，则赋值给 prop，没有则赋值给 start， end
        if (hasOwnProp) {
          if (!val || val.every(isUndefined)) {
            props.modelValue![props.prop!] = undefined
          } else {
            props.modelValue![props.prop!] = val
          }
        } else {
          if (isArray(val)) {
            props.modelValue![props.start!] = val[0] ?? undefined
            props.modelValue![props.end!] = val[1] ?? undefined
          } else if (val === null) {
            props.modelValue![props.start!] = undefined
            props.modelValue![props.end!] = undefined
          }
        }
        if (isArray(val)) {
          startModel.value = val[0]
          endModel.value = val[1]
        } else if (val === null) {
          startModel.value = null
          endModel.value = null
        }
        emit(UPDATE_MODEL_EVENT, props.modelValue)
      },
    })

    // 是否禁用，可以给定一个 boolean 类型的值或者返回 boolean 的函数
    const disabled = computed(() =>
      isFunction(props.disabled) ? props.disabled(model.value) : props.disabled
    )

    // 其他属性
    const otherProps = computed(() => attrs)

    watchEffect(() => {
      if (startModel.value || endModel.value) {
        model.value = [startModel.value, endModel.value]
      }
    })

    const disabledStartDate = (time: Date) =>
      endModel.value
        ? time.getTime() > new Date(endModel.value).getTime()
        : false

    const disabledEndDate = (time: Date) =>
      startModel.value
        ? time.getTime() < new Date(startModel.value).getTime()
        : false

    const handleDateStartChange = (val: Date) => {
      // 清空
      if (!val) {
        model.value = [undefined, endModel.value]
      }
    }

    const handleDateEndChange = (val: Date) => {
      // 清空
      if (!val) {
        model.value = [startModel.value, undefined]
      }
    }

    watch(props.modelValue, (val) => {
      // 只处理区间输入框
      if (props.range) {
        if (props.prop) {
          model.value = val[props.prop]
        } else {
          model.value = [val[props.start!], val[props.end!]]
        }
      }
    })

    onBeforeMount(() => {
      if (props.stage) {
        if ([ItemType.Year, ItemType.Week].includes(props.type)) {
          rangeDebugWarn(`没有 type 为 ${props.type} 的闭区间`)
        }
      } else {
        if ([ItemType.Year].includes(props.type)) {
          rangeDebugWarn(`没有 type 为 ${props.type} 的开区间`)
        }
      }
    })

    return {
      startModel,
      endModel,
      model,
      disabled,
      rangeSeparator,
      startPlaceholder,
      endPlaceholder,
      otherProps,
      disabledStartDate,
      disabledEndDate,
      handleDateStartChange,
      handleDateEndChange,
    }
  },
})
</script>
