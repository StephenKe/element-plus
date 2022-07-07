<template>
  <div class="attach-wrap">
    <div v-show="pageType !== 'view'" class="head-btn-bar">
      <el-button
        v-if="activetab === 'first'"
        :disabled="!zIsTemplate || zIsTemplate === '30'"
        type="primary"
        plain
        size="small"
        @click="handleSelectTemplate"
        >选择模板</el-button
      >
      <el-bgy-upload
        v-if="activetab === 'second'"
        ref="uploadRef"
        :disabled="zIsTemplate === '10'"
        :title="'上传'"
        :show-file-list="false"
        :action="action"
        :data="data"
        :preview-info="previewInfo"
        :request-domain="requestDomain"
        :on-change="handleUpload"
        :before-upload="handleBeforeUpload"
      >
        <el-button
          type="primary"
          :disabled="zIsTemplate === '10'"
          plain
          size="small"
          >上传
        </el-button>
      </el-bgy-upload>
    </div>
    <el-tabs v-model="activetab">
      <el-tab-pane label="标准模板" name="first">
        <el-table border :data="tableData1" style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="70"
          />
          <el-table-column prop="name" label="合同模板名称" />
          <el-table-column prop="Filename" label="文件名称" />
          <el-table-column prop="state" label="文件状态">
            <template #default="scope">
              <span
                class="state-flag"
                :class="{
                  done: scope.row.state === '10',
                  incomplete: scope.row.state === '20',
                }"
              ></span>
              {{ scope.row.state === '10' ? '已完成' : '未完成' }}
            </template>
          </el-table-column>
          <el-table-column prop="person" label="上传人" />
          <el-table-column prop="time" label="上传时间" />
          <el-table-column
            v-if="pageType !== 'view'"
            fixed="right"
            label="操作"
            width="160"
          >
            <template #default="scope">
              <el-button
                :disabled="!zIsTemplate || zIsTemplate === '30'"
                type="text"
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                :disabled="!zIsTemplate || zIsTemplate === '30'"
                type="text"
                @click="handleView(scope.$index, scope.row)"
                >浏览</el-button
              >
              <el-popconfirm
                title="删除后不可恢复，确认删除？"
                @click="handleDelete(scope.$index, scope.row)"
              >
                <template #reference>
                  <el-button
                    :disabled="!zIsTemplate || zIsTemplate === '30'"
                    type="text"
                    >删除</el-button
                  >
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="非标模板" name="second">
        <el-table
          border
          :data="noStandardData.filter((d) => d.Operation !== 'D')"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="70"
          />
          <el-table-column prop="Filename" label="文件名称" />
          <el-table-column prop="Ernam" label="上传人" />
          <el-table-column prop="Erdat" label="上传时间" />
          <el-table-column fixed="right" label="操作" width="160">
            <template #default="scope">
              <el-button
                type="text"
                :disabled="zIsTemplate === '10'"
                @click="handleDownLoad(scope.$index, scope.row)"
                >下载</el-button
              >
              <el-button
                type="text"
                :disabled="zIsTemplate === '10'"
                @click="handleView(scope.$index, scope.row)"
                >预览</el-button
              >
              <el-button
                v-if="pageType !== 'view'"
                type="text"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, inject } from 'vue'
import dayjs from 'dayjs'
import {
  ElTable,
  ElTableColumn,
  ElTabs,
  ElTabPane,
  ElPopconfirm,
  ElButton,
  ElBgyUpload,
  ElMessage,
} from '@element-plus/components'
import { removeAttachFile } from '../requests'
import { getBgyUploadConfigs } from '../utils'
import type { PropType } from 'vue'
import type {
  ContAttBSet,
  ContractEditData,
  ContractUser,
} from '../interface/contractEdit'

export default defineComponent({
  name: 'AttachmentTable',
  components: {
    ElTable,
    ElTableColumn,
    ElTabs,
    ElTabPane,
    ElPopconfirm,
    ElButton,
    ElBgyUpload,
  },
  props: {
    formData: {
      type: Object as PropType<ContractEditData>,
      required: true,
    },
    pageType: {
      type: String,
      required: true,
    },
    zIsTemplate: {
      type: String,
      required: true,
    },
  },
  emits: ['handleUploadFile'],
  setup(props: any, { emit }) {
    const uploadRef = ref<typeof ElBgyUpload | null>(null)
    const file = ref<any>({})
    const user = inject<ContractUser>('user', { name: '' })
    const env = inject<string>('env')
    const setLoading = inject<any>('setLoading')
    const activetab = ref('first')

    const tableData1 = [
      {
        name: '自动带出',
        filename: '自动带出',
        state: '10',
        person: '自动带出',
        time: '自动带出',
      },
      {
        name: '自动带出',
        filename: '自动带出',
        state: '20',
        person: '自动带出',
        time: '自动带出',
      },
    ]

    const noStandardData = ref<ContAttBSet[]>([])

    const handleSelectTemplate = () => {
      // console.log('选择模板')
    }

    // 删除文件
    const handleDelete = async (index, row) => {
      if (row.ZfileidZt) {
        setLoading(true)
        const res = await removeAttachFile(row.ZfileidZt)
        if (res.code === 0) {
          const item = noStandardData.value.splice(index, 1)[0]
          if (item.Operation !== 'C') {
            item.Operation = 'D'
            noStandardData.value.push(item)
          }
          emit('handleUploadFile', noStandardData.value)
        }
        setLoading(false)
      }
    }
    // 上传之前
    const handleBeforeUpload = (val) => {
      if (!['application/pdf'].includes(val.type)) {
        ElMessage.error('只能上传PDF格式的文件')
        return false
      }
    }
    // 上传文件
    const handleUpload = (val) => {
      if (val.status === 'success') {
        const id = val.response?.data?.id
        const newItem = {
          Operation: 'C',
          ContType: '01',
          ZfileidZt: String(id),
          Filename: val.name,
          Ernam: user.name,
          Erdat: dayjs().format('YYYY-MM-DD'),
          Zdjh: '',
          Zdjlx: '',
        }
        const newIndex = noStandardData.value.length
        noStandardData.value.splice(newIndex, 0, newItem)
        emit('handleUploadFile', [...noStandardData.value])
        ElMessage.success('上传成功')
      } else if (val.status === 'fail') {
        ElMessage.error('上传失败，请重新上传')
      }
    }

    const handleDownLoad = (index: number, row: any) => {
      const params = {
        name: row.Filename,
        response: { data: { id: row.ZfileidZt } },
      }
      uploadRef.value?.handleDownload(params)
    }
    const handleEdit = (index: number, row: any) => {
      // console.log(index, row)
    }
    const handleView = (index: number, row: any) => {
      const params = {
        name: row.Filename,
        response: { data: { id: row.ZfileidZt } },
      }
      uploadRef.value?.handlePreview(params)
    }

    onMounted(() => {
      noStandardData.value = [...(props.formData.ContAttBSet?.results || [])]
    })

    const { action, data, previewInfo, requestDomain } = getBgyUploadConfigs(
      env || '',
      user
    )

    return {
      uploadRef,
      file,
      activetab,
      tableData1,
      data,
      action,
      previewInfo,
      requestDomain,
      noStandardData,

      handleSelectTemplate,
      handleDelete,
      handleBeforeUpload,
      handleUpload,
      handleDownLoad,
      handleEdit,
      handleView,
    }
  },
})
</script>
