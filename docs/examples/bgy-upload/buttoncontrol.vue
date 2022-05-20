<template>
  <el-bgy-upload
    action="https://jsonplaceholder.typicode.com/posts/"
    :on-preview="handlePreview"
    :on-download="handleDownload"
    :file-list="fileList"
    style="margin-bottom: 10px"
  />
  <el-bgy-upload
    action="https://jsonplaceholder.typicode.com/posts/"
    :on-preview="handlePreview"
    :on-download="handleDownload"
    :file-list="fileList"
    list-container-type="table"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { UploadFile } from 'element-plus'

interface RawFile {
  name: string
  url: string
  uid?: string
  status?: 'ready' | 'uploading' | 'success' | 'fail'
  percentage?: number
}

const fileList = ref<RawFile[]>([
  {
    name: 'food.jpeg',
    status: 'success',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: '下午茶.png',
    operationButtons: ['reupload', 'delete', 'preview'],
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'Ciqc1F8O342ATpU7AMfwii64x74028.png',
    status: 'success',
    operationButtons: ['reupload', 'preview', 'download'],
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
])
const handleDownload = (file: UploadFile) => {
  console.log('文件下载', file)
}
const handlePreview = (file: UploadFile) => {
  console.log('文件预览', file)
}
</script>
