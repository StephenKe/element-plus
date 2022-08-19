// import { isClient } from '@vueuse/core'
// import {
//   camelize,
//   isObject,
// } from '@vue/shared'
// import type { CSSProperties, ComponentPublicInstance, Ref } from 'vue'
// import type { Nullable } from '@element-plus/utils'

/* istanbul ignore next */
export const on = function (
  element: HTMLElement | Document | Window,
  event: string,
  handler: EventListenerOrEventListenerObject,
  useCapture = false
): void {
  if (element && event && handler) {
    element?.addEventListener(event, handler, useCapture)
  }
}

/* istanbul ignore next */
export const off = function (
  element: HTMLElement | Document | Window,
  event: string,
  handler: EventListenerOrEventListenerObject,
  useCapture = false
): void {
  if (element && event && handler) {
    element?.removeEventListener(event, handler, useCapture)
  }
}
