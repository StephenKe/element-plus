import { withInstall, withNoopInstall } from '@element-plus/utils'
import BgyAnchor from './src/BgyAnchor.vue'
import BgyAnchorLink from './src/BgyAnchorLink.vue'

export var ElBgyAnchor = withInstall(BgyAnchor, {
  BgyAnchorLink,
})

export var ElBgyAnchorLink = withNoopInstall(BgyAnchorLink)
export default ElBgyAnchor
