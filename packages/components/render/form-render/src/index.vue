<template>
  <el-form
    ref="formRef"
    :class="ns.b()"
    inline
    :size="size"
    :label-width="labelWidth"
    :model="formData"
    :rules="formRules"
  >
    <template v-for="(item, index) in showFormItem" :key="item.prop">
      <el-form-item
        :label="`${item.label}${item.colon ?? colon ? '：' : ''}`"
        :label-width="item.labelWidth || labelWidth"
        :prop="item.prop || item.start || item.end"
        :size="size"
        :class="item.prop"
        :style="formItemStyle(item)"
      >
        <template v-if="item.type === 'slot'">
          <slot
            v-if="$slots[item.prop]"
            :name="item.prop"
            :form="formData"
            :item="item"
            :index="index"
          ></slot>
        </template>
        <el-item-range-render
          v-else-if="item.range"
          v-model="formData"
          v-bind="item"
        ></el-item-range-render>
        <el-item-render
          v-else
          v-model="formData[item.prop]"
          v-bind="item"
        ></el-item-render>
      </el-form-item>
    </template>
    <el-form-item v-if="buttonVisible">
      <el-button v-if="resetVisible" @click="onReset">
        {{ resetText }}
      </el-button>
      <el-button
        v-if="submitVisible"
        :loading="loading"
        type="primary"
        @click="onSubmit"
      >
        {{ submitText }}
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent, ref, computed, watch } from 'vue'
import { useNamespace } from '@element-plus/hooks'
import {
  ElForm,
  ElFormItem,
  ElButton,
  ElItemRender,
  ElItemRangeRender,
} from '@element-plus/components'
import { UPDATE_MODEL_EVENT } from '@element-plus/constants'
import { useForm } from '../../table-render/src/hooks'
import {
  renderFormProps as formProps,
  renderFormEmits as formEmits,
} from './index'
import type { SetupContext } from 'vue'
import type { ValidateFieldsError } from 'async-validator'
import type { RenderFormProps as FormProps } from './index'
import type { ItemRenderProps } from '@element-plus/components/render/item-render'

export default defineComponent({
  name: 'ElFormRender',
  components: {
    ElForm,
    ElFormItem,
    ElButton,
    ElItemRender,
    ElItemRangeRender,
  },
  props: formProps,
  emits: formEmits,
  setup(props: FormProps, { emit, expose }: SetupContext) {
    const ns = useNamespace('form-render')
    const size = ref(props.size)
    const formRef = ref<InstanceType<typeof ElForm>>()
    const labelWidth = ref(props.labelWidth)
    const colon = ref(props.colon)
    const loading = ref(false)
    const { formItem, showFormItem, formData, formRules } = useForm(
      props.formItem,
      props.modelValue
    )
    const resetVisible = computed(() => props.resetVisible)
    const resetText = computed(() => props.resetText)
    const submitVisible = computed(() => props.submitVisible)
    const submitText = computed(() => props.submitText)
    const buttonVisible = computed(
      () => props.resetVisible || props.submitVisible
    )
    const widthPercent = computed(() => +(100 / props.rowSize).toFixed(2))

    const formItemStyle = (col: ItemRenderProps) => {
      // 跨度值不能大于 rowSize
      const colSpan = Math.min(col.colSpan || 1, props.rowSize)
      return {
        flex: `0 0 ${widthPercent.value * colSpan}%`,
        maxWidth: `${widthPercent.value * colSpan}%`,
      }
    }

    const stopLoading = () => {
      loading.value = false
    }

    const onReset = () => {
      // 清空 form 属性
      for (const p in formData) {
        delete formData[p]
      }
      formRef.value?.resetFields()
      emit('on-reset', formData)
    }

    const onSubmit = () => {
      loading.value = true
      formRef.value?.validate(
        (isValid?: boolean, invalidFields?: ValidateFieldsError) => {
          // 验证通过
          if (isValid) {
            emit('on-submit', formData, stopLoading)
          } else {
            stopLoading()
            emit('validateFieldsError', invalidFields)
          }
        }
      )
    }

    watch(formData, (val) => {
      emit(UPDATE_MODEL_EVENT, val)
    })

    expose({
      onReset,
      onSubmit,
    })

    return {
      ns,
      size,
      colon,
      labelWidth,
      resetVisible,
      resetText,
      submitVisible,
      submitText,
      loading,
      formRef,
      formData,
      formRules,
      showFormItem,
      formItem,
      buttonVisible,
      formItemStyle,
      onReset,
      onSubmit,
    }
  },
})
</script>
