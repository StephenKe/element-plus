export interface SearchFormConfig {
  label: string
  model: string
  value?: string
  hidden?: boolean
}

export interface TableColumn {
  prop: string
  label: string
  width?: string
}

export interface TableConfig {
  tableHeight?: string
  multiSelect?: boolean
  columns: TableColumn[]
}

export interface TableDataRow {
  id: string
  [key: string]: string
}

export interface DialogConfig {
  dialogTitle: string
  dialogWidth?: string
  field: string
  f4field: string
  searchFormConfigs: SearchFormConfig[]
  tableConfigs: TableConfig
}
