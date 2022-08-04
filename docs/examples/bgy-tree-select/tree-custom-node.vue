<template>
  <el-bgy-tree-select v-model="value" :data="treeData" placeholder="请选择">
    <template #treeNode="{ data }">
      <div>{{ data.parentLabel }}/{{ data.label }}</div>
    </template>
  </el-bgy-tree-select>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref([])

const treeData = {
  id: 'root',
  label: '容桂碧桂园橡树湾',
  children: [
    {
      id: '1',
      label: '朝文苑',
      parent: 'root',
      parentLabel: '橡树湾',
      children: [
        {
          id: '1.1',
          label: 'A 栋',
          parent: '1',
          parentLabel: '朝文苑',
        },
        {
          id: '1.2',
          label: 'B 栋',
          parent: '1',
          parentLabel: '朝文苑',
        },
        {
          id: '1.3',
          label: 'C 栋',
          parent: '1',
          parentLabel: '朝文苑',
        },
      ],
    },
    {
      id: '2',
      label: '凤栖苑',
      parent: 'root',
      parentLabel: '橡树湾',
      children: [
        {
          id: '2.1',
          label: 'A 栋',
          parent: '2',
          parentLabel: '凤栖苑',
        },
        {
          id: '2.2',
          label: 'B 栋',
          parent: '2',
          parentLabel: '凤栖苑',
        },
        {
          id: '2.3',
          label: 'C 栋',
          parent: '2',
          parentLabel: '凤栖苑',
        },
      ],
    },
    {
      id: '3',
      label: '花季苑',
      parent: 'root',
      parentLabel: '橡树湾',
      children: [
        {
          id: '3.1',
          label: 'A 栋',
          parent: '3',
          parentLabel: '花季苑',
        },
        {
          id: '3.2',
          label: 'B 栋',
          parent: '3',
          parentLabel: '花季苑',
        },
        {
          id: '3.3',
          label: 'C 栋',
          parent: '3',
          parentLabel: '花季苑',
        },
      ],
    },
  ],
}
</script>
