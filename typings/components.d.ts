// For this project development
import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    ElAffix: typeof import('../packages/element-plus')['ElAffix']
    ElAlert: typeof import('../packages/element-plus')['ElAlert']
    ElAside: typeof import('../packages/element-plus')['ElAside']
    ElAutocomplete: typeof import('../packages/element-plus')['ElAutocomplete']
    ElAvatar: typeof import('../packages/element-plus')['ElAvatar']
    ElBacktop: typeof import('../packages/element-plus')['ElBacktop']
    ElBadge: typeof import('../packages/element-plus')['ElBadge']
    ElBreadcrumb: typeof import('../packages/element-plus')['ElBreadcrumb']
    ElBreadcrumbItem: typeof import('../packages/element-plus')['ElBreadcrumbItem']
    ElButton: typeof import('../packages/element-plus')['ElButton']
    ElButtonGroup: typeof import('../packages/element-plus')['ElButtonGroup']
    ElCalendar: typeof import('../packages/element-plus')['ElCalendar']
    ElCard: typeof import('../packages/element-plus')['ElCard']
    ElCarousel: typeof import('../packages/element-plus')['ElCarousel']
    ElCarouselItem: typeof import('../packages/element-plus')['ElCarouselItem']
    ElCascader: typeof import('../packages/element-plus')['ElCascader']
    ElCascaderPanel: typeof import('../packages/element-plus')['ElCascaderPanel']
    ElCheckbox: typeof import('../packages/element-plus')['ElCheckbox']
    ElCheckboxButton: typeof import('../packages/element-plus')['ElCheckboxButton']
    ElCheckboxGroup: typeof import('../packages/element-plus')['ElCheckboxGroup']
    ElCol: typeof import('../packages/element-plus')['ElCol']
    ElCollapse: typeof import('../packages/element-plus')['ElCollapse']
    ElCollapseItem: typeof import('../packages/element-plus')['ElCollapseItem']
    ElCollapseTransition: typeof import('../packages/element-plus')['ElCollapseTransition']
    ElColorPicker: typeof import('../packages/element-plus')['ElColorPicker']
    ElContainer: typeof import('../packages/element-plus')['ElContainer']
    ElConfigProvider: typeof import('../packages/element-plus')['ElConfigProvider']
    ElDatePicker: typeof import('../packages/element-plus')['ElDatePicker']
    ElDialog: typeof import('../packages/element-plus')['ElDialog']
    ElDivider: typeof import('../packages/element-plus')['ElDivider']
    ElDrawer: typeof import('../packages/element-plus')['ElDrawer']
    ElDropdown: typeof import('../packages/element-plus')['ElDropdown']
    ElDropdownItem: typeof import('../packages/element-plus')['ElDropdownItem']
    ElDropdownMenu: typeof import('../packages/element-plus')['ElDropdownMenu']
    ElEmpty: typeof import('../packages/element-plus')['ElEmpty']
    ElFooter: typeof import('../packages/element-plus')['ElFooter']
    ElForm: typeof import('../packages/element-plus')['ElForm']
    ElFormItem: typeof import('../packages/element-plus')['ElFormItem']
    ElHeader: typeof import('../packages/element-plus')['ElHeader']
    ElIcon: typeof import('../packages/element-plus')['ElIcon']
    ElImage: typeof import('../packages/element-plus')['ElImage']
    ElImageViewer: typeof import('../packages/element-plus')['ElImageViewer']
    ElInput: typeof import('../packages/element-plus')['ElInput']
    ElInputNumber: typeof import('../packages/element-plus')['ElInputNumber']
    ElLink: typeof import('../packages/element-plus')['ElLink']
    ElMain: typeof import('../packages/element-plus')['ElMain']
    ElMenu: typeof import('../packages/element-plus')['ElMenu']
    ElMenuItem: typeof import('../packages/element-plus')['ElMenuItem']
    ElMenuItemGroup: typeof import('../packages/element-plus')['ElMenuItemGroup']
    ElOption: typeof import('../packages/element-plus')['ElOption']
    ElOptionGroup: typeof import('../packages/element-plus')['ElOptionGroup']
    ElPageHeader: typeof import('../packages/element-plus')['ElPageHeader']
    ElPagination: typeof import('../packages/element-plus')['ElPagination']
    ElPopconfirm: typeof import('../packages/element-plus')['ElPopconfirm']
    ElPopper: typeof import('../packages/element-plus')['ElPopper']
    ElProgress: typeof import('../packages/element-plus')['ElProgress']
    ElRadio: typeof import('../packages/element-plus')['ElRadio']
    ElRadioButton: typeof import('../packages/element-plus')['ElRadioButton']
    ElRadioGroup: typeof import('../packages/element-plus')['ElRadioGroup']
    ElRate: typeof import('../packages/element-plus')['ElRate']
    ElRow: typeof import('../packages/element-plus')['ElRow']
    ElScrollbar: typeof import('../packages/element-plus')['ElScrollbar']
    ElSelect: typeof import('../packages/element-plus')['ElSelect']
    ElSlider: typeof import('../packages/element-plus')['ElSlider']
    ElStep: typeof import('../packages/element-plus')['ElStep']
    ElSteps: typeof import('../packages/element-plus')['ElSteps']
    ElSubMenu: typeof import('../packages/element-plus')['ElSubMenu']
    ElSwitch: typeof import('../packages/element-plus')['ElSwitch']
    ElTabPane: typeof import('../packages/element-plus')['ElTabPane']
    ElTable: typeof import('../packages/element-plus')['ElTable']
    ElTableColumn: typeof import('../packages/element-plus')['ElTableColumn']
    ElTabs: typeof import('../packages/element-plus')['ElTabs']
    ElTag: typeof import('../packages/element-plus')['ElTag']
    ElTimePicker: typeof import('../packages/element-plus')['ElTimePicker']
    ElTimeSelect: typeof import('../packages/element-plus')['ElTimeSelect']
    ElTimeline: typeof import('../packages/element-plus')['ElTimeline']
    ElTimelineItem: typeof import('../packages/element-plus')['ElTimelineItem']
    ElTooltip: typeof import('../packages/element-plus')['ElTooltip']
    ElTransfer: typeof import('../packages/element-plus')['ElTransfer']
    ElTree: typeof import('../packages/element-plus')['ElTree']
    ElTreeV2: typeof import('../packages/element-plus')['ElTreeV2']
    ElUpload: typeof import('../packages/element-plus')['ElUpload']
    ElSpace: typeof import('../packages/element-plus')['ElSpace']
    ElSkeleton: typeof import('../packages/element-plus')['ElSkeleton']
    ElSkeletonItem: typeof import('../packages/element-plus')['ElSkeletonItem']
    ElCheckTag: typeof import('../packages/element-plus')['ElCheckTag']
    ElDescriptions: typeof import('../packages/element-plus')['ElDescriptions']
    ElDescriptionsItem: typeof import('../packages/element-plus')['ElDescriptionsItem']
    ElResult: typeof import('../packages/element-plus')['ElResult']
    ElSelectV2: typeof import('../packages/element-plus')['ElSelectV2']
    ElBgyAnchor: typeof import('../packages/element-plus')['ElBgyAnchor']
    ElToolbar: typeof import('../packages/element-plus')['ElToolbar']
    ElCompleteMenu: typeof import('../packages/element-plus')['ElCompleteMenu']
    ElQueryForm: typeof import('../packages/element-plus')['ElQueryForm']
    ElBgyUpload: typeof import('../packages/element-plus')['ElBgyUpload']
    ElTableRender: typeof import('../packages/element-plus')['ElTableRender']
    ElContractEditForm: typeof import('../packages/element-plus')['ElContractEditForm']
    ElContractOnlineCompiler: typeof import('../packages/element-plus')['ElContractOnlineCompiler']
    ElBgyTree: typeof import('../packages/element-plus')['ElBgyTree']
    ElBgyTreeSelect: typeof import('../packages/element-plus')['ElBgyTreeSelect']
  }

  interface ComponentCustomProperties {
    $message: typeof import('../packages/element-plus')['ElMessage']
    $notify: typeof import('../packages/element-plus')['ElNotification']
    $msgbox: typeof import('../packages/element-plus')['ElMessageBox']
    $messageBox: typeof import('../packages/element-plus')['ElMessageBox']
    $alert: typeof import('../packages/element-plus')['ElMessageBox']['alert']
    $confirm: typeof import('../packages/element-plus')['ElMessageBox']['confirm']
    $prompt: typeof import('../packages/element-plus')['ElMessageBox']['prompt']
    $loading: typeof import('../packages/element-plus')['ElLoadingService']
  }
}

export {}
