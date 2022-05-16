<template>
  <el-bgy-tree-transfer
    v-model:from_data="fromData"
    v-model:to_data="toData"
    from_title="数据源"
    to_title="接受对象"
    @addBtn="addBtn"
    @removeBtn="removeBtn"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const leftData = [
  {
    id: 154,
    pid: 0,
    label: '系统管理',
    children: [
      {
        id: 155,
        pid: 154,
        label: '游戏列表',
        children: [],
      },
      {
        id: 157,
        pid: 154,
        label: '游戏平台管理',
      },
    ],
  },
  {
    id: 256,
    pid: 0,
    label: '日志查询',
    children: [
      {
        id: 257,
        pid: 256,
        label: '普通查询',
        children: [],
      },
      {
        id: 266,
        pid: 256,
        label: 'SQL查询',
        children: [],
      },
      {
        id: 511,
        pid: 256,
        label: '客服查询',
        children: [],
      },
    ],
  },
]
const rightDate = [
  {
    id: 122,
    pid: 0,
    label: '概览',
    children: [
      {
        id: 123,
        pid: 122,
        label: '游戏概况',
        children: [],
      },
      {
        id: 124,
        pid: 122,
        label: '游戏日报',
        children: [],
      },
    ],
  },
]
const fromData = ref(leftData)
const toData = ref(rightDate)
const addBtn = (v: any) => {
  fromData.value = v
}
const removeBtn = (v: any) => {
  toData.value = v
}
</script>

<style scoped></style>
