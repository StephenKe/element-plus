/**
 * InjectionKey--Vue 提供了一个 InjectionKey 接口，该接口是扩展了 Symbol 的泛型类型。它可用于在生产者和消费者之间同步 inject 值的类型：  https://v3.cn.vuejs.org/api/composition-api.html#provide-inject
 *
 * */
import { computed, inject, provide } from 'vue'
import type { InjectionKey, Ref } from 'vue'
/**
 * Provide / Inject--
 * 对于这种情况，我们可以使用一对 provide 和 inject。无论组件层次结构有多深，父组件都可以作为其所有子组件的依赖提供者。这个特性有两个部分：父组件有一个 provide 选项来提供数据，子组件有一个 inject 选项来开始使用这些数据。
 * https://v3.cn.vuejs.org/guide/component-provide-inject.html#provide-inject
 * */

// 定义一个注入键，用于注入到组件中
export interface AnchorContext {
  registerLink: (link: string) => void
  unregisterLink: (link: string) => void
  activeLink: Ref<string>
  scrollTo: (link: string) => void
  handleClick: (e: Event, info: { title: any; href: string }) => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// function noop(..._any: any[]): any { }

//
export const AnchorContextKey: InjectionKey<AnchorContext> =
  Symbol('anchorContextKey')

// state:AnchorContext 锚点的上下文
const useProvideAnchor = (state: AnchorContext) => {
  provide(AnchorContextKey, state)
}

const useInjectAnchor = () => {
  return inject(AnchorContextKey, {
    registerLink(..._any: any[]) {
      console.log(_any)
    },
    unregisterLink(..._any: any[]) {
      console.log(_any)
    },
    scrollTo(..._any: any[]) {
      console.log(_any)
    },
    activeLink: computed(() => ''),
    handleClick(..._any: any[]) {
      console.log(_any)
    },
  } as AnchorContext)
}

export { useInjectAnchor, useProvideAnchor }
export default useProvideAnchor
