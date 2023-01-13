import { buildProps, definePropType, isString } from '@element-plus/utils'

import type { ExtractPropTypes } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { CustomMenuItemRegistered } from './types'

export const customMenuItemProps = buildProps({
  index: {
    type: definePropType<string | null>([String, null]),
    default: null,
  },
  route: {
    type: definePropType<RouteLocationRaw>([String, Object]),
  },
  disabled: Boolean,
  tooltip: Boolean,
} as const)
export type CustomMenuItemProps = ExtractPropTypes<typeof customMenuItemProps>

export const customMenuItemEmits = {
  click: (item: CustomMenuItemRegistered) =>
    isString(item.index) && Array.isArray(item.indexPath),
}
export type CustomMenuItemEmits = typeof customMenuItemEmits
