import { withInstall, withNoopInstall } from '@element-plus/utils'
import TableRender from './src/index.vue'

export const ElTableRender = withInstall(TableRender)
export default TableRender

export * from './src/index'
export * from './src/request.type'
