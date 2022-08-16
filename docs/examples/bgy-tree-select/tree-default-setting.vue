<template>
  <el-bgy-tree-select
    v-model="value"
    class="m-2"
    :data="treeData"
    :default-expanded-keys="['1']"
    multiple
    placeholder="请选择"
  />
  <el-bgy-tree-select
    ref="treeSelect2"
    v-model="value2"
    class="m-2"
    :data="treeData2"
    :default-expanded-keys="['1']"
    multiple
    placeholder="请选择"
  />
  <el-button @click="handleClick">全选</el-button>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const treeSelect2 = ref(null)

const value = ref(['1.1', '2.2'])

const value2 = ref(['1.1'])

watch(value2, (newValue) => {
  console.log('value2', newValue)
})

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

const treeData2 = [
  {
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
  },
]

const handleClick = () => {
  treeSelect2.value.setCheckedKeys(['root'])
}
</script>
