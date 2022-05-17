import { withInstall, withNoopInstall } from '@element-plus/utils'

import CustomMenu from './src/custom-menu'
import CustomMenuItem from './src/custom-menu-item.vue'
import CustomMenuItemGroup from './src/custom-menu-item-group.vue'
import CustomSubMenu from './src/custom-sub-menu'

export const ElCustomMenu = withInstall(CustomMenu, {
  CustomMenuItem,
  CustomMenuItemGroup,
  CustomSubMenu,
})
export default ElCustomMenu
export const ElCustomMenuItem = withNoopInstall(CustomMenuItem)
export const ElCustomMenuItemGroup = withNoopInstall(CustomMenuItemGroup)
export const ElCustomSubMenu = withNoopInstall(CustomSubMenu)

export * from './src/custom-menu'
export * from './src/custom-menu-item'
export * from './src/custom-menu-item-group'
export * from './src/custom-sub-menu'
export * from './src/types'
