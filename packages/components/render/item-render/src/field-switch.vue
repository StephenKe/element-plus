<template>
  <el-switch v-model="value" v-bind="$attrs"></el-switch>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { ElSwitch } from '@element-plus/components'
import type { PropType } from 'vue'

type SwitchModelValue = string | number | boolean

export default defineComponent({
  components: {
    ElSwitch,
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, Boolean] as PropType<SwitchModelValue>,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const value = computed<SwitchModelValue>({
      get() {
        return props.modelValue as SwitchModelValue
      },
      set(val) {
        emit('update:modelValue', val)
      },
    })

    return {
      value,
    }
  },
})
</script>
