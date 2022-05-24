<template>
  <el-query-form
    ref="formRef"
    :model="model"
    :rules="rules"
    @reset="handleReset"
    @search="handleSearch"
    @validate="handleValidate"
  >
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="model.name" placeholder="请输入姓名" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="性别">
          <el-select
            v-model="model.sex"
            placeholder="请选择性别"
            style="width: 100%"
          >
            <el-option value="m" label="男" />
            <el-option value="f" label="女" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="年龄">
          <el-input v-model="model.age" placeholder="请输入年龄" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item label="住址">
          <el-tree-select
            v-model="model.addr"
            :data="treeNodeData"
            clearable
            :props="treeProps"
            style="width: 100%"
            placeholder="请选择住址"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="组织">
          <el-input v-model="model.org" placeholder="请输入组织" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="部门">
          <el-input v-model="model.dept" placeholder="请输入部门" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item label="行程轨迹">
          <el-input v-model="model.route" placeholder="请输入行程轨迹" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="健康状况">
          <el-select
            v-model="model.health"
            placeholder="请选择健康状况"
            style="width: 100%"
          >
            <el-option value="g" label="优" />
            <el-option value="n" label="良" />
            <el-option value="b" label="差" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否绿码">
          <el-radio-group v-model="model.green">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
  </el-query-form>
  <el-button type="primary" @click="handleCheck">外部校验</el-button>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'

const formRef = ref(null)
const model = ref({})
const rules = reactive({
  name: [
    {
      required: true,
      message: '必须选择姓名参数',
      trigger: 'blur',
    },
  ],
})

const handleReset = (formEl) => {
  model.value = {}
  formEl.clearValidate()
}

const handleSearch = (formEl) => {
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const handleCheck = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      alert('校验通过')
    } else {
      alert('校验失败')
    }
  })
}

const handleValidate = (
  prop: string,
  isPass: boolean,
  validateMessage: string | null
) => {
  console.log('handleValidate', prop, isPass, validateMessage)
}

const treeProps = {
  label: 'text',
  children: 'items',
}

const treeNodeData = [
  {
    id: 'root',
    text: '容桂碧桂园橡树湾',
    items: [
      {
        id: '1',
        text: '朝文苑',
        items: [
          {
            id: '1.1',
            text: 'A 栋',
          },
          {
            id: '1.2',
            text: 'B 栋',
          },
          {
            id: '1.3',
            text: 'C 栋',
          },
        ],
      },
      {
        id: '2',
        text: '凤栖苑',
        items: [
          {
            id: '2.1',
            text: 'A 栋',
          },
          {
            id: '2.2',
            text: 'B 栋',
          },
          {
            id: '2.3',
            text: 'C 栋',
          },
        ],
      },
      {
        id: '3',
        text: '花季苑',
        items: [
          {
            id: '3.1',
            text: 'A 栋',
          },
          {
            id: '3.2',
            text: 'B 栋',
          },
          {
            id: '3.3',
            text: 'C 栋',
          },
        ],
      },
    ],
  },
]
</script>
