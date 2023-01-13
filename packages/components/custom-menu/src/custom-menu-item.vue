<template>
  <li
    class="el-custom-menu-item"
    role="menuitem"
    tabindex="-1"
    :style="paddingStyle"
    :class="{
      'is-active': active,
      'is-disabled': disabled,
    }"
    @click="handleClick"
  >
    <el-tooltip
      v-if="
        (parentMenu.type.name === 'ElCustomMenu' &&
          rootMenu.props.collapse &&
          $slots.title) ||
        tooltip
      "
      :effect="Effect.DARK"
      placement="right"
      persistent
    >
      <template #content>
        <slot name="title" />
      </template>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '100%',
          display: 'inline-block',
          boxSizing: 'border-box',
          padding: '0 20px',
        }"
      >
        <slot name="title" />
      </div>
    </el-tooltip>
    <template v-else>
      <slot />
      <slot name="title" />
    </template>
  </li>
</template>

<script lang="ts">
// @ts-nocheck
import {
  defineComponent,
  computed,
  onMounted,
  onBeforeUnmount,
  inject,
  getCurrentInstance,
  toRef,
  reactive,
  shallowRef,
} from 'vue'
import { ElTooltip, Effect } from '@element-plus/components'
import { throwError } from '@element-plus/utils'
import useMenu from './use-menu'
import { customMenuItemEmits, customMenuItemProps } from './custom-menu-item'

import type {
  CustomMenuItemRegistered,
  CustomMenuProvider,
  CustomSubMenuProvider,
} from './types'

const COMPONENT_NAME = 'ElCustomMenuItem'
export default defineComponent({
  name: COMPONENT_NAME,
  components: {
    ElTooltip,
  },

  props: customMenuItemProps,
  emits: customMenuItemEmits,

  setup(props, { emit }) {
    const instance = getCurrentInstance()!
    const rootMenu = inject<CustomMenuProvider>('rootMenu')
    if (!rootMenu) throwError(COMPONENT_NAME, 'can not inject root menu')

    const tooltip = shallowRef(props.tooltip)

    const { parentMenu, paddingStyle, indexPath } = useMenu(
      instance,
      toRef(props, 'index')
    )

    const subMenu = inject<CustomSubMenuProvider>(
      `subMenu:${parentMenu.value.uid}`
    )
    if (!subMenu) throwError(COMPONENT_NAME, 'can not inject sub menu')

    const active = computed(() => props.index === rootMenu.activeIndex)
    const item: CustomMenuItemRegistered = reactive({
      index: props.index,
      indexPath,
      active,
    })

    const handleClick = () => {
      if (!props.disabled) {
        rootMenu.handleMenuItemClick({
          index: props.index,
          indexPath: indexPath.value,
          route: props.route,
        })
        emit('click', item)
      }
    }

    onMounted(() => {
      subMenu.addSubMenu(item)
      rootMenu.addMenuItem(item)
    })

    onBeforeUnmount(() => {
      subMenu.removeSubMenu(item)
      rootMenu.removeMenuItem(item)
    })

    return {
      Effect,
      parentMenu,
      rootMenu,
      paddingStyle,
      active,

      handleClick,
    }
  },
})
</script>
