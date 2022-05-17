<template>
  <li class="el-menu-item-group">
    <div
      class="el-menu-item-group__title"
      :style="{ paddingLeft: `${levelPadding}px` }"
    >
      <template v-if="!$slots.title">{{ title }}</template>
      <slot v-else name="title" />
    </div>
    <ul>
      <slot />
    </ul>
  </li>
</template>

<script lang="ts">
import { defineComponent, computed, getCurrentInstance, inject } from 'vue'
import { throwError } from '@element-plus/utils'
import { customMenuItemGroupProps } from './custom-menu-item-group'

import type { CustomMenuProvider } from './types'

const COMPONENT_NAME = 'ElCustomMenuItemGroup'

export default defineComponent({
  name: COMPONENT_NAME,

  props: customMenuItemGroupProps,

  setup() {
    const instance = getCurrentInstance()!
    const menu = inject<CustomMenuProvider>('rootMenu')
    if (!menu) throwError(COMPONENT_NAME, 'can not inject root menu')

    const levelPadding = computed(() => {
      if (menu.props.collapse) return 20
      let padding = 20
      let parent = instance.parent
      while (parent && parent.type.name !== 'ElCustomMenu') {
        if (parent.type.name === 'ElCustomSubMenu') {
          padding += 20
        }
        parent = parent.parent
      }
      return padding
    })

    return {
      levelPadding,
    }
  },
})
</script>
