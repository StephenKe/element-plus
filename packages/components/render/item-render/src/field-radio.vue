<template>
  <el-radio-group v-model="value" v-bind="$attrs">
    <component
      :is="component"
      v-for="item in radioOptions"
      :key="item.value"
      :label="item.value"
      :disabled="item.disabled"
    >
      {{ item.label }}
    </component>
  </el-radio-group>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { ElRadioGroup, ElRadio, ElRadioButton } from '@element-plus/components'
import type { PropType } from 'vue'

type RadioModelValue = string | number | boolean

type RadioType = 'radio' | 'button'

export default defineComponent({
  components: {
    ElRadioGroup,
    ElRadio,
    ElRadioButton,
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [Date, Array, String, Number] as PropType<RadioModelValue>,
    },
    /**
     * 下拉选项映射
     */
    optionProps: {
      type: Object as PropType<{ label: string; value: string }>,
      default: () => ({
        // 展示值
        label: 'label',
        // 实际值
        value: 'value',
      }),
    },
    /**
     * 下拉选项
     */
    options: {
      type: Array,
      default: () => [],
    },
    /**
     * 只包含哪些值
     */
    includes: {
      type: Array,
      default: () => [],
    },
    /**
     * 排除哪些值
     */
    excludes: {
      type: Array,
      default: () => [],
    },
    /**
     * 选项类型
     */
    radioType: {
      type: String as PropType<RadioType>,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const value = computed<RadioModelValue>({
      get() {
        return props.modelValue as RadioModelValue
      },
      set(val) {
        emit('update:modelValue', val)
      },
    })

    const radioOptions = computed(() => {
      const {
        options,
        includes,
        excludes,
        optionProps: { label, value },
      } = props
      let transOptions = options.map((e: any) => ({
        ...e,
        label: e[label],
        value: e[value],
      }))

      // 只包含
      if (includes.length)
        transOptions = transOptions.filter((e: any) =>
          includes.includes(e.value)
        )

      // 排除
      if (excludes.length)
        transOptions = transOptions.filter(
          (e: any) => !excludes.includes(e.value)
        )

      return transOptions
    })

    const component = computed(() =>
      props.radioType === 'button' ? ElRadioButton : ElRadio
    )

    return {
      value,
      radioOptions,
      component,
    }
  },
})
</script>
