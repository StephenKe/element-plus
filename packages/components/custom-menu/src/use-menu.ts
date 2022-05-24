import { computed, inject } from 'vue'
import { throwError } from '@element-plus/utils'

import type { ComponentInternalInstance, Ref, CSSProperties } from 'vue'
import type { CustomMenuProvider, CustomSubMenuProvider } from './types'

export default function useMenu(
  instance: ComponentInternalInstance,
  currentIndex: Ref<string>
) {
  const rootMenu = inject<CustomMenuProvider>('rootMenu')
  if (!rootMenu) throwError('useMenu', 'can not inject root menu')

  const indexPath = computed(() => {
    let parent = instance.parent!
    const path = [currentIndex.value]
    while (parent.type.name !== 'ElCustomMenu') {
      if (parent.props.index) {
        path.unshift(parent.props.index as string)
      }
      parent = parent.parent!
    }
    return path
  })

  const parentMenu = computed(() => {
    let parent = instance.parent
    while (
      parent &&
      !['ElCustomMenu', 'ElCustomSubMenu'].includes(parent.type.name!)
    ) {
      parent = parent.parent
    }
    return parent!
  })
  const paddingStyle = computed<CSSProperties>(() => {
    const subMenu = inject<CustomSubMenuProvider>(
      `subMenu:${parentMenu.value.uid}`
    )
    if (!subMenu) throwError('useMenu', 'can not inject parent menu')
    let parent = instance.parent
    if (rootMenu.props.mode !== 'vertical') return {}

    let padding = 0
    if (rootMenu.props.collapse || subMenu.isMenuPopup) {
      padding = 0
    } else {
      while (parent && parent.type.name !== 'ElCustomMenu') {
        if (parent.type.name === 'ElCustomSubMenu') {
          padding += 20
        }
        parent = parent.parent
      }
    }
    return { paddingLeft: `${padding}px` }
  })

  return {
    parentMenu,
    paddingStyle,
    indexPath,
  }
}
