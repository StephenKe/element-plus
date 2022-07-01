<template>
  <el-date-picker v-model="value" :type="type" v-bind="$attrs">
    <template v-for="slot in Object.keys($slots)" :key="slot" #[slot]>
      <slot :name="slot" :value="value" :attrs="$attrs"></slot>
    </template>
  </el-date-picker>
</template>
<script lang="ts">
import { defineComponent, computed, inject } from 'vue'
import { ElDatePicker } from '@element-plus/components'
import type { PropType } from 'vue'
import type { IDatePickerType } from '@element-plus/components/date-picker/src/date-picker.type'

type DateModelValue = number | string | Date | (number | string | Date)[]

export default defineComponent({
  components: {
    ElDatePicker,
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [Date, Array, String, Number] as PropType<DateModelValue>,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const value = computed<DateModelValue>({
      get() {
        return props.modelValue as DateModelValue
      },
      set(val) {
        emit('update:modelValue', val)
      },
    })

    const type = inject<IDatePickerType>('type')

    return {
      value,
      type,
    }
  },
})
</script>
