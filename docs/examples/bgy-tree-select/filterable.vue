<template>
  默认筛选：
  <el-bgy-tree-select
    v-model="value"
    :data="data"
    placeholder="请选择"
    filterable
  />
  <el-divider />
  filter-method：
  <el-bgy-tree-select
    v-model="value"
    :data="data"
    placeholder="请选择"
    :filter-method="filterMethod"
    filterable
  />
  <el-divider />
  filter-node-method：
  <el-bgy-tree-select
    v-model="value"
    :data="data"
    placeholder="请选择"
    :filter-node-method="filterNodeMethod"
    filterable
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')

const treeData = [
  {
    id: '1',
    label: 'Level one 1',
    children: [
      {
        id: '1-1',
        label: 'Level two 1-1',
        children: [
          {
            id: '1-1-1',
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    label: 'Level one 2',
    children: [
      {
        id: '2-1',
        label: 'Level two 2-1',
        children: [
          {
            id: '2-1-1',
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        id: '2-2',
        label: 'Level two 2-2',
        children: [
          {
            id: '2-2-1',
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    id: '3',
    label: 'Level one 3',
    children: [
      {
        id: '3-1',
        label: 'Level two 3-1',
        children: [
          {
            id: '3-1-1',
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        id: '3-2',
        label: 'Level two 3-2',
        children: [
          {
            id: '3-2-1',
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]

const data = ref(treeData)

const filterMethod = (value) => {
  data.value = [...treeData].filter((item) => item.label.includes(value))
}

const filterNodeMethod = (value, data) => data.label.includes(value)
</script>
