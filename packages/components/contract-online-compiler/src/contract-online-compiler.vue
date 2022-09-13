<template>
  <div :class="ns.b()">
    <el-row :gutter="24">
      <el-col :span="leftSpan">
        <el-tabs v-model="variableTab" type="card">
          <el-tab-pane label="字段" name="first">
            <el-query-form
              :model="searchVariableForm"
              :class="ns.e('query-form')"
              label-width="80px"
              @reset="handleVariableReset"
              @search="handleVariableSearch"
            >
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="业务条线:">
                    <el-select
                      v-model="searchVariableForm.moduleFlag"
                      disabled
                      placeholder="业务条线"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="公共字段:">
                    <el-switch
                      v-model="searchVariableForm.isPublicVariableList"
                      @change="clickPublicVariable"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="字段描述:">
                    <el-input
                      v-model="searchVariableForm.fieldDesc"
                      placeholder="字段描述"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="字段名称:">
                    <el-input
                      v-model="searchVariableForm.fieldName"
                      placeholder="字段名称"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="字段所属模块:">
                    <el-select
                      v-model="searchVariableForm.fieldClassList"
                      multiple
                      clearable
                      placeholder="字段所属模块"
                    >
                      <el-option
                        v-for="item in fieldClassList"
                        :key="item.fieldClass"
                        :value="item.fieldClass"
                        :label="item.fieldClassDesc"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-query-form>
            <div :class="ns.e('save-bar')">
              <el-button type="primary" @click="handleSaveDoc"
                >保存并关闭</el-button
              >
            </div>
            <el-table
              :data="variableList"
              :class="ns.e('table')"
              style="margin-top: 12px"
              @row-click="variableListRowClick"
            >
              <el-table-column prop="variableVO.fieldDesc" label="字段描述">
              </el-table-column>
              <el-table-column prop="variableVO.fieldName" label="字段名称">
              </el-table-column>
              <el-table-column
                prop="variableVO.fieldClassDesc"
                label="字段类型"
              >
              </el-table-column>
              <el-table-column
                prop="variableVO.moduleFlagDesc"
                label="模块描述"
              >
              </el-table-column>
              <el-table-column
                align="center"
                prop="variableVO.fieldType"
                label="填充类型"
              >
                <template #default="scope">
                  {{ formatFillType(scope.row.variableVO.fieldType) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="130">
                <template #default="scope">
                  <el-button
                    v-if="searchVariableForm.isPublicVariableList"
                    size="small"
                    type="text"
                    @click="handleVariableSelect(scope.row)"
                    >选择</el-button
                  >
                  <el-popconfirm
                    v-if="!searchVariableForm.isPublicVariableList"
                    title="是否确认删除这条数据?"
                    @confirm="deleteTemplateVariable(scope.row)"
                  >
                    <template #reference>
                      <el-button size="small" type="text">删除</el-button>
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              v-model:currentPage="variableCurrentPage"
              :class="ns.e('page')"
              style="margin-top: 12px"
              :page-sizes="[5, 10, 20, 50, 100]"
              :page-size="variablePageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="variableTotal"
              @size-change="handleVariableSizeChange"
              @current-change="handleVariableCurrentChange"
            />
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="rightSpan">
        <div id="editContract"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent, reactive, ref } from 'vue'
import {
  ElRow,
  ElCol,
  ElTabs,
  ElTabPane,
  ElQueryForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElInput,
  ElSwitch,
  ElButton,
  ElTable,
  ElTableColumn,
  ElPopconfirm,
  ElPagination,
  ElMessage,
} from '@element-plus/components'
import { useNamespace } from '@element-plus/hooks'
import { contractOnlineCompilerProps } from './contract-online-compiler'
import { CxApi } from './api/office/changxie/cxApi'
import { CxUtil } from './api/office/changxie/cxUtil'
import { fileWarehouseInfo } from './api/office/warehouse/fileWarehouse'
import { ythTemplateSave } from './api/yth/ythTemplate'
import {
  getYthTemplateVariablePage,
  ythTemplateVariableSave,
  ythTemplateVariableDeleteBatch,
  fieldClassAllList,
} from './api/yth/ythTemplateVariable'
import {
  saveContentRecord,
  getContentRecordInfo,
} from './api/office/clause/contentAreaRecord'
export default defineComponent({
  name: 'ElContractOnlineCompiler',
  components: {
    ElRow,
    ElCol,
    ElTabs,
    ElTabPane,
    ElQueryForm,
    ElFormItem,
    ElSelect,
    ElOption,
    ElInput,
    ElSwitch,
    ElButton,
    ElTable,
    ElTableColumn,
    ElPopconfirm,
    ElPagination,
  },
  props: contractOnlineCompilerProps,
  emits: ['close'],
  setup(props, { emit }) {
    const ns = useNamespace('contract-online-compiler')
    const variableTab = ref('first')
    ythTemplateSave(props.urlPrefix, {
      id: props.id,
      sourceMiddlegroundId: props.fileId,
    }).then((res) => {
      ythTemplate.value = res.data
      fileWarehouseInfo(props.urlPrefix, res.data.localFileId).then((res) => {
        if (res.data.code === 'E0000') {
          ElMessage.error(res.data.msg)
          return
        }
        const config = initConfig(res.data)
        // 初始化编辑器
        editor.value = CxApi.initCustomEditor('editContract', config)
        // 获取变量列表
        getVariableDataList()
      })
    })

    const ythTemplate = ref({})
    const editor = ref()
    const onGetDocumentContentFlag = ref(0)

    // 获取文档内容事件
    function onGetDocumentContent(event) {
      const data = event.data
      // 条款定位
      if (onGetDocumentContentFlag.value === 1) {
        // 获取内容域属性触发回调
        for (let i = 0; i < data.list.length; i++) {
          const id = data.list[i].id
          // 光标定位
          CxApi.gotoxyContentArea(editor.value, id)
        }
      }
    }

    function formatFillType(fieldType) {
      if (fieldType === '10') {
        return '文本'
      } else if (fieldType === '20') {
        return '中台文件'
      } else if (fieldType === '30') {
        return '附件URL'
      } else if (fieldType === '40') {
        return '勾选'
      } else if (fieldType === 'MANUAL_VARIABLE') {
        return '手填'
      } else {
        return '未知'
      }
    }

    // 初始化配置
    const initConfig = (fileWarehouse) => {
      const config = {
        type: 'desktop',
        documentType: 'word',
        token: '',
        document: {
          title: fileWarehouse.sourceFileName,
          url: `${props.urlPrefix}/office/download/file/${ythTemplate.value.localFileId}`,
          fileType: fileWarehouse.fileTypeDesc,
          key: ythTemplate.value.localFileId,
          permissions: {
            comment: true,
            download: true,
            edit: true,
            print: true,
            review: true,
            canConfigCT: false,
          },
        },
        editorConfig: {
          mode: 'edit',
          user: {
            id: props.userInfo.id,
            name: props.userInfo.username,
          },
          customization: {
            about: true,
            chat: false,
            comments: true,
            zoom: 120,
            leftMenu: true,
            rightMenu: true,
            toolbar: true,
            displayTitle: false,
            header: true,
            statusBar: true,
            autosave: true,
            forcesave: true,
          },
          callbackUrl: `${props.urlPrefix}/office/callback/cx/yth/template?fileId=${ythTemplate.value.localFileId}&callbackUrl=${props.callbackUrl}&templateId=${ythTemplate.value.id}`,
        },
        events: {
          onGetDocumentContent,
        },
      }
      return config
    }
    const fieldClassList = ref([])
    fieldClassAllList(props.urlPrefix).then((res) => {
      fieldClassList.value = res.data
    })

    const searchVariableForm = reactive({
      isPublicVariableList: false,
      moduleFlag: props.busLine.value,
      fieldDesc: '',
      fieldName: '',
      fieldClassList: [],
      variableDTO: {},
    })
    const variableDataListLoading = ref(false)
    const variableCurrentPage = ref(1)
    const variablePageSize = ref(10)
    const variableTotal = ref(0)
    // 变量
    const variableList = ref([])

    // 获取变量数据列表
    const getVariableDataList = () => {
      variableDataListLoading.value = true
      const paramsData = {
        page: variableCurrentPage.value,
        limit: variablePageSize.value,
        templateId: ythTemplate.value.id,
        ...searchVariableForm,
        ...searchVariableForm.variableDTO,
      }

      getYthTemplateVariablePage(props.urlPrefix, paramsData)
        .then((res) => {
          variableList.value = res.data.page.list
          variableTotal.value = res.data.page.totalCount
          variableDataListLoading.value = false
        })
        .catch(() => {
          variableDataListLoading.value = false
        })
    }

    const options = ref([props.busLine])
    // 单击公共变量
    const clickPublicVariable = () => {
      variableCurrentPage.value = 1
      variablePageSize.value = 10
      // 重新加载列表
      getVariableDataList()
    }
    // 处理变量查询
    const handleVariableSearch = () => {
      variableCurrentPage.value = 1
      getVariableDataList()
    }
    const handleVariableReset = () => {
      variableCurrentPage.value = 1
      variablePageSize.value = 10
      searchVariableForm.isPublicVariableList = false
      searchVariableForm.fieldDesc = ''
      searchVariableForm.fieldName = ''
      getVariableDataList()
    }
    // 选择指定内容域并跳转到内容域所在位置-文字处理
    const contentAreaOrientation = (name, flag) => {
      onGetDocumentContentFlag.value = flag
      CxApi.getContentPropertyByName(editor.value, name)
    }
    // 点击变量行操作
    const variableListRowClick = (row) => {
      if (searchVariableForm.isPublicVariableList) {
        return
      }
      // 定位到条款内容域位置
      contentAreaOrientation(row.contentAreaId, 1)
    }
    let settingVariableForm = {
      templateId: '',
      fileId: '',
      variableId: '',
      variableDTO: {
        fieldDesc: '',
      },
      contentAreaId: '',
      styleType: '',
    }
    // 在当前光标处插入json内容
    const cursorInsertJsonToEditor = (json, contentAreaId) => {
      // 获取内容域信息
      getContentRecordInfo(props.urlPrefix, contentAreaId).then((res) => {
        const addSdt = CxUtil.buildInsertAddSdt(
          contentAreaId,
          res.data.cxContentRecord.contentAreaType
        )
        const jsonArr = [CxUtil.buildInsertObj(json, undefined, addSdt)]
        // 插入内容域
        CxApi.insertJson(editor.value, jsonArr)
      })
    }
    // 设置变量
    const handleVariableSelect = (row) => {
      let contentAreaType = 'rich'
      const type = row.variableVO.fieldType
      if (type === 'MANUAL_VARIABLE' || type === '10' || type === '40') {
        contentAreaType = 'plain'
      }
      const contentRecord = {
        fileId: ythTemplate.value.localFileId,
        contentAreaType,
      }
      // 保存内容域
      saveContentRecord(props.urlPrefix, contentRecord).then((res) => {
        const contentId = res.data.id
        settingVariableForm.templateId = ythTemplate.value.id
        settingVariableForm.fileId = ythTemplate.value.localFileId
        settingVariableForm.variableId = row.variableVO.id
        settingVariableForm.variableDTO = row.variableVO
        settingVariableForm.contentAreaId = contentId
        settingVariableForm.styleType = '0'
        const style = ''
        const fieldName = settingVariableForm.variableDTO.fieldDesc
        const json = CxUtil.buildDefaultPJson(fieldName, style)
        // 在光标处插入json
        cursorInsertJsonToEditor(json, contentId)
        // 保存变量
        const param = {
          variableText: fieldName,
          variableJson: json,
          ...settingVariableForm,
        }

        ythTemplateVariableSave(props.urlPrefix, param).then(() => {
          ElMessage.success('保存变量成功')
          // 定位到内容域位置
          contentAreaOrientation(settingVariableForm.contentAreaId, 1)
          settingVariableForm = {
            templateId: '',
            fileId: '',
            variableId: '',
            variableDTO: {
              fieldDesc: '',
            },
            contentAreaId: '',
            styleType: '',
          }
          // 强制保存文档
          CxApi.forceSave(editor.value)
          // 刷新列表
          getVariableDataList()
        })
      })
    }
    // 删除变量
    const deleteTemplateVariable = (row) => {
      ythTemplateVariableDeleteBatch(props.urlPrefix, [row.id]).then(() => {
        // 删除文档中内容域信息
        CxApi.deleteContentArea(editor.value, row.contentAreaId)
        // 刷新列表
        getVariableDataList()
        ElMessage.success('删除成功')
      })
      return true
    }

    const handleVariableSizeChange = (val) => {
      variablePageSize.value = val
      getVariableDataList()
    }

    const handleVariableCurrentChange = (val) => {
      variableCurrentPage.value = val
      getVariableDataList()
    }
    // 保存并关闭文档
    const handleSaveDoc = () => {
      // 强制保存文档
      CxApi.forceSave(editor.value)
      // 对打开的文档进行关闭摧毁
      CxApi.destroyEditor(editor.value)
      emit('close', ythTemplate.value.id)
    }

    return {
      ns,
      variableTab,
      fieldClassList,
      searchVariableForm,
      options,
      variableList,
      variableCurrentPage,
      variablePageSize,
      variableTotal,
      formatFillType,
      clickPublicVariable,
      handleVariableSearch,
      handleVariableReset,
      handleSaveDoc,
      variableListRowClick,
      handleVariableSelect,
      deleteTemplateVariable,
      handleVariableSizeChange,
      handleVariableCurrentChange,
    }
  },
})
</script>
