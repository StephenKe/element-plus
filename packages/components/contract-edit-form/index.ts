import { withInstall } from '@element-plus/utils'
import ContractForm from './src/contract-form.vue'
import ContractMainInfo from './src/components/TabMainInfo.vue'
import ContractEditForm from './src/components/ContractEditForm.vue'
import ContractEditTable from './src/components/ContractEditTable.vue'
import AttachmentTable from './src/components/AttachmentTable.vue'
import ContractSubtitle from './src/components/ContractSubtitle.vue'
import ContractOrgTreeDialog from './src/components/DiaOrganizationTree.vue'
import ContractRegionDialog from './src/components/DiaRegion.vue'
import ContractSearchHelpDialog from './src/components/DiaCommonSearchHelp.vue'
import type { SFCWithInstall } from '@element-plus/utils/vue/typescript'

export const ElContractEditForm: SFCWithInstall<typeof ContractForm> =
  withInstall(ContractForm, {
    ContractSearchHelpDialog,
    ContractRegionDialog,
    ContractOrgTreeDialog,
    ContractSubtitle,
    ContractEditForm,
    ContractEditTable,
    AttachmentTable,
    ContractMainInfo,
  })
export default ElContractEditForm

export * from './src/contract-form'
