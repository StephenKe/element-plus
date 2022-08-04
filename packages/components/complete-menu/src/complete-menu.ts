import {
  buildProps,
  definePropType,
  // mutable,
  isString,
  isObject,
  isArray,
  isBoolean as isBool,
} from '@element-plus/utils'
import type { Component } from 'vue'
import type { NavigationFailure, RouteLocationRaw } from 'vue-router'

export interface CompleteMenuDataItem {
  index: string
  label: string
  icon?: string | Component
  isCollected?: boolean
  children?: Array<CompleteMenuDataItem>
}

export const completeMenuProps = buildProps({
  // 菜单数据
  data: {
    type: definePropType<Array<CompleteMenuDataItem>>(Array),
    default: () => [],
  },
  // 折叠
  collapse: {
    type: Boolean,
    default: false,
  },
  // 是否可收藏 ，控制顶部收藏按钮及菜单收藏功能
  collectable: {
    type: Boolean,
    default: false,
  },
  // 收藏的菜单
  collectedData: {
    type: definePropType<Array<CompleteMenuDataItem>>(Array),
    default: () => [],
  },
  // 是否开启常用菜单标识
  commonUsed: {
    type: Boolean,
    default: false,
  },
  // 常用菜单
  commonUsedData: {
    type: definePropType<Array<CompleteMenuDataItem>>(Array),
    default: () => [],
  },
  // 三级菜单触发方式
  menuTrigger: {
    type: String,
    values: ['hover', 'click'],
    default: 'click',
  },
})

const checkIndexPath = (indexPath: unknown): indexPath is string[] =>
  Array.isArray(indexPath) && indexPath.every((path) => isString(path))

export interface CompleteMenuItemClicked {
  index: string
  indexPath: string[]
  route?: RouteLocationRaw
}

export const completeMenuEmits = {
  // sub-menu 展开事件
  open: (index: string, indexPath: string[]) =>
    isString(index) && checkIndexPath(indexPath),
  // sub-menu 关闭事件
  close: (index: string, indexPath: string[]) =>
    isString(index) && checkIndexPath(indexPath),
  // 选中菜单
  select: (
    index: string,
    indexPath: string[],
    item: CompleteMenuItemClicked,
    routerResult?: Promise<void | NavigationFailure>
  ) =>
    isString(index) &&
    checkIndexPath(indexPath) &&
    isObject(item) &&
    (routerResult === undefined || routerResult instanceof Promise),
  // 收藏
  collect: (
    item: CompleteMenuDataItem,
    menuData: Array<CompleteMenuDataItem>
  ) => isObject(item) && isArray(menuData),
  // 导航菜单收起状态变更事件
  collapseChange: (collapseFlag: boolean) => isBool(collapseFlag),
}
