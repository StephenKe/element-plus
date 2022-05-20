<template>
  <div :class="['el-bgy-upload', `el-bgy-upload--${listType}`]">
    <div
      tabindex="0"
      @click="handleClick"
      @keydown.self.enter.space="handleKeydown"
    >
      <template v-if="drag">
        <upload-dragger :disabled="disabled" @file="uploadFiles">
          <slot></slot>
        </upload-dragger>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </div>
    <div v-if="$slots.tip" class="el-bgy-upload__tip inline">
      <slot name="tip"></slot>
    </div>
    <input
      ref="inputRef"
      class="el-bgy-upload__input"
      type="file"
      :name="name"
      :multiple="Boolean(multiple)"
      :accept="accept"
      @change="handleChange"
    />
  </div>
</template>

<script lang="ts">
//@ts-nocheck
import { defineComponent, ref } from 'vue'
import { NOOP, hasOwn } from '@vue/shared'
import { ElMessage } from '@element-plus/components'

import ajax from './ajax'
import UploadDragger from './upload-dragger.vue'

import type { PropType } from 'vue'
import type { Indexable, Nullable } from '@element-plus/utils'
import type { ListType, UploadFile, ElFile } from './upload.type'

type IFileHanlder = (
  file: Nullable<ElFile[]>,
  fileList?: UploadFile[]
) => unknown

type AjaxEventListener = (e: ProgressEvent, file: ElFile) => unknown

export default defineComponent({
  components: {
    UploadDragger,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
    // 请求接口，默认一体化文件中台接口
    action: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: 'file',
    },
    data: {
      type: Object as PropType<Record<string, any>>,
      default: () => null,
    },
    headers: {
      type: Object as PropType<Nullable<Partial<Headers>>>,
      default: () => null,
    },
    method: {
      type: String,
      default: 'post',
    },
    withCredentials: {
      type: Boolean,
      default: false,
    },
    /**
     * mulitple为数字时则可用于限制单次上传时的文件个数
     */
    multiple: {
      type: [Boolean, Number],
      default: false,
    },
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers
    accept: {
      type: String,
      default: '',
    },
    /**
     * 单个文件大小限制，单位 kb
     */
    perSize: {
      type: Number,
    },
    onStart: {
      type: Function as PropType<(file: File) => void>,
      default: NOOP as (file: File) => void,
    },
    onProgress: {
      type: Function as PropType<AjaxEventListener>,
      default: NOOP as AjaxEventListener,
    },
    onSuccess: {
      type: Function as PropType<AjaxEventListener>,
      default: NOOP as AjaxEventListener,
    },
    onError: {
      type: Function as PropType<AjaxEventListener>,
      default: NOOP as AjaxEventListener,
    },
    beforeUpload: {
      type: Function as PropType<
        (file: File) => Promise<File | Blob> | boolean | unknown
      >,
      default: NOOP as (file: File) => void,
    },
    drag: {
      type: Boolean,
      default: false,
    },
    onPreview: {
      type: Function as PropType<IFileHanlder>,
      default: NOOP as IFileHanlder,
    },
    onRemove: {
      type: Function as PropType<
        (file: Nullable<FileList>, rawFile: ElFile) => void
      >,
      default: NOOP as (file: Nullable<FileList>, rawFile: ElFile) => void,
    },
    fileList: {
      type: Array as PropType<UploadFile[]>,
      default: () => [] as UploadFile[],
    },
    autoUpload: {
      type: Boolean,
      default: true,
    },
    listType: {
      type: String as PropType<ListType>,
      default: 'text',
    },
    httpRequest: {
      type: Function as
        | PropType<typeof ajax>
        | PropType<(...args: unknown[]) => Promise<unknown>>,
      default: () => ajax,
    },
    disabled: Boolean,
    limit: {
      type: Number as PropType<Nullable<number>>,
      default: null,
    },
    onValidator: {
      type: Function as PropType<(props: object, files: FileList) => boolean>,
      // default: NOOP,
    },
  },
  setup(props) {
    const reqs = ref({} as Indexable<XMLHttpRequest | Promise<any>>)
    const mouseover = ref(false)
    const inputRef = ref(null as Nullable<HTMLInputElement>)

    async function uploadFiles(files: FileList) {
      let postFiles = Array.from(files)
      // 如果用户自定义了验证方法
      if (props.onValidator) {
        const validator = await props.onValidator(props, files)
        // 返回 false 表示验证未通过，否则继承往下执行
        if (!validator) {
          return
        }
      } else {
        // 内部提供验证
        if (props.perSize) {
          const oversize = postFiles.filter(
            (e) => Math.ceil(e.size / 1024) > (props.perSize as number)
          )
          if (oversize.length) {
            const files = oversize.map((e) => e.name).join(', ')
            ElMessage.warning(`上传的文件 ${files} 大小超出限制`)
            return
          }
        }
        if (!props.multiple) {
          postFiles = postFiles.slice(0, 1)
        } else if (typeof props.multiple === 'number') {
          // multiple 如果大于 limit， 则取 limit
          const limit = props.limit
            ? Math.min(props.multiple, props.limit)
            : props.multiple
          if (postFiles.length > limit) {
            // props.onExceed(files, props.fileList)
            ElMessage.warning(
              `单次上传文件不得超过${limit}个，您本次选择了${postFiles.length}个`
            )
            return
          }
        }
        if (props.limit && props.fileList.length + files.length > props.limit) {
          // props.onExceed(files, props.fileList)
          ElMessage.warning(`最多上传${props.limit}个附件`)
          return
        }
        if (postFiles.length === 0) {
          return
        }
      }
      // 执行上传
      postFiles.forEach((rawFile) => {
        props.onStart(rawFile)
        if (props.autoUpload) upload(rawFile as ElFile)
      })
    }

    function upload(rawFile: ElFile) {
      inputRef.value.value = null
      if (!props.beforeUpload) {
        return post(rawFile)
      }
      const before = props.beforeUpload(rawFile)
      if (before instanceof Promise) {
        before
          .then((processedFile) => {
            const fileType = Object.prototype.toString.call(processedFile)
            if (fileType === '[object File]' || fileType === '[object Blob]') {
              if (fileType === '[object Blob]') {
                processedFile = new File([processedFile], rawFile.name, {
                  type: rawFile.type,
                })
              }
              for (const p in rawFile) {
                if (hasOwn(rawFile, p)) {
                  processedFile[p] = rawFile[p]
                }
              }
              post(processedFile)
            } else {
              post(rawFile)
            }
          })
          .catch((err) => {
            console.warn('上传文件异常', err)
            props.onRemove(null, rawFile)
          })
      } else if (before !== false) {
        post(rawFile)
      } else {
        props.onRemove(null, rawFile)
      }
    }
    function abort(file) {
      const _reqs = reqs.value
      if (file) {
        let uid = file
        if (file.uid) uid = file.uid
        if (_reqs[uid]) {
          ;(_reqs[uid] as XMLHttpRequest).abort()
        }
      } else {
        Object.keys(_reqs).forEach((uid) => {
          if (_reqs[uid]) (_reqs[uid] as XMLHttpRequest).abort()
          delete _reqs[uid]
        })
      }
    }

    function reupload(rawFile: ElFile) {
      post(rawFile)
    }

    function post(rawFile: ElFile) {
      const { uid } = rawFile
      const options = {
        headers: props.headers,
        withCredentials: props.withCredentials,
        file: rawFile,
        data: props.data,
        method: props.method,
        filename: props.name,
        action: props.action,
        onProgress: (e) => {
          props.onProgress(e, rawFile)
        },
        onSuccess: (res) => {
          props.onSuccess(res, rawFile)
          delete reqs.value[uid]
        },
        onError: (err) => {
          props.onError(err, rawFile)
          delete reqs.value[uid]
        },
      }
      const req = props.httpRequest(options)
      reqs.value[uid] = req
      if (req instanceof Promise) {
        req.then(options.onSuccess, options.onError)
      }
    }

    function handleChange(e: DragEvent) {
      const files = (e.target as HTMLInputElement).files
      if (!files) return
      uploadFiles(files)
    }

    function handleClick() {
      if (!props.disabled) {
        inputRef.value.value = null
        inputRef.value.click()
      }
    }

    function handleKeydown() {
      handleClick()
    }

    return {
      reqs,
      mouseover,
      inputRef,
      abort,
      post,
      handleChange,
      handleClick,
      handleKeydown,
      upload,
      reupload,
      uploadFiles,
    }
  },
})
</script>
