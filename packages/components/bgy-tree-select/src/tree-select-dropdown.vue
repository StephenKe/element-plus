<template>
  <div
    class="el-bgy-tree-select-dropdown"
    :class="[{ 'is-multiple': isMultiple }, popperClass]"
    :style="{ [isFitInputWidth ? 'width' : 'minWidth']: minWidth }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
//@ts-nocheck
import {
  defineComponent,
  computed,
  onMounted,
  onBeforeUnmount,
  inject,
  ref,
} from 'vue'
import { addResizeListener, removeResizeListener } from '@element-plus/utils'
import { selectKey } from './token'
import type { ResizableElement } from '@element-plus/utils'

export default defineComponent({
  name: 'ElTreeSelectDropdown',

  componentName: 'ElTreeSelectDropdown',

  setup() {
    const select = inject(selectKey)!

    // computed
    const popperClass = computed(() => select.props.popperClass)
    const isMultiple = computed(() => select.props.multiple)
    const isFitInputWidth = computed(() => select.props.fitInputWidth)

    const minWidth = ref('')

    function updateMinWidth() {
      minWidth.value = `${
        select.treeSelectWrapper?.getBoundingClientRect().width
      }px`
    }

    onMounted(() => {
      // TODO: updatePopper
      // popper.value.update()
      updateMinWidth()
      addResizeListener(
        select.treeSelectWrapper as ResizableElement,
        updateMinWidth
      )
    })

    onBeforeUnmount(() => {
      removeResizeListener(
        select.treeSelectWrapper as ResizableElement,
        updateMinWidth
      )
    })

    return {
      minWidth,
      popperClass,
      isMultiple,
      isFitInputWidth,
    }
  },
})
</script>
