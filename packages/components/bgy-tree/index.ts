import BgyTree from './src/tree.vue'

import type { App } from 'vue'
import type { SFCWithInstall } from '@element-plus/utils'

BgyTree.install = (app: App): void => {
  app.component(BgyTree.name, BgyTree)
}

const _BgyTree = BgyTree as SFCWithInstall<typeof BgyTree>

export default _BgyTree
export const ElBgyTree = _BgyTree
