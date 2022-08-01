// @ts-nocheck
import {
  defineComponent,
  getCurrentInstance,
  watch,
  computed,
  ref,
  provide,
  onMounted,
  h,
  withDirectives,
  reactive,
  nextTick,
} from 'vue'
import { More } from '@element-plus/icons-vue'
// import { Resize } from '@element-plus/directives'
import { useResizeObserver } from '@vueuse/core'
import ElIcon from '@element-plus/components/icon'
import Menubar from './utils/menu-bar'
import {
  buildProps,
  definePropType,
  mutable,
  isString,
  isObject,
} from '@element-plus/utils'
import ElCustomMenuCollapseTransition from './custom-menu-collapse-transition.vue'
import ElCustomSubMenu from './custom-sub-menu'
import { useMenuCssVar } from './use-menu-css-var'

import { Mode } from './types'
import type {
  CustomMenuItemClicked,
  CustomMenuProvider,
  CustomSubMenuProvider,
} from './types'
import type { NavigationFailure, Router } from 'vue-router'
import type { VNode, ExtractPropTypes, VNodeNormalizedChildren } from 'vue'

export const customMenuProps = buildProps({
  mode: {
    type: String,
    values: [Mode.HORIZONTAL, Mode.VERTICAL],
    default: Mode.VERTICAL,
  },
  defaultActive: {
    type: String,
    default: '',
  },
  defaultOpeneds: {
    type: definePropType<string[]>(Array),
    default: () => mutable([] as const),
  },
  // 是否只保持一个子菜单的展开
  uniqueOpened: Boolean,
  router: Boolean,
  menuTrigger: {
    type: String,
    values: ['hover', 'click'],
    default: 'hover',
  },
  collapse: Boolean,
  backgroundColor: String,
  textColor: String,
  activeTextColor: String,
  collapseTransition: {
    type: Boolean,
    default: true,
  },
  ellipsis: {
    type: Boolean,
    default: true,
  },
} as const)
export type CustomMenuProps = ExtractPropTypes<typeof customMenuProps>

const checkIndexPath = (indexPath: unknown): indexPath is string[] =>
  Array.isArray(indexPath) && indexPath.every((path) => isString(path))

export const customMenuEmits = {
  close: (index: string, indexPath: string[]) =>
    isString(index) && checkIndexPath(indexPath),

  open: (index: string, indexPath: string[]) =>
    isString(index) && checkIndexPath(indexPath),

  select: (
    index: string,
    indexPath: string[],
    item: CustomMenuItemClicked,
    routerResult?: Promise<void | NavigationFailure>
  ) =>
    isString(index) &&
    checkIndexPath(indexPath) &&
    isObject(item) &&
    (routerResult === undefined || routerResult instanceof Promise),
}
export type CustomMenuEmits = typeof customMenuEmits

export default defineComponent({
  name: 'ElCustomMenu',

  props: customMenuProps,
  emits: customMenuEmits,

  setup(props, { emit, slots, expose }) {
    const instance = getCurrentInstance()!
    const router = instance.appContext.config.globalProperties.$router as Router
    const menu = ref<HTMLUListElement>()

    // data
    const openedMenus = ref<CustomMenuProvider['openedMenus']>(
      props.defaultOpeneds && !props.collapse
        ? props.defaultOpeneds.slice(0)
        : []
    )
    const activeIndex = ref<CustomMenuProvider['activeIndex']>(
      props.defaultActive
    )
    const items = ref<CustomMenuProvider['items']>({})
    const subMenus = ref<CustomMenuProvider['subMenus']>({})

    const alteredCollapse = ref(false)

    // computed
    const isMenuPopup = computed<CustomMenuProvider['isMenuPopup']>(() => {
      return (
        props.mode === Mode.HORIZONTAL ||
        (props.mode === Mode.VERTICAL && props.collapse)
      )
    })

    // methods
    const initMenu = () => {
      const activeItem = activeIndex.value && items.value[activeIndex.value]
      if (!activeItem || props.mode === Mode.HORIZONTAL || props.collapse)
        return

      const indexPath = activeItem.indexPath

      // 展开该菜单项的路径上所有子菜单
      // expand all subMenus of the menu item
      indexPath.forEach((index) => {
        const subMenu = subMenus.value[index]
        subMenu && openMenu(index, subMenu.indexPath)
      })
    }

    const openMenu: CustomMenuProvider['openMenu'] = (index, indexPath) => {
      if (openedMenus.value.includes(index)) return
      // 将不在该菜单路径下的其余菜单收起
      // collapse all menu that are not under current menu item
      if (props.uniqueOpened) {
        openedMenus.value = openedMenus.value.filter((index: string) =>
          indexPath.includes(index)
        )
      }
      openedMenus.value.push(index)
      emit('open', index, indexPath)
    }

    const closeMenu: CustomMenuProvider['closeMenu'] = (index, indexPath) => {
      const i = openedMenus.value.indexOf(index)
      if (i !== -1) {
        openedMenus.value.splice(i, 1)
      }
      emit('close', index, indexPath)
    }

    const handleSubMenuClick: CustomMenuProvider['handleSubMenuClick'] = ({
      index,
      indexPath,
    }) => {
      const isOpened = openedMenus.value.includes(index)

      if (isOpened) {
        closeMenu(index, indexPath)
      } else {
        openMenu(index, indexPath)
      }
    }

    const handleMenuItemClick: CustomMenuProvider['handleMenuItemClick'] = (
      menuItem
    ) => {
      if (props.mode === Mode.HORIZONTAL || props.collapse) {
        openedMenus.value = []
      }

      const { index, indexPath } = menuItem
      if (index === undefined || indexPath === undefined) return

      if (props.router && router) {
        const route = menuItem.route || index
        const routerResult = router.push(route).then((res) => {
          if (!res) activeIndex.value = index
          return res
        })
        emit(
          'select',
          index,
          indexPath,
          { index, indexPath, route },
          routerResult
        )
      } else {
        activeIndex.value = index
        emit('select', index, indexPath, { index, indexPath })
      }
    }

    const updateActiveIndex = (val: string) => {
      const itemsInData = items.value
      const item =
        itemsInData[val] ||
        (activeIndex.value && itemsInData[activeIndex.value]) ||
        itemsInData[props.defaultActive]
      if (item) {
        activeIndex.value = item.index
        initMenu()
      } else {
        // Can't find item when collapsing
        // and activeIndex shouldn't be changed when 'collapse' was changed.
        // Then reset 'alteredCollapse' immediately.
        if (!alteredCollapse.value) {
          activeIndex.value = undefined
        } else {
          alteredCollapse.value = false
        }
      }
    }
    const handleResize = () => {
      nextTick(() => instance.proxy!.$forceUpdate())
    }

    watch(
      () => props.defaultActive,
      (currentActive) => {
        if (!items.value[currentActive]) {
          activeIndex.value = ''
        }
        updateActiveIndex(currentActive)
      }
    )

    watch(items.value, () => initMenu())

    watch(
      () => props.collapse,
      (value, prev) => {
        if (value !== prev) {
          alteredCollapse.value = true
        }
        if (value) openedMenus.value = []
      }
    )

    // provide
    {
      const addSubMenu: CustomMenuProvider['addSubMenu'] = (item) => {
        subMenus.value[item.index] = item
      }

      const removeSubMenu: CustomMenuProvider['removeSubMenu'] = (item) => {
        delete subMenus.value[item.index]
      }

      const addMenuItem: CustomMenuProvider['addMenuItem'] = (item) => {
        items.value[item.index] = item
      }

      const removeMenuItem: CustomMenuProvider['removeMenuItem'] = (item) => {
        delete items.value[item.index]
      }
      provide<CustomMenuProvider>(
        'rootMenu',
        reactive({
          props,
          openedMenus,
          items,
          subMenus,
          activeIndex,
          isMenuPopup,

          addMenuItem,
          removeMenuItem,
          addSubMenu,
          removeSubMenu,
          openMenu,
          closeMenu,
          handleMenuItemClick,
          handleSubMenuClick,
        })
      )
      provide<CustomSubMenuProvider>(`subMenu:${instance.uid}`, {
        addSubMenu,
        removeSubMenu,
        mouseInChild: ref(false),
      })
    }

    // lifecycle
    onMounted(() => {
      initMenu()
      if (props.mode === Mode.HORIZONTAL) {
        new Menubar(instance.vnode.el!)
      }
    })

    {
      const open = (index: string) => {
        const { indexPath } = subMenus.value[index]
        indexPath.forEach((i) => openMenu(i, indexPath))
      }
      expose({
        open,
        close: closeMenu,
        handleResize,
      })
    }

    const flattedChildren = (children: VNodeNormalizedChildren) => {
      const vnodes = Array.isArray(children) ? children : [children]
      const result: any[] = []
      vnodes.forEach((child: any) => {
        if (Array.isArray(child.children)) {
          result.push(...flattedChildren(child.children))
        } else {
          result.push(child)
        }
      })
      return result
    }

    const useVNodeResize = (vnode: VNode) =>
      props.mode === Mode.HORIZONTAL
        ? withDirectives(vnode, [[useResizeObserver, handleResize]])
        : vnode
    return () => {
      let slot = slots.default?.() ?? []
      const vShowMore: VNode[] = []
      // 水平展示
      if (props.mode === Mode.HORIZONTAL && menu.value) {
        const items = Array.from(menu.value?.childNodes ?? []).filter(
          (item) => item.nodeName !== '#text' || item.nodeValue
        ) as HTMLElement[]
        const originalSlot = flattedChildren(slot)
        const moreItemWidth = 64
        const paddingLeft = parseInt(
          getComputedStyle(menu.value).paddingLeft,
          10
        )
        const paddingRight = parseInt(
          getComputedStyle(menu.value).paddingRight,
          10
        )
        const menuWidth = menu.value.clientWidth - paddingLeft - paddingRight
        let calcWidth = 0
        let sliceIndex = 0
        items.forEach((item, index) => {
          calcWidth += item.offsetWidth || 0
          if (calcWidth <= menuWidth - moreItemWidth) {
            sliceIndex = index + 1
          }
        })
        const slotDefault = originalSlot.slice(0, sliceIndex)
        const slotMore = originalSlot.slice(sliceIndex)
        if (slotMore?.length && props.ellipsis) {
          slot = slotDefault
          vShowMore.push(
            h(
              ElCustomSubMenu,
              {
                index: 'sub-menu-more',
                class: 'el-sub-menu__hide-arrow',
              },
              {
                title: () =>
                  h(
                    ElIcon,
                    {
                      class: ['el-sub-menu__icon-more'],
                    },
                    { default: () => h(More) }
                  ),
                default: () => slotMore,
              }
            )
          )
        }
      }

      const ulStyle = useMenuCssVar(props)

      const resizeMenu = (vNode: VNode) =>
        props.ellipsis ? useVNodeResize(vNode) : vNode

      const vMenu = resizeMenu(
        h(
          'ul',
          {
            key: String(props.collapse),
            role: 'menubar',
            ref: menu,
            style: ulStyle.value,
            class: {
              'el-custom-menu': true,
              'el-custom-menu--horizontal': props.mode === Mode.HORIZONTAL,
              'el-custom-menu--collapse': props.collapse,
            },
          },
          [...slot.map((vnode) => resizeMenu(vnode)), ...vShowMore]
        )
      )
      if (props.collapseTransition && props.mode === Mode.VERTICAL) {
        return h(ElCustomMenuCollapseTransition, () => vMenu)
      }

      return vMenu
    }
  },
})
