<template>
  <div :class="ns.b()">
    <el-form
      ref="formRef"
      :class="[ns.e('content'), ns.is(isClassName)]"
      :size="size"
      :model="model"
      :rules="rules"
      :disabled="disabled"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :label-suffix="labelSuffix"
      :hide-required-asterisk="hideRequiredAsterisk"
      :show-message="showMessage"
      :style="{ height: `${formHeight}px` }"
      @validate="handleValidate"
    >
      <slot></slot>
    </el-form>
    <div :class="ns.e('operationbtns')">
      <el-button
        v-if="showCollapseBtns"
        type="text"
        :size="size"
        @click="handleChangeCollapse"
      >
        <span>{{ collapseBtnText }}</span>
        <el-icon>
          <component :is="collapseBtnIcon"></component>
        </el-icon>
      </el-button>
      <el-button :size="size" @click="handleReset">{{ resetText }}</el-button>
      <el-button type="primary" :size="size" @click="handleSearch">{{
        searchText
      }}</el-button>
    </div>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import { defineComponent, ref, computed, watch, onMounted, nextTick } from 'vue'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { useNamespace } from '@element-plus/hooks'
import {
  ElForm,
  ElButton,
  ElIcon,
  ElCollapseTransition,
} from '@element-plus/components'
import { queryFormEmits, queryFormProps } from './query-form'
import { getEleHeight } from './utils'
import type {
  ValidateFieldCallback,
  Callback2 as Callback,
} from '@element-plus/tokens'

export default defineComponent({
  name: 'ElQueryForm',
  components: {
    ElForm,
    ElButton,
    ElIcon,
    ArrowDown,
    ElCollapseTransition,
  },
  props: queryFormProps,
  emits: queryFormEmits,
  expose: ['validate', 'validateField', 'resetFields', 'clearValidate'],
  setup(props, { emit, slots }) {
    // css 命名空间
    const ns = useNamespace('query-form')

    // form ref
    const formRef = ref(null)
    // 当前收起状态
    const isCollapse = ref(props.collapse)
    // 表单 dom 元素
    const formEle = computed(() => formRef.value?.$el)
    // 表单子元素
    const formChildren = computed(() => formEle.value?.children)
    // formitem 元素的高度，包括 content，padding，border，
    const firstItemHeight = computed(() => {
      const formItems = formEle.value.getElementsByClassName('el-form-item')
      return formItems && formItems.length
        ? getEleHeight(formItems[0], props.size, formEle.value)
        : 0
    })
    watch(
      () => slots.default(),
      () => {
        nextTick(() => {
          if (!formChildren.value || !formChildren.value.length) {
            showCollapseBtns.value = false
          } else {
            showCollapseBtns.value =
              Array.from(formChildren.value).reduce((total, child) => {
                total += getEleHeight(child, props.size)
                return total
              }, 0) > firstItemHeight.value
          }
        })
      },
      {
        deep: true,
        immediate: true,
      }
    )
    // 是否显示展开/收起按钮，通过 dom 元素高度判断
    const showCollapseBtns = ref(false)
    // is 类名
    const isClassName = computed(() =>
      isCollapse.value ? 'collapse' : 'expand'
    )
    // 展开/收起描述
    const collapseBtnText = computed(() =>
      isCollapse.value ? props.expandText : props.collapseText
    )
    // 展开/收起图标
    const collapseBtnIcon = computed(() =>
      isCollapse.value ? ArrowDown : ArrowUp
    )
    // form 高度
    const formHeight = ref(0)

    watch(isCollapse, (val) => {
      formHeight.value = getShowHeight(val)
    })

    const recomputedCollapse = () => {
      if (formChildren.value?.length) {
        showCollapseBtns.value =
          Array.from(formChildren.value).reduce((total, child) => {
            total += getEleHeight(child, props.size)
            return total
          }, 0) > firstItemHeight.value
        isCollapse.value = !showCollapseBtns.value
      } else {
        showCollapseBtns.value = false
      }
    }

    // 获取当前状态展示高度
    const getShowHeight = (isCollapse) => {
      return formChildren.value?.length
        ? isCollapse
          ? firstItemHeight.value
          : Array.from(formChildren.value).reduce((total, ele) => {
              total += getEleHeight(ele, props.size)
              return total
            }, 0)
        : 0
    }

    onMounted(() => {
      setTimeout(() => {
        formHeight.value = getShowHeight(isCollapse.value)
      })
      recomputedCollapse()
    })

    // form validate
    const handleValidate = (
      prop: string,
      isPass: boolean,
      validateMessage: string | null
    ) => {
      emit('validate', prop, isPass, validateMessage)
    }

    // 点击收起/展开按钮
    const handleChangeCollapse = () => {
      isCollapse.value = !isCollapse.value
    }

    // 点击重置按钮
    const handleReset = () => {
      emit('reset', formRef.value)
    }

    // 点击查询按钮
    const handleSearch = () => {
      emit('search', formRef.value)
    }

    // form validate
    const validate = (callback?: Callback) => {
      formRef.value?.validate(callback)
    }

    // form validateField
    const validateField = (
      props: string | string[],
      cb: ValidateFieldCallback
    ) => {
      formRef.value?.validateField(props, cb)
    }

    // form resetFields
    const resetFields = () => {
      formRef.value?.resetFields()
    }

    // form clearValidate
    const clearValidate = (props: string | string[] = []) => {
      formRef.value?.clearValidate(props)
    }

    return {
      ns,

      formRef,
      showCollapseBtns,
      formHeight,
      isCollapse,
      isClassName,
      collapseBtnText,
      collapseBtnIcon,
      handleValidate,
      handleChangeCollapse,
      handleReset,
      handleSearch,

      validate,
      validateField,
      resetFields,
      clearValidate,

      ArrowDown,
      ArrowUp,
    }
  },
})
</script>
