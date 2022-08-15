//@ts-nocheck
import { buildProps } from '@element-plus/utils'

import type { ExtractPropTypes } from 'vue'

export const contractOnlineCompilerProps = buildProps({
  urlPrefix: {
    type: String,
    required: true,
  },
  userInfo: {
    type: Object,
    required: true,
    default() {
      return {
        id: '',
        username: '',
      }
    },
  },
  busLine: {
    type: Object,
    required: true,
    default() {
      return {
        value: '1',
        label: '业务条线1',
      }
    },
  },
  leftSpan: {
    type: Number,
    default: 8,
  },
  rightSpan: {
    type: Number,
    default: 16,
  },
  fileId: {
    type: String,
    required: true,
    default: '',
  },
  callbackUrl: {
    type: String,
    required: true,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
})

export type ContractOnlineCompilerProps = ExtractPropTypes<
  typeof contractOnlineCompilerProps
>

export const contractOnlineCompilerEmits = {}

export type ContractOnlineCompilerEmits = typeof contractOnlineCompilerEmits
