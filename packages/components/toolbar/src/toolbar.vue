<template>
  <div class="el-toolbar">
    <!-- 左侧login 及描述 -->
    <div class="el-toolbar__left">
      <div class="el-toolbar__left--content">
        <el-image
          :src="logoSrc"
          alt="logo"
          fit="fill"
          class="el-toolbar__logo"
          @click="logoClickHandler"
        />
        <h3 v-if="$props.title" class="el-toolbar__title">
          {{ $props.title }}
        </h3>
      </div>
      <!-- 用于延展背景 -->
      <div class="el-toolbar__left--placeholder" />
      <!-- 默认插槽 -->
      <slot />
    </div>
    <!-- 右侧按钮 -->
    <div class="el-toolbar__right">
      <!-- 我要提问区域 -->
      <template v-if="questionPageUrl">
        <el-tooltip
          v-if="typeof questionPageUrl === 'string'"
          placement="bottom"
        >
          <template #content>我要提问</template>
          <el-badge :hidden="true">
            <el-icon
              size="25px"
              color="#FFF"
              class="el-toolbar-icon"
              @click="handleHelpClick"
            >
              <QuestionFilled />
            </el-icon>
          </el-badge>
        </el-tooltip>
        <el-dropdown v-else trigger="click" @command="handleCommand">
          <div class="question-dropdown el-toolbar-icon">
            <el-icon size="24px" color="#FFF">
              <QuestionFilled />
            </el-icon>
            <el-icon size="12px" color="#FFF" class="arrow-icon">
              <ArrowDown />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in questionPageUrl"
                :key="item.url"
                :divided="item.divided"
                :disabled="item.disabled"
                :command="item"
              >
                {{ item.text }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <el-badge
        :hidden="$props.msgNum === 0"
        :value="msgNum"
        class="el-toolbar-icon"
      >
        <el-icon size="25px" color="#FFF" @click="handleMessageClick"
          ><Bell
        /></el-icon>
      </el-badge>
      <el-dropdown
        trigger="click"
        popper-class="el-toolbar-dropdown"
        @command="handleAvatarCommand"
      >
        <el-avatar
          v-if="$props.avatarUrl"
          :size="30"
          :src="avatarUrl"
          class="el-toolbar-avatar"
        />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="t in avatarOptList"
              :key="t.event"
              :command="t.event"
            >
              {{ t.text }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
import { ArrowDown, Bell, QuestionFilled } from '@element-plus/icons-vue'
import {
  ElAvatar,
  ElBadge,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElImage,
  ElTooltip,
} from '@element-plus/components'
import { toolbarProps } from './toolbar'
import type { AvatarOptItem } from './toolbar'

export default defineComponent({
  name: 'ElToolbar',
  components: {
    ElImage,
    ElIcon,
    ElBadge,
    ElAvatar,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
    ElTooltip,
    Bell,
    QuestionFilled,
    ArrowDown,
  },
  props: toolbarProps,
  emits: ['showMessage', 'logoClick', 'questionClick'],
  setup(props, { emit }) {
    // logo 点击时间
    const logoClickHandler = () => {
      emit('logoClick')
    }

    // 我要提问按钮点击事件
    const handleHelpClick = () => {
      window.open(props.questionPageUrl, '_blank')
    }

    // 消息按钮点击事件
    const handleMessageClick = (evt: MouseEvent) => {
      emit('showMessage')
    }

    const handleAvatarCommand = (command: string) => {
      emit(command)
    }

    const handleCommand = (command: any) => {
      emit('questionClick', command)
    }

    return {
      logoClickHandler,
      handleHelpClick,
      handleMessageClick,
      handleAvatarCommand,
      handleCommand,
    }
  },
})
</script>
