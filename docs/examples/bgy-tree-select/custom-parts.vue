<template>
  <el-bgy-tree-select
    v-model="value1"
    class="m-2"
    :data="treeData"
    placeholder="请选择"
  >
    <template #prefix>
      <el-icon><office-building /></el-icon>
    </template>
  </el-bgy-tree-select>

  <el-bgy-tree-select
    v-model="value2"
    class="m-2"
    :data="treeData2"
    placeholder="请选择"
  >
    <template #empty>
      <div class="empty-parts">空空如也!!!</div>
    </template>
  </el-bgy-tree-select>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { OfficeBuilding } from '@element-plus/icons-vue'

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

const treeData2 = {}
</script>

<style>
.empty-parts {
  color: red;
  font-size: 16px;
  height: 40px;
  text-align: center;
  vertical-align: middle;
  background: deepskyblue;
  line-height: 40px;
}
</style>
