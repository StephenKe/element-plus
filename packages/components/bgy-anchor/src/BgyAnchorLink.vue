<template>
  <el-link
    style="border-bottom: 0px"
    :class="{
      bgyAnchorLink__link: true,
      'bgyAnchorLink__link--active': href === activeLink,
    }"
    :href="href"
    :type="type"
    @click="handleClick"
  >
    <slot name="default">{{ title }}</slot>
  </el-link>
</template>
<script lang="ts">
// import '../style/bgy-anchor-link.scss'
import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  toRefs,
  watch,
} from 'vue'
import { ElLink } from '@element-plus/components'
import { useInjectAnchor } from './context'
export default defineComponent({
  name: 'ElBgyAnchorLink',
  components: {
    ElLink,
  },
  props: {
    type: {
      type: String,
      default: 'info',
    },
    href: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const {
      handleClick: contextHandleClick,
      scrollTo,
      unregisterLink,
      registerLink,
      activeLink,
    } = useInjectAnchor()
    const handleClick = (e: Event) => {
      // 获取 A 标签
      let a
      if ((e.target as HTMLElement).tagName === 'SPAN') {
        a = (e.target as HTMLElement).parentElement
      } else {
        a = e.target
      }

      const lastIdx = a.href.lastIndexOf('#')
      const regx = new RegExp(a.href.slice(lastIdx + 1), 'g')
      const result = regx.exec(a.href)
      if (result && result.length === 1) {
        const name = result[0].replace('#', '')
        // 替换锚点链接中#
        const block = document.querySelector(`#${decodeURI(name)}`)
        if (block) {
          block.scrollIntoView({
            behavior: 'smooth',
          })
        }
      }
      e.preventDefault()
      const { href, title } = props
      contextHandleClick(e, { title, href })
      // scrollTo(href)
    }

    watch(
      () => props.href,
      (val, oldVal) => {
        nextTick(() => {
          unregisterLink(oldVal)
          registerLink(val)
        })
      }
    )

    onMounted(() => {
      registerLink(props.href)
    })

    onBeforeUnmount(() => {
      unregisterLink(props.href)
    })

    return {
      activeLink,
      scrollTo,
      unregisterLink,
      registerLink,
      handleClick,
      ...toRefs(props),
    }
  },
})
</script>
