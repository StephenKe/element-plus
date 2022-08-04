import { withInstall } from '@element-plus/utils'
import BgyTreeSelect from './src/tree-select.vue'
import type { SFCWithInstall } from '@element-plus/utils/vue/typescript'

export const ElBgyTreeSelect: SFCWithInstall<typeof BgyTreeSelect> =
  withInstall(BgyTreeSelect)

export * from './src/tree-select'

export default ElBgyTreeSelect
