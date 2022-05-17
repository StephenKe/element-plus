// @ts-nocheck
import type { Ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { CustomMenuProps } from './custom-menu'

export interface CustomMenuItemRegistered {
  index: string
  indexPath: string[]
  active: boolean
}
export interface CustomMenuItemClicked {
  index: string
  indexPath: string[]
  route?: RouteLocationRaw
}

export const enum Mode {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export interface CustomMenuProvider {
  openedMenus: string[]
  items: Record<string, CustomMenuItemRegistered>
  subMenus: Record<string, CustomMenuItemRegistered>
  activeIndex?: string
  isMenuPopup: boolean
  props: CustomMenuProps

  addMenuItem: (item: CustomMenuItemRegistered) => void
  removeMenuItem: (item: CustomMenuItemRegistered) => void
  addSubMenu: (item: CustomMenuItemRegistered) => void
  removeSubMenu: (item: CustomMenuItemRegistered) => void

  openMenu: (index: string, indexPath: string[]) => void
  closeMenu: (index: string, indexPath: string[]) => void

  handleMenuItemClick: (item: CustomMenuItemClicked) => void
  handleSubMenuClick: (subMenu: CustomMenuItemRegistered) => void
}

export interface CustomSubMenuProvider {
  isMenuPopup: boolean
  addSubMenu: (item: CustomMenuItemRegistered) => void
  removeSubMenu: (item: CustomMenuItemRegistered) => void
  handleMouseleave?: (deepDispatch: boolean) => void
  mouseInChild: Ref<boolean>
}
