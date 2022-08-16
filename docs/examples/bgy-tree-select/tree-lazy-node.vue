<template>
  <el-bgy-tree-select
    v-model="value"
    :data="treeData"
    :load="loadNode"
    lazy
    multiple
    placeholder="请选择"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref([])

const treeData = {
  id: 'root',
  label: '容桂碧桂园橡树湾',
}

const loadNode = (node, resolve) => {
  if (node.level === 0) {
    return resolve([
      {
        id: '1',
        label: '朝文苑',
      },
      {
        id: '2',
        label: '凤栖苑',
      },
      {
        id: '3',
        label: '花季苑',
      },
    ])
  }
  if (node.level > 1) return resolve([])

  setTimeout(() => {
    const data = [
      {
        id: '2.1',
        label: 'A 栋',
        isLeaf: true,
        disabled: true,
      },
      {
        id: '2.2',
        label: 'B 栋',
      },
      {
        id: '2.3',
        label: 'C 栋',
      },
    ]

    resolve(data)
  }, 500)
}
</script>
