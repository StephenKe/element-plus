<template>
  <el-bgy-tree-select
    v-model="value"
    :data="treeData"
    multiple
    placeholder="请选择"
    :props="treeProps"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref([])

const treeProps = {
  label: 'text',
  children: 'items',
  disabled: 'disabled',
}

const treeData = {
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
}
</script>
