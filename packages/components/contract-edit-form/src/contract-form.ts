import { buildProps } from '@element-plus/utils'
import type { ExtractPropTypes, PropType } from 'vue'
import type { IUser } from './interface'

export const contractEditFormProps = buildProps({
  env: {
    type: String,
    default: 'dev',
  },
  user: {
    type: Object as PropType<IUser>,
    default() {
      return {
        name: '',
        bip: '',
      }
    },
  },
  // 接口请求前缀
  urlPrefix: {
    type: String,
    default: '',
  },
  conCategoryNo: {
    type: String,
    default: '20',
  },
  pageType: {
    type: String,
    default: 'view',
  },
  documentNo: {
    type: String,
    default: '',
  },
  conState: {
    type: String,
    default: '13',
  },
  documentType: {
    type: String,
    default: '30',
  },
  conClassNo1: {
    type: String,
    default: '',
  },
  conClassNo2: {
    type: String,
    default: '',
  },
  conClassNo3: {
    type: String,
    default: '',
  },
  ztype: {
    type: String,
    default: '',
  },
})

export type ContractEditFormProps = ExtractPropTypes<
  typeof contractEditFormProps
>
