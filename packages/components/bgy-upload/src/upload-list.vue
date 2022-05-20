<template>
  <transition-group
    tag="div"
    :class="[
      'el-bgy-upload-list',
      'el-bgy-upload-list--' + listType,
      { 'is-disabled': disabled },
    ]"
    name="el-list"
  >
    <template v-if="listContainerType === 'list'">
      <el-row v-for="file in files" :key="file.uid || file">
        <el-col :span="16">
          <el-progress
            :class="[
              'el-bgy-upload-list__item',
              'is-' + file.status,
              focusing ? 'focusing' : '',
            ]"
            tabindex="0"
            :percentage="file.percentage"
            @keydown.delete="!disabled && handleRemove(file)"
            @focus="focusing = true"
            @blur="focusing = false"
            @click="onFileClicked"
          >
            <el-row>
              <el-col v-if="selectable" :span="1">
                <el-checkbox
                  @change="(value) => handleSelectionChange(value, file)"
                />
              </el-col>
              <el-col :span="selectable ? 13 : 14">
                <el-link
                  :icon="Link"
                  :underline="false"
                  class="filename"
                  :style="{ marginBottom: selectable ? '-13px' : '3px' }"
                  >{{ file.name }}</el-link
                >
              </el-col>
              <el-col :span="4" class="upload-status">
                {{ viewStatus(file) }}
              </el-col>
              <el-col :span="6">
                <!-- 已上传和上传失败才有操作 -->
                <template v-if="['success', 'fail'].includes(file.status)">
                  <el-link
                    v-if="
                      !file.operationButtons ||
                      file.operationButtons.includes('delete')
                    "
                    :underline="false"
                    :style="{ marginBottom: selectable ? '-13px' : '3px' }"
                    @click="handleRemove(file)"
                  >
                    删除
                  </el-link>
                  <el-link
                    v-if="
                      file.status === 'fail' &&
                      (!file.operationButtons ||
                        file.operationButtons.includes('reupload'))
                    "
                    :underline="false"
                    :style="{ marginBottom: selectable ? '-13px' : '3px' }"
                    @click="handleReUpload(file)"
                  >
                    重新上传
                  </el-link>
                  <template v-else>
                    <el-link
                      v-if="
                        !file.operationButtons ||
                        file.operationButtons.includes('download')
                      "
                      :underline="false"
                      :style="{ marginBottom: selectable ? '-13px' : '3px' }"
                      @click="handlePreview(file)"
                    >
                      预览
                    </el-link>
                    <el-link
                      v-if="
                        !file.operationButtons ||
                        file.operationButtons.includes('download')
                      "
                      :underline="false"
                      :style="{ marginBottom: selectable ? '-13px' : '3px' }"
                      @click="handleDownload(file)"
                    >
                      下载
                    </el-link>
                  </template>
                </template>
              </el-col>
            </el-row>
          </el-progress>
        </el-col>
        <el-col :span="6" :push="2">
          <!-- 默认插槽 -->
          <slot :file="file"></slot>
        </el-col>
      </el-row>
    </template>
    <template v-if="listContainerType === 'table'">
      <el-table
        class="el-bgy-upload-list__table"
        :data="files"
        border
        @selection-change="handleTableSelectionChange"
      >
        <el-table-column v-if="selectable" type="selection" width="45" />
        <el-table-column label="文件名" show-overflow-tooltip>
          <template #default="{ row }">
            <el-link :icon="Link" :underline="false" class="filename">
              {{ row.name }}
            </el-link>
          </template>
        </el-table-column>
        <!-- 默认插槽 -->
        <slot></slot>
        <el-table-column label="状态" width="80px">
          <template #default="{ row }">
            <span
              :class="[
                'upload-status',
                { 'fail-status': row.status === 'fail' },
              ]"
            >
              {{ viewStatus(row) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="140px">
          <!-- 已上传和上传失败才有操作 -->
          <template #default="{ row }">
            <template v-if="['success', 'fail'].includes(row.status)">
              <el-link
                v-if="
                  !row.operationButtons ||
                  row.operationButtons.includes('delete')
                "
                :underline="false"
                @click="handleRemove(row)"
              >
                删除
              </el-link>
              <el-link
                v-if="
                  row.status === 'fail' &&
                  (!row.operationButtons ||
                    row.operationButtons.includes('reupload'))
                "
                :underline="false"
                @click="handleReUpload(row)"
              >
                重新上传
              </el-link>
              <template v-else>
                <el-link
                  v-if="
                    !row.operationButtons ||
                    row.operationButtons.includes('preview')
                  "
                  :underline="false"
                  @click="handlePreview(row)"
                >
                  预览
                </el-link>
                <el-link
                  v-if="
                    !row.operationButtons ||
                    row.operationButtons.includes('download')
                  "
                  :underline="false"
                  @click="handleDownload(row)"
                >
                  下载
                </el-link>
              </template>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </transition-group>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent, ref } from 'vue'
import { NOOP } from '@vue/shared'
import {
  Link,
  // Delete,
  // Close,
  // ZoomIn,
  // Check,
  // CircleCheck,
} from '@element-plus/icons-vue'
import {
  ElButton,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElProgress,
  ElLink,
} from '@element-plus/components'
import { useLocale } from '@element-plus/hooks'

import type { PropType } from 'vue'
import type { UploadFile, listContainerType } from './upload.type'

export default defineComponent({
  name: 'ElUploadList',
  components: {
    ElRow,
    ElCol,
    ElButton,
    ElProgress,
    ElTable,
    ElTableColumn,
    ElLink,
    // ElIcon,
    // Delete,
    // Close,
    // ZoomIn,
    // Check,
    // CircleCheck,
  },
  props: {
    files: {
      type: Array as PropType<UploadFile[]>,
      default: () => [] as File[],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    handlePreview: {
      type: Function as PropType<(file: UploadFile) => void>,
      default: () => NOOP,
    },
    handleDownload: {
      type: Function as PropType<(file: UploadFile) => void>,
      default: () => NOOP,
    },
    handleRestart: {
      type: Function as PropType<(file: UploadFile) => void>,
      default: () => NOOP,
    },
    // 文件列表选中状态变更处理函数
    handleSelectionChange: {
      type: Function as PropType<(checked: boolean, file: UploadFile) => void>,
      default: () => NOOP,
    },
    // table 类型文件列表选中状态变更处理函数
    handleTableSelectionChange: {
      type: Function as PropType<(fileList: UploadFile[]) => void>,
      default: () => NOOP,
    },
    listType: {
      type: String as PropType<'picture' | 'picture-card' | 'text'>,
      default: 'text',
    },
    // 文件列表容器样式，列表 list or 表格 table
    listContainerType: {
      type: String as PropType<listContainerType>,
      default: 'list', // list,table
    },
    // 来源系统，默认 “一体化”，当为默认时，会执行默认的下载，删除，预览等逻辑
    sourceSystem: {
      type: String,
      default: 'yth',
    },
    // 是否可选，为 true 时显示多选框，并触发 selection-change 事件
    selectable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['remove', 'selection-change'],
  setup(props, { emit }) {
    const { t } = useLocale()

    const selection = ref<UploadFile[]>([])

    const handleClick = (file: UploadFile) => {
      props.handlePreview(file)
    }

    const onFileClicked = (e: Event) => {
      ;(e.target as HTMLElement).focus()
    }

    const viewStatus = (file: UploadFile) =>
      file.status === 'ready'
        ? '等待中'
        : file.status === 'uploading'
        ? `上传${Math.ceil(file.percentage as number)}%...`
        : file.status === 'success'
        ? '已上传'
        : file.status === 'fail'
        ? '上传失败'
        : ''

    const handleRemove = (file: UploadFile) => {
      emit('remove', file)
    }

    const handleReUpload = (file: UploadFile) => {
      props.handleRestart(file)
    }

    return {
      focusing: ref(false),
      handleClick,
      handleRemove,
      handleReUpload,
      onFileClicked,
      t,
      Link,
      viewStatus,
    }
  },
})
</script>
