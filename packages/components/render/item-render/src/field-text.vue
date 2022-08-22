<template>
  <el-input v-model="value" :clearable="clearable" :type="type" v-bind="$attrs">
    <template v-for="slot in Object.keys($slots)" :key="slot" #[slot]>
      <slot :name="slot" :value="value" :attrs="$attrs"></slot>
    </template>
  </el-input>
</template>
<script lang="ts">
import { defineComponent, computed, inject } from 'vue'
import { ElInput } from '@element-plus/components'

export default defineComponent({
  components: {
    ElInput,
  },
  inheritAttrs: false,
  props: {
    modelValue: String,
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const value = computed<string>({
      get() {
        return props.modelValue as string
      },
      set(val) {
        emit('update:modelValue', val)
      },
    })

    const type = inject<string>('type')

    return {
      value,
      type,
    }
  },
})
</script>
