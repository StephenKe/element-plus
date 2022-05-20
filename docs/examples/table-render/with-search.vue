<!--
 * @Author: 秦真
 * @Date: 2022-04-27 17:10:55
 * @LastEditors: Do not edit
 * @LastEditTime: 2022-04-27 17:39:53
 * @Description:
 * @FilePath: \element-plus\docs\examples\table-render\with-search.vue
-->
<template>
  <el-table-render
    :requests="requests"
    :search-item="searchItem"
    :table-column="tableColumn"
  >
    <!-- 自定义插槽 -->
    <template #gender="{ row, column }">
      {{ row[column.property] === 0 ? '女' : '男' }}
    </template>
    <template #userStatus="{ row, column }">
      <el-tag>{{ row[column.property] }}</el-tag>
    </template>
  </el-table-render>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

// 和接口请求相关的配置
const requests = {
  // 分页查询接口，默认 POST 请求
  select: {
    url: 'https://www.fastmock.site/mock/035b1a049188e74772816b3e298ccf95/api/user/page',
  },
}

const searchItem = [
  {
    label: '用户ID',
    prop: 'id',
  },
  {
    label: '用户姓名',
    prop: 'name',
    placeholder: '支持模糊查询',
  },
  {
    label: '性别',
    prop: 'gender',
    type: 'select',
    options: [
      { label: '男', value: 1 },
      { label: '女', value: 0 },
    ],
  },
  {
    label: '年龄',
    prop: 'age',
  },
  {
    label: '状态',
    prop: 'state',
    type: 'select',
    options: [
      { label: '在职', value: '在职' },
      { label: '离职', value: '离职' },
      { label: '无业', value: '无业' },
    ],
  },
  {
    label: '邮编',
    prop: 'zip',
  },
]

const tableColumn = [
  { prop: 'id', label: '用户ID', width: 50, align: 'center' },
  { prop: 'name', label: '用户姓名' },
  {
    prop: 'gender',
    label: '性别',
    formatter: (_, __, ceilValue) => (ceilValue === 0 ? '女' : '男'),
  },
  { prop: 'age', label: '年龄' },
  { prop: 'state', label: '状态' },
  { prop: 'address', label: '祖籍' },
  { prop: 'zip', label: '邮编' },
]
</script>
