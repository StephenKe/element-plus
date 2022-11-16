<template>
  <el-toolbar
    class="basic-toolbar"
    title="一体化平台"
    :question-page-url="state.questionPage"
    :avatar-opt-list="state.avatarOptList"
    @exit="handleExit"
    @show-message="handleShowMessage"
    @question-click="handleQuestionClick"
  />
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import type { AvatarOptItem, QuestionPage } from 'element-plus'

interface State {
  questionPage: QuestionPage
  avatarOptList: AvatarOptItem[]
}

const router = useRouter()
// 页面属性收到 state 中
const state = reactive<State>({
  questionPage: [
    { text: '在线客服', path: '/service/online' },
    { text: '常见问题', path: '/service/qa' },
    { text: '帮助', divided: true, path: 'https://www.baidu.com' },
    { text: '智能问答', divided: true, disabled: true },
  ],
  avatarOptList: [{ text: '退出', event: 'exit' }],
})

const handleExit = () => {
  ElMessage.info('退出')
}

const handleShowMessage = () => {
  ElMessage.info('点击了消息')
}

const handleQuestionClick = (item) => {
  if (item.path && item.path.startsWith('http')) {
    window.location.href = item.path
  } else {
    router.push(item.path)
  }
}
</script>
