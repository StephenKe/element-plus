import {
  buildProps,
  definePropType,
  mutable,
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
  // 菜单的背景色（仅支持 hex 格式）
  backgroundColor: {
    type: String,
    default: '#fff',
  },
  // 菜单的文字颜色（仅支持 hex 格式）
  textColor: String,
  // 当前激活菜单的文字颜色（仅支持 hex 格式）
  activeTextColor: String,
  // 默认激活菜单的 index
  defaultActive: {
    type: String,
    default: '',
  },
  // 默认打开的 sub-menu 的 index 的数组
  defaultOpeneds: {
    type: definePropType<string[]>(Array),
    default: () => mutable([] as const),
  },
  // 是否只保持一个子菜单的展开
  uniqueOpened: Boolean,
  // 是否启用 vue-router 模式。 启用该模式会在激活导航时以 index 作为 path 进行路由跳转
  router: Boolean,
  // 是否开启折叠动画
  collapseTransition: {
    type: Boolean,
    default: true,
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
