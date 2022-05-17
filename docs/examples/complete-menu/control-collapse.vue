<template>
  <el-complete-menu
    ref="menuRef"
    class="complete-menu-basic"
    :data="dataSource"
    collectable
    :collected-data="collectedData"
    common-used
    :common-used-data="commonUsedData"
    :collapse="collapse"
  />
  <div>
    <el-button type="primary" @click="controlByProp">属性控制</el-button>
    <el-button type="primary" @click="controlByMethod(false)"
      >方法控制（开）</el-button
    >
    <el-button type="primary" @click="controlByMethod(true)"
      >方法控制（关）</el-button
    >
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Document, UserFilled } from '@element-plus/icons-vue'

const menuRef = ref(null)
const collapse = ref(false)

const dataSource = [
  {
    index: '1',
    label: '申请单据',
    icon: UserFilled,
    children: [
      {
        index: '1.1',
        label: '报销单',
        children: [
          {
            index: '1.1.1',
            label: '员工报销单',
            children: [],
          },
        ],
      },
      {
        index: '1.2',
        label: '付款单',
        children: [],
      },
    ],
  },
  {
    index: '2',
    label: '系统管理',
    icon: Document,
    children: [
      {
        index: '2.1',
        label: '菜单管理',
        children: [
          {
            index: '2.1.1',
            label: '管理菜单',
            children: [],
          },
          {
            index: '2.1.2',
            label: '首页菜单',
            children: [],
          },
        ],
      },
      {
        index: '2.2',
        label: '用户管理',
        children: [
          {
            index: '2.2.1',
            label: '内部用户',
            children: [],
          },
          {
            index: '2.2.2',
            label: '外部用户',
            children: [],
          },
        ],
      },
      {
        index: '2.3',
        label: '权限管理',
        children: [],
      },
    ],
  },
]

const commonUsedData = [
  {
    index: '1.1.1',
    label: '员工报销单',
    children: [],
  },
  {
    index: '2.3',
    label: '权限管理',
    children: [],
  },
  {
    index: '2.1.1',
    label: '管理菜单',
    children: [],
  },
]

const collectedData = [
  {
    index: '1.1.1',
    label: '员工报销单',
    children: [],
  },
  {
    index: '2.3',
    label: '权限管理',
    children: [],
  },
  {
    index: '2.1.1',
    label: '管理菜单',
    children: [],
  },
]

const controlByProp = () => {
  collapse.value = !collapse.value
}

const controlByMethod = (collapsed) => {
  menuRef.value.toggleCollapse(collapsed)
}
</script>

<style>
.complete-menu-basic {
  width: 250px;
}

.complete-menu-basic .el-select {
  width: auto !important;
}
</style>
