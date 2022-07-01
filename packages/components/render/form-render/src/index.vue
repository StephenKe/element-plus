<template>
  <el-form
    ref="formRef"
    inline
    inline-message
    :class="ns.b()"
    v-bind="$attrs"
    :size="size"
    :label-width="labelWidth"
    :model="formData"
    :rules="formRules"
  >
    <transition v-for="(item, index) in showFormItem" :key="String(item.prop)">
      <el-form-item
        v-show="isExpanded || index < expandSize"
        :label="`${item.label}${item.colon ?? colon ? '：' : ''}`"
        :label-width="item.labelWidth || labelWidth"
        :prop="String(item.prop)"
        :size="size"
        :class="item.prop"
        :style="formItemStyle(item)"
      >
        <!-- type为slot，代表插槽字段 -->
        <template v-if="item.type & FieldFlags.slot">
          <slot
            v-if="$slots[String(item.prop)]"
            :name="item.prop"
            :form="formData"
            :item="item"
            :index="index"
          ></slot>
        </template>
        <!-- 分离的区间框字段 -->
        <template v-else-if="isRangeFlags(item.type) && item.split">
          <!-- prop为数组，值存储在两个字段中 -->
          <el-item-split-render
            v-if="isArray(item.prop)"
            v-model:start="formData[item.prop[0]]"
            v-model:end="formData[item.prop[1]]"
            v-bind="item"
          ></el-item-split-render>
          <!-- prop为字符串，值存储在数组中 -->
          <el-item-split-render
            v-else
            v-model:start="formData[item.prop][0]"
            v-model:end="formData[item.prop][1]"
            v-bind="item"
          ></el-item-split-render>
        </template>
        <!-- 其他字段 -->
        <template v-else>
          <el-item-render
            v-if="isArray(item.prop)"
            v-model:start="formData[item.prop[0]]"
            v-model:end="formData[item.prop[1]]"
            v-bind="item"
          ></el-item-render>
          <el-item-render
            v-else
            v-model="formData[String(item.prop)]"
            v-bind="item"
            @change="handleChange($event, item)"
          ></el-item-render>
        </template>
      </el-form-item>
    </transition>
    <!-- 按钮操作 -->
    <el-form-item v-if="buttonVisible">
      <!-- 展开/收起 -->
      <slot v-if="expandVisible" name="expand" :expanded="isExpanded">
        <el-button type="text" @click="toggleExpand">
          {{ isExpanded ? '收起' : '展开' }}
          <el-icon class="el-icon--right">
            <component :is="isExpanded ? 'arrow-up' : 'arrow-down'" />
          </el-icon>
        </el-button>
      </slot>
      <!-- 暴露插槽 -->
      <slot name="button" :form-data="formData"></slot>
      <el-button
        v-if="clearButton !== false"
        :type="clearBtnProps.type"
        :size="clearBtnProps.size"
        :disabled="clearBtnProps.disabled"
        :round="clearBtnProps.round"
        @click="onClear"
      >
        {{ clearBtnProps.label }}
      </el-button>
      <el-button
        v-if="resetButton !== false"
        :type="resetBtnProps.type"
        :size="resetBtnProps.size"
        :disabled="resetBtnProps.disabled"
        :round="resetBtnProps.round"
        @click="onReset"
      >
        {{ resetBtnProps.label }}
      </el-button>
      <el-button
        v-if="submitButton !== false"
        :type="submitBtnProps.type"
        :size="submitBtnProps.size"
        :disabled="submitBtnProps.disabled"
        :round="submitBtnProps.round"
        :loading="loading"
        @click="onSubmit"
      >
        {{ submitBtnProps.label }}
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  toRaw,
  onBeforeMount,
  reactive,
} from 'vue'
import { isFunction, isArray } from '@vue/shared'
import { useEventBus, useVModel } from '@vueuse/core'
import { debounce } from 'lodash'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { useNamespace } from '@element-plus/hooks'
import {
  ElIcon,
  ElForm,
  ElFormItem,
  ElButton,
  ElItemRender,
  ElItemSplitRender,
} from '@element-plus/components'
import { merge } from 'lodash'
import { isBoolean } from '@element-plus/utils'
import { FieldFlags, isRangeFlags, useForm } from '../../shared'
import { EVENTBUS_SELECT_OPTIONS } from '../../shared/constants'
import { formProps, formEmits } from './index'
import type { ValidateFieldsError } from 'async-validator'
import type { FormProps, FormItemProps, FormButtonProps } from './index'
import type { Callback } from '@element-plus/components/form/src/form.vue'
import type { SelectFieldProps } from '../../item-render/src/index'
import type { ValidateFieldCallback } from '@element-plus/tokens'

export default defineComponent({
  name: 'ElFormRender',
  components: {
    ElIcon,
    ElForm,
    ElFormItem,
    ElButton,
    ElItemRender,
    ElItemSplitRender,
    ArrowDown,
    ArrowUp,
  },
  inheritAttrs: false,
  props: formProps,
  emits: formEmits,
  setup(props: FormProps, { emit, expose }) {
    const bus = useEventBus(EVENTBUS_SELECT_OPTIONS)
    const ns = useNamespace('form-render')
    /**
     * 是否已展开
     * expandSize 为 -1 表示全部展示
     */
    const isExpanded = ref(props.expandSize === -1)
    /**
     * El-Form ref
     */
    const formRef = ref<InstanceType<typeof ElForm>>()
    /**
     * 表单提交 loading 状态
     */
    const loading = ref(false)
    /**
     * 双向 v-model
     */
    const formData = useVModel(props, 'modelValue', emit, {
      passive: true,
      deep: true,
    })
    /**
     * 表单字段列表
     */
    const formItemList = ref<FormItemProps[]>([])
    /**
     * 表单校验规则
     */
    const formRules = reactive({})
    /**
     * 展示的表单字段列表
     */
    const showFormItem = computed<FormItemProps[]>(() =>
      formItemList.value.filter((item: FormItemProps) => {
        if (isBoolean(item.visible)) return item.visible
        if (isFunction(item.visible))
          return item.visible.call(item, formData.value)
        return true
      })
    )
    const { setDefaultProps, setDefaultValue, setRules } = useForm()
    const expandVisible = computed(
      () =>
        props.expandSize !== -1 && showFormItem.value.length > props.expandSize
    )
    // 按钮栏是否展示
    const buttonVisible = computed(
      () =>
        props.submitButton !== false ||
        props.resetButton !== false ||
        props.clearButton !== false
    )

    const clearBtnProps = computed(() =>
      merge(
        {
          label: '清空',
          type: 'default',
          size: props.size,
        },
        props.clearButton as object
      )
    ) as unknown as FormButtonProps

    const resetBtnProps = computed(() =>
      merge(
        {
          label: '重置',
          type: 'default',
          size: props.size,
        },
        props.resetButton as object
      )
    ) as unknown as FormButtonProps

    const submitBtnProps = computed(() =>
      merge(
        {
          label: '提交',
          type: 'primary',
          size: props.size,
        },
        props.submitButton as object
      )
    ) as unknown as FormButtonProps
    /**
     * 字段宽度百分比
     */
    const widthPercent = computed(() => +(100 / props.rowSize).toFixed(2))
    /**
     * 字段样式
     */
    const formItemStyle = (col: FormItemProps) => {
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

    /**
     * 影响其他字段
     */
    const handleEffect = (val, item: FormItemProps & SelectFieldProps) => {
      for (const toProp in item.effect) {
        const fromProp = item.effect[toProp]
        if (fromProp) {
          const option: any = item.options.find(
            (e: any) => e[item.optionProps.value] === val
          )
          formData.value[toProp] = option?.[fromProp]
        }
      }
    }

    const handleChange = (val, item: FormItemProps) => {
      emit('select-change', val, item)
      // 如果是 select 框，并且配置了 effect 属性
      if (item.type & FieldFlags.select && item.effect) {
        handleEffect(val, item as FormItemProps & SelectFieldProps)
      }
    }

    const onClear = () => {
      // clearFormData()
      formRef.value?.resetFields()
      for (const prop in formData.value) {
        if (isArray(formData.value[prop])) {
          formData.value[prop].length = 0
        } else {
          Reflect.deleteProperty(formData.value, prop)
        }
      }
      emit('clear')
    }

    const onReset = () => {
      // resetFormData()
      formItemList.value.forEach((item) => setDefaultValue(item, formData))
      formRef.value?.resetFields()
      emit('reset', toRaw(formData.value))
    }

    /**
     * 从 showFormItem 中找到最靠前的字段
     */
    const findTopInvalidFormItem = (fieldProps: string[]): FormItemProps =>
      showFormItem.value!.find((item) =>
        fieldProps.includes(item.prop as string)
      ) as FormItemProps

    const handleValidate = async (
      isValid?: boolean,
      invalidFields?: ValidateFieldsError
    ) => {
      if (isValid) {
        // 表单校验通过
        if (isFunction(props.beforeSubmit)) {
          const res = await props.beforeSubmit(toRaw(formData.value))
          // beforeSubmit 返回 false 则表示校验失败，停止往下执行
          if (!res) {
            return
          }
        }
        emit('submit', toRaw(formData.value), stopLoading)
      } else {
        // 如果校验失败，从失败的 prop 数组中，找到最靠前的那一个字段，滚动到此字段处
        const formItem = findTopInvalidFormItem(
          Object.keys(invalidFields as any)
        )
        // 滚动到校验未通过的表单字段
        formRef.value!.scrollToField(formItem.prop as string)
        stopLoading()
        emit('validate-fields-error', invalidFields)
      }
    }

    const initFormItem = () => {
      formItemList.value = props.formItem
        .map(setDefaultProps)
        .map((item) => setDefaultValue(item, formData))
        .map((item) => setRules(item, formRules))
    }

    /**
     * 表单提交
     */
    const handleSubmit = () => {
      loading.value = true
      formRef.value?.validate(handleValidate)
    }

    /**
     * 展示/收起 切换
     */
    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value
    }

    bus.on((target, val) => {
      const item = formItemList.value.find(
        (e) => e.prop === target
      ) as FormItemProps & SelectFieldProps
      if (item) {
        item.options = val
        handleEffect(formData.value[item.prop as string], item)
      }
    })

    /**
     * 防抖提交
     */
    const onSubmit = debounce(handleSubmit, 250, {
      leading: true,
      trailing: false,
    })

    // el-form 方法，暴露出去（组件库由于是fork较早之前版本，所以有些落后了）
    const validate = computed<
      | ((callback?: Callback | undefined) => Promise<boolean> | undefined)
      | undefined
    >(() => formRef.value?.validate)

    // el-form 方法，暴露出去（组件库由于是fork较早之前版本，所以有些落后了）
    const validateField = computed<
      | ((props: string | string[], cb: ValidateFieldCallback) => void)
      | undefined
    >(() => formRef.value?.validateField)

    expose({
      onClear,
      onReset,
      toggleExpand,
      onSubmit,
      validate,
      validateField,
    })

    onBeforeMount(() => {
      initFormItem()
    })

    return {
      ns,
      loading,
      isExpanded,
      formRef,
      formData,
      formRules,
      showFormItem,
      // formItem,
      expandVisible,
      buttonVisible,
      clearBtnProps,
      resetBtnProps,
      submitBtnProps,
      FieldFlags,
      isRangeFlags,
      formItemStyle,
      isArray,
      onClear,
      onReset,
      onSubmit,
      toggleExpand,
      validate,
      validateField,
      handleChange,
    }
  },
})
</script>
