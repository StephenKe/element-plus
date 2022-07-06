<template>
  <div class="el-complete-menu__top">
    <div v-show="!collapsed">
      <el-tooltip v-for="tool in toolbar" :key="tool.key" placement="top">
        <template #content>{{ tool.tip }}</template>
        <el-icon
          size="20px"
          color="#FFF"
          :class="[
            'el-complete-menu__icon',
            activeToolbar === tool.key
              ? 'el-complete-menu__icon--active'
              : 'el-complete-menu__icon--inactive',
          ]"
          @click="handleToolbarClick(tool)"
        >
          <component :is="tool.icon"></component>
        </el-icon>
      </el-tooltip>
    </div>
    <el-tooltip v-model:visible="tooltipVisible" placement="top">
      <template #content>{{ collapsed ? '展开' : '收起' }}</template>
      <el-icon
        size="20px"
        class="el-complete-menu__icon el-complete-menu__icon--collapse"
        @click="handleCollapseStatus"
        @mouseenter="tooltipVisible = true"
        @mouseleave="tooltipVisible = false"
      >
        <component :is="collapsed ? 'd-arrow-right' : 'd-arrow-left'" />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, ref, computed, markRaw, watch } from 'vue'
import type { DefineComponent } from 'vue'
import {
  Star,
  Menu,
  House,
  DArrowLeft,
  DArrowRight,
} from '@element-plus/icons-vue'
import { ElIcon, ElTooltip } from '@element-plus/components'

const ElCompleteMenuToolbar: DefineComponent = defineComponent({
  components: {
    Star,
    Menu,
    House,
    DArrowLeft,
    DArrowRight,
    ElIcon,
    ElTooltip,
  },
  props: {
    active: {
      type: String,
      default: 'home',
    },
    // 是否收起
    collapse: Boolean,
    // 是否展示常用
    commonUsed: Boolean,
    // 常用数据
    usualData: {
      type: Array,
      default: () => [],
    },
    // 是否展示收藏
    collectable: Boolean,
    // 收藏数据
    collectedData: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['toolbar-click', 'toolbar-collapse'],
  setup(props, { emit }) {
    const activeToolbar = ref(props.active)
    const collapsed = ref(props.collapse)
    const tooltipVisible = ref(false)
    const toolList = ref([
      {
        tip: '默认',
        key: 'home',
        icon: markRaw(House),
        visible: true,
      },
      {
        tip: '常用',
        key: 'common',
        icon: markRaw(Menu),
        visible: props.commonUsed,
      },
      {
        tip: '收藏',
        key: 'collect',
        icon: markRaw(Star),
        visible: props.collectable,
      },
    ])

    watch(
      () => props.collapse,
      (val, oldVal) => {
        if (val !== oldVal) {
          collapsed.value = val
        }
      }
    )

    const toolbar = computed(() =>
      toolList.value.filter(({ visible }) => visible)
    )

    const handleToolbarClick = (tool) => {
      activeToolbar.value = tool.key
      emit('toolbar-click', tool)
    }

    const handleCollapseStatus = () => {
      toggleCollapse(!collapsed.value)
    }

    // 触发菜单展开/收起
    const toggleCollapse = (status) => {
      if (collapsed.value === status) return
      collapsed.value = status
      tooltipVisible.value = false
      emit('toolbar-collapse', collapsed.value)
    }

    return {
      activeToolbar,
      collapsed,
      toolbar,
      tooltipVisible,
      handleToolbarClick,
      handleCollapseStatus,
      toggleCollapse,
    }
  },
})
export default ElCompleteMenuToolbar
</script>
