<template>
  <el-complete-menu
    class="complete-menu-events"
    :data="dataSource"
    :collectable="true"
    :collected-data="collectedData"
    :common-used="true"
    :common-used-data="commonUsedData"
    @open="handleOpen"
    @close="handleClose"
    @select="handleSelect"
    @collect="handleCollect"
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

const handleOpen = (index: string, indexPath: string[]) => {
  console.log('open', index, indexPath)
}
const handleClose = (index: string, indexPath: string[]) => {
  console.log('close', index, indexPath)
}
const handleSelect = (index, indexPath, item, routerResult) => {
  console.log('select', index, indexPath, item, routerResult)
}
const handleCollect = (item, menuData) => {
  console.log('collect', item, menuData)
}
</script>

<style>
.complete-menu-events {
  width: 250px;
}
.complete-menu-events .el-select {
  width: auto !important;
}
</style>
