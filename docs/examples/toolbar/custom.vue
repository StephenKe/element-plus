<template>
  <el-toolbar
    class="basic-toolbar"
    title="一体化平台"
    :msg-num="1"
    question-page-url="https://www.baidu.com"
    :avatar-opt-list="avatarOptList"
    @change-pwd="handleChangePwd"
    @logout="handleLogout"
    @ucenter="handleUcenter"
    @show-message="handleShowMessage"
  >
    <el-menu
      class="menu"
      :default-active="activeIndex"
      mode="horizontal"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
    >
      <el-menu-item
        v-for="menu in menuList"
        :key="menu.path"
        :index="menu.path"
        >{{ menu.name }}</el-menu-item
      >
    </el-menu>
  </el-toolbar>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const avatarOptList = [
  { key: 'changePwd', text: '修改密码', event: 'changePwd' },
  { key: 'profile', text: '个人中心', event: 'ucenter' },
  { key: 'logout', text: '注销', event: 'logout' },
]

const menuList = computed(() => [
  { path: '/templateConfig', name: '权限模板配置' },
  { path: '/management', name: '权限管理后台' },
])
const activeIndex = ref(menuList.value[0].path)

const handleChangePwd = () => {
  console.log('正要修改密码...')
}

const handleLogout = () => {
  console.log('正要注销...')
}

const handleShowMessage = () => {
  console.log('正要显示消息...')
}

const handleUcenter = () => {
  console.log('去往个人中心...')
}

const handleSelect = (key: string) => {
  console.log('handleSelect', key)
}
</script>

<style>
.basic-toolbar h3 {
  margin-top: 0;
}
.menu {
  min-width: 300px;
}
</style>
