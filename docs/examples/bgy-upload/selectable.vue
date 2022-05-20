<template>
  <el-bgy-upload
    ref="uploadRef"
    action="https://jsonplaceholder.typicode.com/posts/"
    :file-list="fileList"
    selectable
    :on-selection-change="handleSelectionChange"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { UploadFile } from 'element-plus'

const uploadRef = ref(null)

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
    status: 'success',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'Ciqc1F8O342ATpU7AMfwii64x74028.png',
    status: 'success',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
])

const handleSelectionChange = (file: UploadFile, selection: UploadFile[]) => {
  console.log('handleSelectionChange', file, selection)
}
</script>
