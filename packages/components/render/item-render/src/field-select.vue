<template>
  <el-select
    v-model="model"
    :clearable="clearable"
    v-bind="$attrs"
    v-on="emitsBinding"
  >
    <el-option
      v-for="item in selectOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    ></el-option>
  </el-select>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onBeforeMount, toRaw } from 'vue'
import { useEventBus, useVModel } from '@vueuse/core'
import _ from 'lodash'
import { ElSelect, ElOption } from '@element-plus/components'
import { useFetch } from '@element-plus/hooks'
import { debugWarn } from '@element-plus/utils'
import { EVENTBUS_SELECT_OPTIONS } from '../../shared/constants'
import { selectFieldProps } from './index'

// select 组件的事件
const emits = [
  'change',
  'remove-tag',
  'clear',
  'visible-change',
  'focus',
  'blur',
]

const COMPONENT_NAME = 'SelectField'
const selectFieldDebugWarn = _.curry(debugWarn)(COMPONENT_NAME)

export default defineComponent({
  name: COMPONENT_NAME,
  components: {
    ElSelect,
    ElOption,
  },
  inheritAttrs: false,
  props: selectFieldProps,
  emits: ['update:modelValue'].concat(emits),
  setup(props, { emit, attrs }) {
    const bus = useEventBus(EVENTBUS_SELECT_OPTIONS)
    const model = useVModel(props)

    const setOptions = (options: any[] = []) => {
      const {
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
    }

    const selectOptions = ref<any[]>(setOptions(props.options))

    const upwardEmits = (emits: string[]) =>
      emits.reduce((acc, cur) => {
        acc[cur] = (...args) => emit(cur, ...args)
        return acc
      }, {})

    const emitsBinding = upwardEmits(emits)

    watch(
      () => selectOptions.value,
      (val) => {
        bus.emit(attrs.class, toRaw(val))
      }
    )

    // watch(
    //   () => model.value,
    //   (val) => {
    //     emit('change', val)
    //   }
    // )

    onBeforeMount(async () => {
      // options 为空 并设置了 api 属性
      if (!props.options.length && props.api) {
        const { axios } = useFetch()
        if (!axios.value) {
          selectFieldDebugWarn('请使用 el-config-provider 并提供 axios 属性')
          return
        }
        const { url, method = 'get', params = {} } = props.api
        await axios
          .value({
            method,
            url,
            params,
          })
          .then(({ data }) => {
            const records = _.result(
              data,
              String(props.api?.props?.records || 'data'),
              []
            )
            selectOptions.value = setOptions(records)
          })
      }
    })

    return {
      model,
      selectOptions,
      emitsBinding,
    }
  },
})
</script>
