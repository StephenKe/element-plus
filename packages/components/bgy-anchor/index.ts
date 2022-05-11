import { withInstall, withNoopInstall } from '@element-plus/utils'
import BgyAnchor from './src/BgyAnchor.vue'
import BgyAnchorLink from './src/BgyAnchorLink.vue'

export const ElBgyAnchor = withInstall(BgyAnchor, {
  BgyAnchorLink,
})

export const ElBgyAnchorLink = withNoopInstall(BgyAnchorLink)
export default ElBgyAnchor
