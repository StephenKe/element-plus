<template>
  <el-table-render :requests="requests" :table-column="tableColumn">
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
const tableColumn = [
  { prop: 'name', label: '用户姓名' },
  { prop: 'gender', label: '性别', slot: true }, // slot: true 标识为插槽，插槽名取 prop (如无特殊需求或重名情况，建议使用此方式)
  { prop: 'state', label: '状态', slot: 'userStatus' }, // slot 为字符串，则表示插槽名
  {
    prop: 'zip',
    label: '邮编',
    slot: 'link', // slot 为 link， link 为内置提供的功能，列的值展示为一个超链接样式
    onClick: ({ row }) => {
      ElMessage.info(`行数据：${JSON.stringify(row)}`)
    },
  },
]
</script>
