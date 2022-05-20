<template>
  <el-bgy-upload
    action="https://jsonplaceholder.typicode.com/posts/"
    :on-preview="handlePreview"
    :on-download="handleDownload"
    :on-validator="handleValidator"
    :file-list="fileList"
    :inline-tip="false"
    :before-remove="beforeRemove"
  >
    <!-- 默认插槽自定义触发上传 -->
    <el-tooltip content="点击上传附件" placement="top">
      <el-button :icon="Upload" circle />
    </el-tooltip>

    <!-- 自定义提示信息，通常配合 on-validator 属性一起使用，实现附件上传自主校验 -->
    <template #tip>
      <span class="el-bgy-upload__tip" style="color: orange">
        仅支持上传图片，单文件不超过2M，最多不超过3个附件。
      </span>
    </template>

    <!-- 自定义文件项附加内容 -->
    <template #attach="scopeData">
      <!-- 这里做个限制，只有上传成功的才展示 -->
      <template v-if="scopeData.file.status === 'success'">
        是否合规：
        <el-radio-group v-model="scopeData.file.flag">
          <el-radio label="Y">是</el-radio>
          <el-radio label="N">否</el-radio>
        </el-radio-group>
      </template>
    </template>
  </el-bgy-upload>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { Upload } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from '@element-plus/components'
import type { UploadFile } from 'element-plus'

interface RawFile {
  name: string
  url: string
  status?: 'ready' | 'uploading' | 'success' | 'fail'
}

const fileList = ref<RawFile[]>([
  {
    name: 'food.jpeg',
    status: 'success',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
])

const handleDownload = (file: UploadFile) => {
  console.log('文件下载', file)
}

const handlePreview = (file: UploadFile) => {
  console.log('文件预览', file)
}

// 自定义校验规则，通常配合插槽 tip 一起使用，用户自己实现上传附件的校验
const handleValidator = (props: object, files: FileList) => {
  const alreadyFileList = props.fileList || []
  const fileList = Array.from(files)
  // props.fileList 为已上传的文件列表
  if (alreadyFileList.length + fileList.length > 3) {
    ElMessage.warning('不能超过3个附件')
    return false
  }

  const validator = fileList.every((file) => {
    // 上传的文件类型必须是图片格式
    if (!file.type.startsWith('image/')) {
      ElMessage.warning('上传文件不是图片格式')
      return false
    }
    if (file.size > 1024 * 1024 * 2) {
      ElMessage.warning('上传文件不能超过2M')
      return false
    }
    return true
  })

  return validator
}

// 删除附件前添加弹窗确认提示，根据返回值确定是否要删除
const beforeRemove = (file: UploadFile, fileList: UploadFile[]) => {
  return ElMessageBox.confirm(`确定要删除文件 ${file.name} ?`, '', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(
    () => true,
    () => false
  )
}
</script>
