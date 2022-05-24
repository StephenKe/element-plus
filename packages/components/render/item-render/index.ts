import { withInstall } from '@element-plus/utils'
import ItemRender from './src/index.vue'
import ItemRangeRender from './src/range.vue'

export const ElItemRender = withInstall(ItemRender)
export const ElItemRangeRender = withInstall(ItemRangeRender)

export default ElItemRender

export * from './src/index'
