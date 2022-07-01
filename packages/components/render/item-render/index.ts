import { withInstall } from '@element-plus/utils'
import ItemRender from './src/index.vue'
import ItemSplitRender from './src/item-split.vue'

export const ElItemRender = withInstall(ItemRender)
export const ElItemSplitRender = withInstall(ItemSplitRender)

export default ElItemRender

export * from './src/index'
