<template>
  <el-toolbar
    class="basic-toolbar"
    title="一体化平台"
    :msg-num="1"
    question-page-url="https://www.baidu.com"
    @change-pwd="handleChangePwd"
    @logout="handleLogout"
    @show-message="handleShowMessage"
  />
</template>

<script lang="ts" setup>
const handleChangePwd = () => {
  console.log('正要修改密码...')
}

const handleLogout = () => {
  console.log('正要注销...')
}

const handleShowMessage = () => {
  console.log('正要显示消息...')
}
</script>

<style>
.basic-toolbar h3 {
  margin-top: 0;
}
</style>
