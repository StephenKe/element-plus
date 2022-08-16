<template>
  <el-bgy-tree-select
    v-model="value1"
    :data="treeData"
    class="m-2"
    multiple
    placeholder="请选择"
  />

  <el-bgy-tree-select
    v-model="value2"
    :data="treeData"
    multiple
    collapse-tags
    class="m-2"
    placeholder="请选择"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value1 = ref([])
const value2 = ref([])
const treeData = {
  id: 'root',
  label: '容桂碧桂园橡树湾',
  children: [
    {
      id: '1',
      label: '朝文苑',
      children: [
        {
          id: '1.1',
          label: 'A 栋',
        },
        {
          id: '1.2',
          label: 'B 栋',
        },
        {
          id: '1.3',
          label: 'C 栋',
        },
      ],
    },
    {
      id: '2',
      label: '凤栖苑',
      children: [
        {
          id: '2.1',
          label: 'A 栋',
        },
        {
          id: '2.2',
          label: 'B 栋',
        },
        {
          id: '2.3',
          label: 'C 栋',
        },
      ],
    },
    {
      id: '3',
      label: '花季苑',
      children: [
        {
          id: '3.1',
          label: 'A 栋',
        },
        {
          id: '3.2',
          label: 'B 栋',
        },
        {
          id: '3.3',
          label: 'C 栋',
        },
      ],
    },
  ],
}
</script>
