<template>
  <div :class="[ns.b(), isString(prop) ? prop : '']">
    <el-item-render
      v-model="startModel"
      :class="isString(prop) ? '' : prop[0]"
      v-bind="startOtherProps"
      :type="type"
      :placeholder="startPlaceholder"
      @update:model-value="handleStartModelUpdate"
    ></el-item-render>
    <div class="separator">{{ rangeSeparator }}</div>
    <el-item-render
      v-model="endModel"
      :class="isString(prop) ? '' : prop[1]"
      v-bind="endOtherProps"
      :type="type"
      :placeholder="endPlaceholder"
      @update:model-value="handleEndModelUpdate"
    ></el-item-render>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import { isString } from '@vue/shared'
import { merge } from 'lodash'
import { useNamespace } from '@element-plus/hooks'
import { FieldFlags, isDateFlags } from '../../shared/FieldFlags'
import ElItemRender from './index.vue'
import { itemSplitRenderProps } from './index'
import type { ItemSplitRenderProps } from './index'

export default defineComponent({
  name: 'ElItemSplitRender',
  components: {
    ElItemRender,
  },
  inheritAttrs: false,
  props: itemSplitRenderProps,
  emits: ['update:start', 'update:end'],
  setup(props: ItemSplitRenderProps, { attrs, emit }) {
    const ns = useNamespace('item-split-render')

    const startPlaceholder = computed<string>(
      () => props?.placeholder?.[0] ?? '请输入'
    )
    const endPlaceholder = computed<string>(
      () => props?.placeholder?.[1] ?? '请输入'
    )

    // const [startVal, endVal] = isArray(props.prop)
    //   ? [props.modelValue?.[props.prop[0]], props.modelValue?.[props.prop[1]]]
    //   : [
    //       props.modelValue?.[props.prop]?.[0],
    //       props.modelValue?.[props.prop]?.[1],
    //     ]

    // const startModel = ref<any>(startVal)
    // const endModel = ref<any>(endVal)
    const startModel = ref<any>(props.start)
    const endModel = ref<any>(props.end)

    const disabledStartDate = (time: Date) =>
      endModel.value
        ? time.getTime() > new Date(endModel.value).getTime()
        : false

    const disabledEndDate = (time: Date) =>
      startModel.value
        ? time.getTime() < new Date(startModel.value).getTime()
        : false

    const type = ref<string>(
      (isString(props.type) ? props.type : FieldFlags[props.type]).replace(
        /range$/,
        ''
      )
    )

    // 字段类型标记
    const typeFlag = computed<number>(() => FieldFlags[type.value])

    // 其他未在 props 里声明的属性
    const startOtherProps = computed<Record<string, any>>(() => {
      // 额外属性
      const extra: Record<string, any> = {}
      // 如果是日期类型字段，默认赋值 disabledDate 属性
      if (isDateFlags(typeFlag.value)) {
        extra.disabledDate = disabledStartDate
      }
      return merge(extra, attrs)
    })
    const endOtherProps = computed<Record<string, any>>(() => {
      const extra: Record<string, any> = {}
      if (isDateFlags(typeFlag.value)) {
        extra.disabledDate = disabledEndDate
      }
      return merge(extra, attrs)
    })

    const handleStartModelUpdate = (val: any) => {
      startModel.value = val
    }

    const handleEndModelUpdate = (val: any) => {
      endModel.value = val
    }

    watch(
      () => props.start,
      (val) => {
        startModel.value = val
      }
    )

    watch(
      () => props.end,
      (val) => {
        endModel.value = val
      }
    )

    watch(
      () => startModel.value,
      (val) => {
        // const modelValue = props.modelValue ?? {}
        // if (isArray(props.prop)) {
        //   Object.assign(modelValue, {
        //     [props.prop[0]]: val,
        //   })
        // } else {
        //   Object.assign(modelValue, {
        //     [props.prop]: [val, modelValue[props.prop]?.[1]],
        //   })
        // }
        // emit(UPDATE_MODEL_EVENT, modelValue)
        emit('update:start', val)
      }
    )

    watch(
      () => endModel.value,
      (val) => {
        // const modelValue = props.modelValue ?? {}
        // if (isArray(props.prop)) {
        //   Object.assign(modelValue, {
        //     [props.prop[1]]: val,
        //   })
        // } else {
        //   Object.assign(modelValue, {
        //     [props.prop]: [modelValue[props.prop]?.[0], val],
        //   })
        // }
        // emit(UPDATE_MODEL_EVENT, modelValue)
        emit('update:end', val)
      }
    )

    return {
      ns,
      startModel,
      endModel,
      type,
      startPlaceholder,
      endPlaceholder,
      startOtherProps,
      endOtherProps,
      isString,
      disabledStartDate,
      disabledEndDate,
      handleStartModelUpdate,
      handleEndModelUpdate,
    }
  },
})
</script>
