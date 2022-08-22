<template>
  <el-input-number v-model="value" v-bind="$attrs"></el-input-number>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { ElInputNumber } from '@element-plus/components'

export default defineComponent({
  components: {
    ElInputNumber,
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const value = computed<number>({
      get() {
        return props.modelValue as number
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
