<script lang="ts">
//@ts-nocheck
import {
  computed,
  defineComponent,
  h,
  getCurrentInstance,
  inject,
  ref,
  provide,
  onBeforeUnmount,
  Text,
} from 'vue'
import { NOOP } from '@vue/shared'
import { elFormKey } from '@element-plus/tokens'
import { ElButton } from '@element-plus/components'

import { debugWarn } from '@element-plus/utils'
import ajax from './ajax'
import UploadList from './upload-list.vue'
import Upload from './upload.vue'
import useHandlers, { getFullUrl, getToken } from './useHandlers'
import {
  UPLOAD_URL,
  YTH_PROJECT,
  PREVIEW_URL,
  REMOVE_URL,
  DOWNLOAD_URL,
  MULTI_DOWNLOAD_URL,
  YTH_ACCEPT,
} from './constants'

import type { PropType } from 'vue'
import type { ElFormContext } from '@element-plus/tokens'
import type { Nullable } from '@element-plus/utils'
import type {
  ListType,
  ListContainerType,
  UploadFile,
  FileHandler,
  FileResultHandler,
  PreviewInfo,
} from './upload.type'

type PFileHandler<T> = PropType<FileHandler<T>>
type PFileResultHandler<T = any> = PropType<FileResultHandler<T>>

export default defineComponent({
  name: 'ElBgyUpload',
  components: {
    Upload,
    UploadList,
  },
  props: {
    action: {
      type: String,
      default: UPLOAD_URL,
    },
    headers: {
      type: Object as PropType<Headers>,
      default: () => ({}),
    },
    method: {
      type: String,
      default: 'post',
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 是否支持文件多选，如果是数字，则表示每次支持选择的文件个数
     */
    multiple: {
      type: [Boolean, Number],
      default: false,
    },
    name: {
      type: String,
      default: 'file',
    },
    drag: {
      type: Boolean,
      default: false,
    },
    withCredentials: Boolean,
    inlineTip: {
      type: Boolean,
      default: true,
    },
    needDefaultAcceptTips: {
      type: Boolean,
      default: false,
    },
    showFileList: {
      type: Boolean,
      default: true,
    },
    /**
     * 接受的文件格式后缀列表，可以为一个二维数组
     *
     * 例如：
     * ['png', 'doc', 'pdf']，生成之后的提示信息为：支持png, doc, pdf
     *
     * [['png', 'jpg', 'jpeg'], ['doc', 'docx'], 'pdf']，生成之后的提示信息为：支持png/jpg/jpeg, doc/docx, pdf
     */
    accept: {
      type: Array,
      default: () => [],
    },
    /**
     * 单个文件大小限制，单位 kb
     */
    perSize: {
      type: Number,
    },
    type: {
      type: String,
      default: 'select',
    },
    beforeUpload: {
      type: Function as PFileHandler<void>,
      default: NOOP,
    },
    beforeRemove: {
      type: Function as PFileHandler<boolean>,
      default: NOOP,
    },
    onRemove: {
      type: Function as PFileHandler<void>,
      default: NOOP,
    },
    onChange: {
      type: Function as PFileHandler<void>,
      default: NOOP,
    },
    onPreview: {
      type: Function as PFileHandler<void>,
      default: NOOP,
    },
    onDownload: {
      type: Function as PFileHandler<void>,
      default: NOOP,
    },
    onSuccess: {
      type: Function as PFileResultHandler,
      default: NOOP,
    },
    onProgress: {
      type: Function as PFileResultHandler<ProgressEvent>,
      default: NOOP,
    },
    onError: {
      type: Function as PFileResultHandler<Error>,
      default: NOOP,
    },
    fileList: {
      type: Array as PropType<UploadFile[]>,
      default: () => {
        return [] as UploadFile[]
      },
    },
    autoUpload: {
      type: Boolean,
      default: true,
    },
    listType: {
      type: String as PropType<ListType>,
      default: 'text' as ListType, // text,picture,picture-card
    },
    listContainerType: {
      type: String as PropType<ListContainerType>,
      default: 'list' as ListContainerType, // list,table
    },
    httpRequest: {
      type: Function,
      default: ajax,
    },
    disabled: Boolean,
    limit: {
      type: Number as PropType<Nullable<number>>,
      default: null,
    },
    onValidator: {
      type: Function as PropType<() => boolean>,
      // default: () => NOOP,
    },
    // 来源系统，默认 “一体化”，当为默认时，会执行默认的下载，删除，预览等逻辑
    sourceSystem: {
      type: String,
      default: YTH_PROJECT,
    },
    // 是否可选，为 true 时显示多选框，并触发 selection-change 事件
    selectable: {
      type: Boolean,
      default: false,
    },
    // selectable 为 true 时，切换文件列表选择状态时触发
    onSelectionChange: {
      type: Function as PFileHandler<void>,
      default: NOOP,
    },
    // 一体化接口请求域名
    requestDomain: {
      type: String,
      default: '',
    },
    // 一体化预览所需参数对象
    previewInfo: {
      type: Object as PropType<PreviewInfo>,
      default: () => ({}),
    },
    // 自定义预览接口
    previewUrl: {
      type: String,
      default: PREVIEW_URL,
    },
    // 自定义删除接口
    removeUrl: {
      type: String,
      default: REMOVE_URL,
    },
    // 自定义下载接口
    downloadUrl: {
      type: String,
      default: DOWNLOAD_URL,
    },
    // 下载前
    beforeDownload: {
      type: Function as PFileHandler<boolean>,
      default: NOOP,
    },
    // 预览前
    beforePreview: {
      type: Function as PFileHandler<boolean>,
      default: NOOP,
    },
    // 终端类型
    terminalType: {
      type: String,
      values: ['pc', 'mobile'],
      default: 'pc',
    },
  },
  setup(props) {
    const elForm = inject(elFormKey, {} as ElFormContext)

    const uploadDisabled = computed(() => {
      return props.disabled || elForm.disabled
    })
    const {
      isYth,
      abort,
      clearFiles,
      handleError,
      handleProgress,
      handleStart,
      handleRestart,
      handleSuccess,
      handleRemove,
      handlePreview,
      handleDownload,
      handleSelectionChange,
      handleTableSelectionChange,
      getSelection,
      submit,
      uploadRef,
      uploadFiles,
    } = useHandlers(props)

    provide('uploader', getCurrentInstance())

    onBeforeUnmount(() => {
      uploadFiles.value.forEach((file) => {
        if (file.url && file.url.indexOf('blob:') === 0) {
          URL.revokeObjectURL(file.url)
        }
      })
    })

    // 批量下载
    const batchDownload = (selection) => {
      if (!isYth) {
        debugWarn('BgyUpload', '批量下载仅能在一体化-文件中台项目中使用')
        return
      }
      // 若未传递选中附件列表参数，则自动获取
      if (!selection) {
        selection = getSelection()
      }
      // 若当前为选中附件，跳出
      if (!selection.length) return
      const fileIds = selection.map((item) => item?.response?.data?.id)
      const url = getFullUrl(
        props.requestDomain,
        MULTI_DOWNLOAD_URL.replace('FILEIDS', fileIds.join(','))
      )
      window && window.open(url, '_blank')
    }

    return {
      abort,
      dragOver: ref(false),
      draging: ref(false),
      handleError,
      handleProgress,
      handleRemove,
      handlePreview,
      handleDownload,
      handleStart,
      handleRestart,
      handleSuccess,
      handleSelectionChange,
      handleTableSelectionChange,
      uploadDisabled,
      uploadFiles,
      uploadRef,
      submit,
      clearFiles,
      batchDownload,
    }
  },
  render() {
    let uploadList
    if (this.showFileList) {
      uploadList = h(
        UploadList,
        {
          disabled: this.uploadDisabled,
          terminalType: this.terminalType,
          listType: this.listType,
          listContainerType: this.listContainerType,
          files: this.uploadFiles,
          sourceSystem: this.sourceSystem,
          selectable: this.selectable,
          onRemove: this.handleRemove,
          handlePreview: this.handlePreview,
          handleDownload: this.handleDownload,
          handleRestart: this.handleRestart,
          handleSelectionChange: this.handleSelectionChange,
          handleTableSelectionChange: this.handleTableSelectionChange,
        },
        this.$slots.attach
          ? {
              // 提供默认插槽，带一个 file 参数
              default: (props: { file: UploadFile }) => {
                return this.$slots?.attach?.(props)
              },
            }
          : null
      )
    } else {
      uploadList = null
    }

    const _accept = this.accept.length
      ? this.accept
      : this.sourceSystem === YTH_PROJECT
      ? YTH_ACCEPT
      : []

    const uploadData = {
      type: this.type,
      drag: this.drag,
      action: this.action,
      multiple: this.multiple,
      'before-upload': this.beforeUpload,
      'with-credentials': this.withCredentials,
      headers: Object.keys(this.headers)?.length
        ? this.headers
        : this.sourceSystem === YTH_PROJECT
        ? getToken()
        : this.headers,
      method: this.method,
      name: this.name,
      data: this.data,
      accept: _accept
        .flat()
        .map((e) => `.${e}`)
        .join(','),
      fileList: this.uploadFiles,
      autoUpload: this.autoUpload,
      listType: this.listType,
      disabled: this.uploadDisabled,
      limit: this.limit,
      perSize: this.perSize,
      'on-validator': this.onValidator,
      'on-start': this.handleStart,
      'on-progress': this.handleProgress,
      'on-success': this.handleSuccess,
      'on-error': this.handleError,
      'on-preview': this.onPreview,
      'on-download': this.onDownload,
      'on-remove': this.handleRemove,
      'http-request': this.httpRequest,
      ref: 'uploadRef',
    }
    // console.log('🚀 ~ file: index.vue:393 ~ render ~ uploadData:', uploadData)

    const tipInfo = () => {
      const arr = [] as Array<string>
      if (_accept.length && _accept !== YTH_ACCEPT) {
        const accepts = _accept
          .map((e) => (e instanceof Array ? e.join('/') : e))
          .join(', ')
        arr.push(`支持${accepts}`)
      }
      if (
        _accept.length &&
        this.needDefaultAcceptTips &&
        _accept === YTH_ACCEPT
      ) {
        const accepts = _accept
          .map((e) => (e instanceof Array ? e.join('/') : e))
          .join(', ')
        arr.push(`支持${accepts}`)
      }
      if (this.perSize) {
        arr.push(`单个文件大小不超过${(this.perSize / 1024).toFixed(2)}M`)
      }
      if (typeof this.multiple === 'number' && this.multiple > 0) {
        arr.push(`单次上传文件不得超过${this.multiple}个`)
      }
      if (this.limit) {
        arr.push(`最多支持${this.limit}个附件。`)
      }

      // `支持jpg/jpeg/png, pdf, doc/docx, xls/xlsx, ppt/pptx,zip,rar，单个文件大小不超过4M，单次上传文件不得超过3个，最多支持10个附件。`
      return arr.join('，')
    }

    const trigger =
      this.$slots.trigger ||
      this.$slots.default ||
      (() => h(ElButton, { type: 'primary', plain: true }, '上传附件')) // 默认上传触发器

    const tipComponent = this.$slots.tip?.() || tipInfo()

    const uploadComponent = h(Upload, uploadData, {
      default: () => trigger?.(),
      tip: () => this.inlineTip && tipComponent,
    })

    return h('div', [
      [
        this.$slots.trigger
          ? [uploadComponent, this.$slots.default?.()]
          : uploadComponent,
        !this.inlineTip && tipComponent, // inlineTip 为true时，内容放在 Upload 内
      ],
      uploadList,
    ])
  },
})
</script>
