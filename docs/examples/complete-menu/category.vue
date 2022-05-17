<template>
  <el-complete-menu
    class="complete-menu-category"
    :data="dataSource"
    :collectable="true"
    :collected-data="collectedData"
    :common-used="true"
    :common-used-data="commonUsedData"
  />
</template>

<script lang="ts" setup>
import { Document, UserFilled } from '@element-plus/icons-vue'

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
</script>

<style>
.complete-menu-category {
  width: 250px;
}

.complete-menu-category .el-select {
  width: auto !important;
}
</style>
