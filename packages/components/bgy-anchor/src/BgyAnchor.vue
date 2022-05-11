<template>
  <ElAffix
    :offset="offset"
    :position="position"
    class="bgy-anchor"
    @change="onChange"
  >
    <div ref="anchorRef" class="wrapper">
      <div class="fixed">
        <div class="ink">
          <span ref="inkNodeRef" class="ink-ball" />
        </div>
        <slot />
      </div>
    </div>
  </ElAffix>
</template>

<script lang="ts">
import '../style/bgy-anchor.scss'
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  reactive,
  ref,
} from 'vue'
import { NOOP } from '@vue/shared'
import { ElAffix } from '@element-plus/components'
// 用户页面滚动的函数
import scrollTo from './scrollTo'
import addEventListener from './addEventListener'
import useProvideAnchor from './context'
//getScroll 滚动条移动了多少
import getScroll from './getScroll'
// 默认就是返回window对象
function getDefaultContainer() {
  return window
}

const sharpMatcherRegx = /#(\S+)$/
type Section = {
  link: string
  top: number
}
//Window 对象表示浏览器中打开的窗口。
export type AnchorContainer = HTMLElement | Window

//得到距离顶部的距离
function getOffsetTop(
  element: HTMLElement,
  container: AnchorContainer
): number {
  if (!element.getClientRects().length) {
    return 0
  }

  const rect = element.getBoundingClientRect()

  if (rect.width || rect.height) {
    if (container === window) {
      container = element.ownerDocument!.documentElement!
      return rect.top - container.clientTop
    }
    return rect.top - (container as HTMLElement).getBoundingClientRect().top
  }

  return rect.top
}

export default defineComponent({
  name: 'ElBgyAnchor',
  components: {
    ElAffix,
  },
  props: {
    onChange: {
      type: Function,
      default: NOOP,
    },
    offset: {
      type: Number,
      default: 0,
    },
    position: {
      type: String,
      default: 'top',
      validator: (value: string) => ['top', 'bottom'].includes(value),
    },
    getContainer: {
      type: Function,
      default: () => {
        return getDefaultContainer()
      },
    },
    getCurrentAnchor: {
      type: Function,
      default: () => {
        return ''
      },
    },

    targetOffset: {
      type: Number,
      default: undefined,
    },
    bounds: {
      type: Number,
      default: 0,
    },
  },
  emits: ['change', 'click'],
  setup(props, { emit, expose }) {
    //视图最左侧那个竖线
    const inkNodeRef = ref()
    // 整个锚点最外层的div 引用对象
    const anchorRef = ref()
    const state = reactive({
      links: [],
      scrollContainer: null,
      scrollEvent: null,
      animating: false,
    })
    // 用来记录 激活的 link url
    const activeLink = ref<string>('')
    // 数据传递
    //  provide('activeLink',activeLink)

    const setCurrentActiveLink = (link: string) => {
      // const { currentAnchor } = props
      if (activeLink.value === link) {
        return
      }
      activeLink.value = link
      //  activeLink.value = typeof currentAnchor === 'function' ? currentAnchor() : link
      setTimeout(() => {
        updateInk()
      }, 200)
      emit('change', link)
    }

    const currentAnchor = (offset = 0, bounds = 5) => {
      const linkSections: Array<Section> = []
      const currentContainer = container.value()
      state.links.forEach((link) => {
        const sharpLinkMatch = sharpMatcherRegx.exec(link)
        if (!sharpLinkMatch) {
          return
        }
        const target = document.querySelector(sharpLinkMatch[1])[0]
        if (target) {
          const top = getOffsetTop(target, currentContainer)
          if (top < offset + bounds) {
            linkSections.push({
              link,
              top,
            })
          }
        }
      })

      if (linkSections.length) {
        const maxSection = linkSections.reduce((prev, curr) =>
          curr.top > prev.top ? curr : prev
        )
        return maxSection.link
      }
      return ''
    }
    // 获取 container 的函数
    const container = computed(() => {
      const { getContainer } = props
      return getContainer || getDefaultContainer
    })

    // 监听滚动事件
    const handleScroll = () => {
      // 用户滚动 所以不需要动画
      if (state.animating) {
        return
      }
      const offset = props.offset || 0
      const bounds = props.bounds || 0
      const targetOffset = props.targetOffset
      const currentActiveLink = currentAnchor(
        targetOffset !== undefined ? targetOffset : offset || 0,
        bounds
      )
      setCurrentActiveLink(currentActiveLink)
    }
    const updateInk = () => {
      const linkNode = anchorRef.value.querySelectorAll(
        '.bgyAnchorLink__link--active'
      )[0]
      if (linkNode !== undefined) {
        ;(inkNodeRef.value as HTMLElement).style.top = `${
          linkNode.offsetTop + linkNode.clientHeight / 2 - 4.5
        }px`
      }
    }

    //生命周期函数
    onUpdated(() => {
      nextTick(() => {
        if (state.scrollEvent) {
          const currentContainer = container.value()
          if (state.scrollContainer !== currentContainer) {
            state.scrollContainer = currentContainer
            state.scrollEvent.remove()
            state.scrollEvent = addEventListener(
              state.scrollContainer,
              'scroll',
              handleScroll
            )
            handleScroll()
          }
        }
        updateInk()
      })
    })
    onMounted(() => {
      // 将回调推迟到下一个 DOM 更新周期之后执行。在更改了一些数据以等待 DOM 更新后立即使用它。
      //就是控件渲染完成之后才执行
      nextTick(() => {
        const currentContainer = container.value()
        state.scrollContainer = currentContainer
        state.scrollEvent = addEventListener(
          state.scrollContainer,
          'scroll',
          handleScroll
        )
        handleScroll()
      })
    })
    onBeforeUnmount(() => {
      if (state.scrollEvent) {
        state.scrollEvent.remove()
      }
    })

    const handleScrollTo = (link: string) => {
      const offset = props.offset || 0
      const getContainer = props.getContainer || getDefaultContainer
      const targetOffset = props.targetOffset || 0
      setCurrentActiveLink(link)
      const container = getContainer()
      const scrollTop = getScroll(container, true)
      const sharpLinkMatch = sharpMatcherRegx.exec(link)
      if (!sharpLinkMatch) {
        return
      }
      const targetElement = document.querySelector(sharpLinkMatch[1])[0]
      if (!targetElement) {
        return
      }

      const eleOffsetTop = getOffsetTop(targetElement, container)
      let y = scrollTop + eleOffsetTop
      y -= targetOffset !== undefined ? targetOffset : offset || 0
      state.animating = true

      scrollTo(y, {
        callback: () => {
          state.animating = false
        },
        getContainer,
      })
    }

    expose({
      scrollTo: handleScrollTo,
    })
    useProvideAnchor({
      registerLink: (link: string) => {
        if (!state.links.includes(link)) {
          state.links.push(link)
        }
      },
      unregisterLink: (link: string) => {
        const index = state.links.indexOf(link)
        if (index !== -1) {
          state.links.splice(index, 1)
        }
      },
      activeLink,
      scrollTo: handleScrollTo,
      handleClick: (e, info) => {
        emit('click', e, info)
      },
    })
    return {
      state,
      activeLink,
      setCurrentActiveLink,
      currentAnchor,
      handleScroll,
      updateInk,
      anchorRef,
      handleScrollTo,
      inkNodeRef,
    }
  },
})
</script>
