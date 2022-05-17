import {
  defineComponent,
  computed,
  ref,
  provide,
  inject,
  getCurrentInstance,
  watch,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  withDirectives,
  Fragment,
  vShow,
  h,
  reactive,
} from 'vue'
import { useTimeoutFn } from '@vueuse/core'
import { ArrowDown, ArrowRight } from '@element-plus/icons-vue'
import {
  ElCollapseTransition,
  ElTooltip,
  ElIcon,
} from '@element-plus/components'
import { buildProps, throwError } from '@element-plus/utils'
import useMenu from './use-menu'
import { useMenuCssVar } from './use-menu-css-var'

import { Mode } from './types'
import type { CustomMenuProvider, CustomSubMenuProvider } from './types'
import type { Placement } from '@element-plus/components/popper'
import type { ExtractPropTypes, VNodeArrayChildren, CSSProperties } from 'vue'

export const customSubMenuProps = buildProps({
  index: {
    type: String,
    required: true,
  },
  showTimeout: {
    type: Number,
    default: 300,
  },
  hideTimeout: {
    type: Number,
    default: 300,
  },
  popperClass: String,
  disabled: Boolean,
  popperAppendToBody: {
    type: Boolean,
    default: undefined,
  },
  // 手动设置菜单是否弹出
  isMenuPopup: {
    type: Boolean,
    default: false,
  },
} as const)
export type CustomSubMenuProps = ExtractPropTypes<typeof customSubMenuProps>

const COMPONENT_NAME = 'ElCustomSubMenu'
export default defineComponent({
  name: COMPONENT_NAME,
  props: customSubMenuProps,

  setup(props, { slots, expose }) {
    const instance = getCurrentInstance()!
    const { paddingStyle, indexPath, parentMenu } = useMenu(
      instance,
      computed(() => props.index)
    )

    // inject
    const rootMenu = inject<CustomMenuProvider>('rootMenu')
    if (!rootMenu) throwError(COMPONENT_NAME, 'can not inject root menu')

    const subMenu = inject<CustomSubMenuProvider>(
      `subMenu:${parentMenu.value!.uid}`
    )
    if (!subMenu) throwError(COMPONENT_NAME, 'can not inject sub menu')

    const items = ref<CustomMenuProvider['items']>({})
    const subMenus = ref<CustomMenuProvider['subMenus']>({})

    let timeout: (() => void) | undefined
    const mouseInChild = ref(false)
    const verticalTitleRef = ref<HTMLDivElement>()
    const vPopper = ref<InstanceType<typeof ElTooltip> | null>(null)

    // computed
    const currentPlacement = computed<Placement>(() =>
      mode.value === Mode.HORIZONTAL && isFirstLevel.value
        ? 'bottom-start'
        : 'right-start'
    )
    const subMenuTitleIcon = computed(() => {
      return (mode.value === Mode.HORIZONTAL && isFirstLevel.value) ||
        (mode.value === Mode.VERTICAL &&
          !rootMenu.props.collapse &&
          !props.isMenuPopup)
        ? ArrowDown
        : ArrowRight
    })
    const isFirstLevel = computed(() => {
      let isFirstLevel = true
      let parent = instance.parent
      while (parent && parent.type.name !== 'ElCustomMenu') {
        if (
          ['ElCustomSubMenu', 'ElCustomMenuItemGroup'].includes(
            parent.type.name!
          )
        ) {
          isFirstLevel = false
          break
        } else {
          parent = parent.parent
        }
      }
      return isFirstLevel
    })
    const appendToBody = computed(() => {
      return props.popperAppendToBody === undefined
        ? isFirstLevel.value
        : Boolean(props.popperAppendToBody)
    })
    const menuTransitionName = computed(() =>
      rootMenu.props.collapse ? 'el-zoom-in-left' : 'el-zoom-in-top'
    )
    const fallbackPlacements = computed<Placement[]>(() =>
      mode.value === Mode.HORIZONTAL && isFirstLevel.value
        ? [
            'bottom-start',
            'bottom-end',
            'top-start',
            'top-end',
            'right-start',
            'left-start',
          ]
        : [
            'right-start',
            'right-end',
            'left-start',
            'bottom-start',
            'bottom-end',
            'top-start',
            'top-end',
          ]
    )
    const opened = computed(() => rootMenu.openedMenus.includes(props.index))
    const active = computed(() => {
      let isActive = false

      Object.values(items.value).forEach((item) => {
        if (item.active) {
          isActive = true
        }
      })

      Object.values(subMenus.value).forEach((subItem) => {
        if (subItem.active) {
          isActive = true
        }
      })

      return isActive
    })

    const backgroundColor = computed(() => rootMenu.props.backgroundColor || '')
    const activeTextColor = computed(() => rootMenu.props.activeTextColor || '')
    const textColor = computed(() => rootMenu.props.textColor || '')
    const mode = computed(() => rootMenu.props.mode)
    const item = reactive({
      index: props.index,
      indexPath,
      active,
    })

    const titleStyle = computed<CSSProperties>(() => {
      if (mode.value !== Mode.HORIZONTAL) {
        return {
          color: textColor.value,
        }
      }
      return {
        borderBottomColor: active.value
          ? rootMenu.props.activeTextColor
            ? activeTextColor.value
            : ''
          : 'transparent',
        color: active.value ? activeTextColor.value : textColor.value,
      }
    })

    // methods
    const doDestroy = () =>
      vPopper.value?.popperRef?.popperInstanceRef?.destroy()

    const handleCollapseToggle = (value: boolean) => {
      if (!value) {
        doDestroy()
      }
    }

    const handleClick = () => {
      if (
        (rootMenu.props.menuTrigger === 'hover' &&
          rootMenu.props.mode === Mode.HORIZONTAL) ||
        (rootMenu.props.collapse && rootMenu.props.mode === Mode.VERTICAL) ||
        props.disabled
      )
        return

      rootMenu.handleSubMenuClick({
        index: props.index,
        indexPath: indexPath.value,
        active: active.value,
      })
    }

    const handleMouseenter = (
      event: MouseEvent | FocusEvent,
      showTimeout = props.showTimeout
    ) => {
      if (event.type === 'focus' && !event.relatedTarget) {
        return
      }
      if (
        (rootMenu.props.menuTrigger === 'click' &&
          rootMenu.props.mode === Mode.HORIZONTAL) ||
        (!rootMenu.props.collapse &&
          rootMenu.props.mode === Mode.VERTICAL &&
          !props.isMenuPopup) ||
        props.disabled
      ) {
        return
      }
      subMenu.mouseInChild.value = true

      timeout?.()
      ;({ stop: timeout } = useTimeoutFn(() => {
        rootMenu.openMenu(props.index, indexPath.value)
      }, showTimeout))

      if (appendToBody.value) {
        parentMenu.value.vnode.el?.dispatchEvent(new MouseEvent('mouseenter'))
      }
    }

    const handleMouseleave = (deepDispatch = false) => {
      if (
        (rootMenu.props.menuTrigger === 'click' &&
          rootMenu.props.mode === Mode.HORIZONTAL) ||
        (!rootMenu.props.collapse &&
          rootMenu.props.mode === Mode.VERTICAL &&
          !props.isMenuPopup)
      ) {
        return
      }
      timeout?.()
      subMenu.mouseInChild.value = false
      ;({ stop: timeout } = useTimeoutFn(
        () =>
          !mouseInChild.value &&
          rootMenu.closeMenu(props.index, indexPath.value),
        props.hideTimeout
      ))

      if (appendToBody.value && deepDispatch) {
        if (instance.parent?.type.name === 'ElCustomSubMenu') {
          subMenu.handleMouseleave?.(true)
        }
      }
    }

    watch(
      () => rootMenu.props.collapse,
      (value) => handleCollapseToggle(Boolean(value))
    )

    // provide
    {
      const addSubMenu: CustomSubMenuProvider['addSubMenu'] = (item) => {
        subMenus.value[item.index] = item
      }
      const removeSubMenu: CustomSubMenuProvider['removeSubMenu'] = (item) => {
        delete subMenus.value[item.index]
      }
      provide<CustomSubMenuProvider>(`subMenu:${instance.uid}`, {
        isMenuPopup: props.isMenuPopup,
        addSubMenu,
        removeSubMenu,
        handleMouseleave,
        mouseInChild,
      })
    }

    // expose
    expose({
      opened,
    })

    // lifecycle
    onBeforeMount(() => {
      handleMouseleave(true)
    })

    onMounted(() => {
      rootMenu.addSubMenu(item)
      subMenu.addSubMenu(item)
    })

    onBeforeUnmount(() => {
      subMenu.removeSubMenu(item)
      rootMenu.removeSubMenu(item)
    })

    return () => {
      const titleTag: VNodeArrayChildren = [
        slots.title?.(),
        h(
          ElIcon,
          {
            class: ['el-custom-sub-menu__icon-arrow'],
          },
          { default: () => h(subMenuTitleIcon.value) }
        ),
      ]

      const ulStyle = useMenuCssVar(rootMenu.props)

      // this render function is only used for bypass `Vue`'s compiler caused patching issue.
      // temporarily mark ElPopper as any due to type inconsistency.
      const child =
        props.isMenuPopup || rootMenu.isMenuPopup
          ? h(
              // TODO: correct popper's type.
              ElTooltip as any,
              {
                ref: vPopper,
                // visible: opened.value,
                effect: 'light',
                pure: true,
                offset: 6,
                showArrow: false,
                persistent: true,
                popperClass: props.popperClass,
                placement: currentPlacement.value,
                teleported: appendToBody.value,
                fallbackPlacements: fallbackPlacements.value,
                transition: menuTransitionName.value,
                gpuAcceleration: false,
              },
              {
                content: () =>
                  h(
                    'div',
                    {
                      class: [
                        `el-custom-menu--${mode.value}`,
                        props.popperClass,
                      ],
                      onMouseenter: (evt: MouseEvent) =>
                        handleMouseenter(evt, 100),
                      onMouseleave: () => handleMouseleave(true),
                      onFocus: (evt: FocusEvent) => handleMouseenter(evt, 100),
                    },
                    [
                      h(
                        'div',
                        {
                          // 修复：弹出菜单内容过长无法滚动的问题
                          style: 'max-height: 100vh;overflow-y: auto;',
                        },
                        [
                          h(
                            'ul',
                            {
                              class: [
                                'el-custom-menu el-custom-menu--popup',
                                `el-custom-menu--popup-${currentPlacement.value}`,
                              ],
                              style: ulStyle.value,
                            },
                            [slots.default?.()]
                          ),
                        ]
                      ),
                    ]
                  ),
                default: () =>
                  h(
                    'div',
                    {
                      class: 'el-custom-sub-menu__title',
                      style: [
                        paddingStyle.value,
                        titleStyle.value,
                        { backgroundColor: backgroundColor.value },
                      ],
                      onClick: handleClick,
                    },
                    titleTag
                  ),
              }
            )
          : h(Fragment, {}, [
              h(
                'div',
                {
                  class: 'el-custom-sub-menu__title',
                  style: [
                    paddingStyle.value,
                    titleStyle.value,
                    { backgroundColor: backgroundColor.value },
                  ],
                  ref: verticalTitleRef,
                  onClick: handleClick,
                },
                titleTag
              ),
              h(
                ElCollapseTransition,
                {},
                {
                  default: () =>
                    withDirectives(
                      h(
                        'ul',
                        {
                          role: 'menu',
                          class: 'el-custom-menu el-custom-menu--inline',
                          style: ulStyle.value,
                        },
                        [slots.default?.()]
                      ),
                      [[vShow, opened.value]]
                    ),
                }
              ),
            ])

      return h(
        'li',
        {
          class: [
            'el-custom-sub-menu',
            {
              'is-active': active.value,
              'is-opened': opened.value,
              'is-disabled': props.disabled,
            },
          ],
          role: 'menuitem',
          ariaHaspopup: true,
          ariaExpanded: opened.value,
          onMouseenter: handleMouseenter,
          onMouseleave: () => handleMouseleave(true),
          onFocus: handleMouseenter,
        },
        [child]
      )
    }
  },
})
