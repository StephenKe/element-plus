import { computed } from 'vue'
import { TinyColor } from '@ctrl/tinycolor'

import type { CustomMenuProps } from './custom-menu'

export default function useMenuColor(props: CustomMenuProps) {
  const menuBarColor = computed(() => {
    const color = props.backgroundColor
    if (!color) {
      return ''
    } else {
      return new TinyColor(color).shade(20).toString()
    }
  })
  return menuBarColor
}
