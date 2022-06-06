//@ts-nocheck
let supportsPassive = false
try {
  const opts = Object.defineProperty({}, 'passive', {
    get() {
      supportsPassive = true
      return supportsPassive
    },
  })
  window.addEventListener('testPassive', null, opts)
  window.removeEventListener('testPassive', null, opts)
} catch {}

export default function addEventListenerWrap(target, eventType, cb, option) {
  if (target && target.addEventListener) {
    let opt = option
    if (
      opt === undefined &&
      supportsPassive &&
      (eventType === 'touchstart' ||
        eventType === 'touchmove' ||
        eventType === 'wheel')
    ) {
      opt = { passive: false }
    }
    target.addEventListener(eventType, cb, opt)
  }
  return {
    remove: () => {
      if (target && target.removeEventListener) {
        target.removeEventListener(eventType, cb)
      }
    },
  }
}
