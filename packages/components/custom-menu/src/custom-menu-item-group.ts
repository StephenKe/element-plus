import type { ExtractPropTypes } from 'vue'

export const customMenuItemGroupProps = {
  title: String,
} as const
export type CustomMenuItemGroupProps = ExtractPropTypes<
  typeof customMenuItemGroupProps
>
