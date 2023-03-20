//@ts-nocheck
import { ref, watch } from 'vue'
import { NOOP } from '@vue/shared'
import cloneDeep from 'lodash/cloneDeep'
import { debugWarn } from '@element-plus/utils'
import { PREVIEW_URL, YTH_PROJECT } from './constants'

// Inline types
import { ythRemove, ythDownload, ythPreview } from './ajax'
import type {
  ListType,
  UploadFile,
  UploadStatus,
  ElFile,
  ElUploadProgressEvent,
  IUseHandlersProps,
} from './upload.type'
type UploadRef = {
  abort: (file: UploadFile) => void
  upload: (file: ElFile) => void
  reupload: (file: ElFile) => void
}
// helpers
function getFile(rawFile: ElFile, uploadFiles: UploadFile[]) {
  return uploadFiles.find((file) => file.uid === rawFile.uid)
}

function genUid(seed: number) {
  return Date.now() + seed
}

// 获取接口请求完整 URL
export function getFullUrl(domain: string, urlProp: string): string {
  if (!domain) return urlProp
  if (/^https?:/i.test(urlProp)) return urlProp
  const formatDomain = domain.endsWith('/') ? domain.slice(0, -1) : domain
  return `${formatDomain}${urlProp}`
}

const outerHostNameList = [
  'sispsit.countrygarden.com.cn',
  'sispuat.countrygarden.com.cn',
  'sisp.countrygarden.com.cn'
]

const ispOuterFlag = () => {
  const { href, hostname } = window.location

  return (
    outerHostNameList.includes(hostname) ||
    href.includes('/gys-outer-home/') ||
    href.includes(':3001/')
  )
}

const getIspToken = () => {
  return ispOuterFlag()
    ? localStorage.getItem('gys_access_token')
    : localStorage.getItem('bgy_access_token')
}

// 获取YTH token
export function getToken(): string {
  const sapToken = localStorage.getItem('cloud_authorization')
  return sapToken ? { Authorization: `Bearer ${sapToken}` } : { token: getIspToken() }
}

export default (props: IUseHandlersProps) => {
  const uploadFiles = ref<UploadFile[]>([])
  const uploadRef = ref<UploadRef | null>(null)
  // 来源系统是否为“一体化项目”
  const isYth = ref<boolean>(props.sourceSystem === YTH_PROJECT)
  // 已选文件列表
  const selection = ref<UploadFile[]>([])

  let tempIndex = 1

  function abort(file: UploadFile) {
    uploadRef.value!.abort(file)
  }

  function clearFiles(
    status: UploadStatus[] = ['ready', 'uploading', 'success', 'fail']
  ) {
    uploadFiles.value = uploadFiles.value.filter((row) => {
      return !status.includes(row.status)
    })
  }

  function handleError(err: Error, rawFile: ElFile) {
    const file = getFile(rawFile, uploadFiles.value)
    file!.status = 'fail'
    // 上传失败不进行删除
    // uploadFiles.value.splice(uploadFiles.value.indexOf(file), 1)
    props.onError?.(err, file!, uploadFiles.value)
    props.onChange?.(file!, uploadFiles.value)
  }

  function handleProgress(ev: ElUploadProgressEvent, rawFile: ElFile) {
    const file = getFile(rawFile, uploadFiles.value)
    props.onProgress?.(ev, file!, uploadFiles.value)
    file!.status = 'uploading'
    file!.percentage = ev.percent || 0
  }

  function handleSuccess(res: any, rawFile: ElFile) {
    const file = getFile(rawFile, uploadFiles.value)
    if (file) {
      file.status = 'success'
      file.response = res
      props.onSuccess?.(res, file, uploadFiles.value)
      props.onChange?.(file, uploadFiles.value)
    }
  }

  function handleRestart(file: UploadFile) {
    uploadRef.value?.reupload(file.raw)
  }

  function handleStart(rawFile: ElFile) {
    const uid = genUid(tempIndex++)
    rawFile.uid = uid
    const file: UploadFile = {
      name: rawFile.name,
      percentage: 0,
      status: 'ready',
      size: rawFile.size,
      raw: rawFile,
      uid,
    }
    if (props.listType === 'picture-card' || props.listType === 'picture') {
      try {
        file.url = URL.createObjectURL(rawFile)
      } catch (err: any) {
        console.error('[Element Error][Upload]', err)
        props.onError?.(err, file, uploadFiles.value)
      }
    }
    uploadFiles.value.push(file)
    props.onChange?.(file, uploadFiles.value)
  }

  // 附件移除处理函数
  function handleRemove(file: UploadFile, raw: ElFile) {
    if (raw) {
      file = getFile(raw, uploadFiles.value)
    }
    const revokeObjectURL = () => {
      if (file.url && file.url.indexOf('blob:') === 0) {
        URL.revokeObjectURL(file.url)
      }
    }
    const doRemove = () => {
      abort(file)
      const fileList = uploadFiles.value
      fileList.splice(fileList.indexOf(file), 1)
      // const fileId = file.response?.data?.id
      const fileId = file.response?.data?.editionId
      if (!fileId) {
        debugWarn('BgyUpload(一体化)', '无法获取文件 ID，请检查文件数据')
        return
      }
      const action = props.removeUrl.replace('/FILE_ID', `/${fileId}`)
      // 一体化项目执行文件中台删除
      const url = getFullUrl(props.requestDomain, action)
      isYth.value && action && ythRemove(url, props.headers)
      // 执行自定义 on-remove 函数
      props.onRemove && props.onRemove(file, fileList)
      revokeObjectURL()
    }
    if (!props.beforeRemove) {
      doRemove()
    } else if (typeof props.beforeRemove === 'function') {
      const before = props.beforeRemove(file, uploadFiles.value)
      if (before instanceof Promise) {
        before
          .then((confirm) => {
            confirm && doRemove()
          })
          .catch(NOOP)
      } else if (before !== false) {
        doRemove()
      }
    }
  }

  // 附件预览处理函数
  function handlePreview(file: UploadFile) {
    if (!file) {
      return
    }
    const doPreview = () => {
      // 一体化项目文件中台预览
      const url = getFullUrl(props.requestDomain, props.previewUrl)
      const { bip, name } = props.previewInfo
      const params = Object.assign({}, props.previewInfo, {
        // fileId: file.response?.data?.id,
        editionId: file.response?.data?.editionId,
        // tenantKey,
        bip,
        name,
      })
      isYth.value && ythPreview(url, params, props.headers)
      // 执行自定义预览函数
      props.onPreview && props.onPreview(file, uploadFiles.value)
    }
    if (!props.beforePreview) {
      doPreview()
    } else if (typeof props.beforePreview === 'function') {
      const before = props.beforePreview(file, uploadFiles.value)
      if (before instanceof Promise) {
        before
          .then((confirm) => {
            confirm && doPreview()
          })
          .catch(NOOP)
      } else if (before !== false) {
        doPreview()
      }
    }
  }

  // 附件下载处理函数
  function handleDownload(file: UploadFile) {
    if (!file) {
      return
    }
    // 一体化项目文件中台下载
    const doDownload = () => {
      const url = getFullUrl(props.requestDomain, props.downloadUrl)
      isYth.value && ythDownload(url, file, props.headers)
      // 执行自定义下载函数
      props.onDownload && props.onDownload(file, uploadFiles.value)
    }
    if (!props.beforeDownload) {
      doDownload()
    } else if (typeof props.beforeDownload === 'function') {
      const before = props.beforeDownload(file, uploadFiles.value)
      if (before instanceof Promise) {
        before
          .then((confirm) => {
            confirm && doDownload()
          })
          .catch(NOOP)
      } else if (before !== false) {
        doDownload()
      }
    }
  }

  // list 勾选 change 处理函数
  function handleSelectionChange(checked: boolean, file: UploadFile) {
    const index = selection.value.indexOf(file)
    const include = index > -1
    if (checked && !include) {
      selection.value.push(file)
    }
    if (!checked && include) {
      selection.value.splice(index, 1)
    }
    props.onSelectionChange && props.onSelectionChange(selection.value, file)
  }

  // table 勾选 change 处理函数
  function handleTableSelectionChange(fileList: UploadFile[]) {
    selection.value = [...fileList]
    props.onSelectionChange && props.onSelectionChange(selection.value)
  }

  // 获取选中的附件
  function getSelection() {
    return selection.value || []
  }

  function submit() {
    uploadFiles.value
      .filter((file) => file.status === 'ready')
      .forEach((file) => {
        uploadRef.value.upload(file.raw)
      })
  }

  watch(
    () => props.listType,
    (val: ListType) => {
      if (val === 'picture-card' || val === 'picture') {
        uploadFiles.value = uploadFiles.value.map((file) => {
          if (!file.url && file.raw) {
            try {
              file.url = URL.createObjectURL(file.raw)
            } catch (err) {
              props.onError(err, file, uploadFiles.value)
            }
          }
          return file
        })
      }
    }
  )

  watch(
    () => props.fileList,
    (fileList: UploadFile[]) => {
      uploadFiles.value = fileList.map((file) => {
        const cloneFile = cloneDeep(file)
        return {
          ...cloneFile,
          uid: file.uid || genUid(tempIndex++),
          status: file.status || 'success',
        }
      })
    },
    {
      immediate: true,
      deep: true,
    }
  )

  return {
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
    uploadFiles,
    uploadRef,
  }
}
