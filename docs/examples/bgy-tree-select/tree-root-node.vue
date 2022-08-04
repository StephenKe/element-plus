<template>
  <el-bgy-tree-select
    v-model="value1"
    :data="treeData1"
    class="m-2"
    placeholder="请选择"
    multiple
    clearable
  />
  <el-bgy-tree-select
    v-model="value2"
    :data="treeData2"
    class="m-2"
    placeholder="请选择"
    multiple
    clearable
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value1 = ref([])
const value2 = ref([])

const treeData1 = {
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

const treeData2 = [
  {
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
  },
]
</script>
