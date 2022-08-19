<template>
  <div
    ref="treeSelectWrapper"
    v-click-outside:[popperPaneRef]="handleClose"
    :class="wrapperKls"
    @click.stop="toggleMenu"
  >
    <el-tooltip
      ref="tooltipRef"
      v-model:visible="dropMenuVisible"
      placement="bottom-start"
      :append-to-body="popperAppendToBody"
      :popper-class="`el-bgy-tree-select__popper ${popperClass}`"
      :fallback-placements="['bottom-start', 'top-start', 'right', 'left']"
      effect="light"
      pure
      trigger="click"
      :disabled="selectDisabled"
      transition="el-zoom-in-top"
      :gpu-acceleration="false"
      persistent
      @show="handleMenuEnter"
    >
      <template #default>
        <div class="select-trigger">
          <!-- 多选 -->
          <div
            v-if="multiple"
            ref="tags"
            class="el-bgy-tree-select__tags"
            :style="selectTagsStyle"
          >
            <span v-if="collapseTags && selected.length">
              <el-tag
                :closable="!selectDisabled && !selected[0].isDisabled"
                :size="collapseTagSize"
                :hit="selected[0].hitState"
                :type="tagType"
                disable-transitions
                @close="deleteTag($event, selected[0])"
              >
                <span
                  class="el-bgy-tree-select__tags-text"
                  :style="{ maxWidth: inputWidth - 123 + 'px' }"
                  >{{ selected[0].currentLabel }}</span
                >
              </el-tag>
              <el-tag
                v-if="selected.length > 1"
                :closable="false"
                :size="collapseTagSize"
                :type="tagType"
                disable-transitions
              >
                <span class="el-bgy-tree-select__tags-text"
                  >+ {{ selected.length - 1 }}</span
                >
              </el-tag>
            </span>
            <!-- <div> -->
            <transition v-if="!collapseTags" @after-leave="resetInputHeight">
              <span
                :style="{
                  marginLeft:
                    prefixWidth && selected.length ? `${prefixWidth}px` : null,
                }"
              >
                <el-tag
                  v-for="item in selected"
                  :key="getNodeKey(item)"
                  :closable="!selectDisabled && !item.isDisabled"
                  :size="collapseTagSize"
                  :hit="item.hitState"
                  :type="tagType"
                  disable-transitions
                  @close="deleteTag($event, item)"
                >
                  <span
                    class="el-bgy-tree-select__tags-text"
                    :style="{ maxWidth: inputWidth - 75 + 'px' }"
                    >{{ item.currentLabel }}</span
                  >
                </el-tag>
              </span>
            </transition>
            <!-- 筛选 -->
            <input
              v-if="filterable"
              ref="input"
              v-model="query"
              type="text"
              class="el-bgy-tree-select__input"
              :class="[selectSize ? `is-${selectSize}` : '']"
              :disabled="selectDisabled"
              :autocomplete="autocomplete"
              :style="{
                marginLeft:
                  (prefixWidth && !selected.length) || tagInMultiLine
                    ? `${prefixWidth}px`
                    : null,
                flexGrow: '1',
                width: `${(inputLength / (inputWidth - 32)) * 100}%`,
                maxWidth: `${inputWidth - 42}px`,
              }"
              @focus="handleFocus"
              @blur="handleBlur"
              @keyup="managePlaceholder"
              @keydown="resetInputState"
              @keydown.down.prevent="navigateOptions('next')"
              @keydown.up.prevent="navigateOptions('prev')"
              @keydown.esc.stop.prevent="visible = false"
              @keydown.delete="deletePrevTag"
              @keydown.tab="visible = false"
              @compositionstart="handleComposition"
              @compositionupdate="handleComposition"
              @compositionend="handleComposition"
              @input="debouncedQueryChange"
            />
          </div>
          <el-input
            :id="id"
            ref="reference"
            v-model="selectedLabel"
            type="text"
            :placeholder="currentPlaceholder"
            :name="name"
            :size="selectSize"
            :disabled="selectDisabled"
            :readonly="readonly"
            :validate-event="false"
            :class="{ 'is-focus': visible }"
            :tabindex="multiple && filterable ? -1 : undefined"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="debouncedOnInputChange"
            @paste="debouncedOnInputChange"
            @compositionstart="handleComposition"
            @compositionupdate="handleComposition"
            @compositionend="handleComposition"
            @keydown.down.stop.prevent="navigateOptions('next')"
            @keydown.up.stop.prevent="navigateOptions('prev')"
            @keydown.esc.stop.prevent="visible = false"
            @keydown.tab="visible = false"
            @mouseenter="inputHovering = true"
            @mouseleave="inputHovering = false"
          >
            <template v-if="$slots.prefix" #prefix>
              <div
                style="
                  height: 100%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <slot name="prefix"></slot>
              </div>
            </template>
            <template #suffix>
              <el-icon
                v-if="iconComponent"
                v-show="!showClose"
                :class="[
                  'el-bgy-tree-select__caret',
                  'el-input__icon',
                  iconReverse,
                ]"
              >
                <component :is="iconComponent" />
              </el-icon>
              <el-icon
                v-if="showClose && clearIcon"
                class="el-bgy-tree-select__caret el-input__icon"
                @click="handleClearClick"
              >
                <component :is="clearIcon" />
              </el-icon>
            </template>
          </el-input>
        </div>
      </template>
      <template #content>
        <el-tree-select-menu>
          <!-- 仅在数据存在是显示 tree，不使用 tree 的默认空数据样式 -->
          <el-scrollbar
            v-show="!isEmpty(data) && !loading"
            ref="scrollbar"
            tag="ul"
            wrap-class="el-bgy-tree-select-dropdown__wrap"
            view-class="el-bgy-tree-select-dropdown__list"
            :class="{
              'is-empty': query && filteredOptionsCount === 0,
            }"
          >
            <div v-if="!isArray(data)" class="tree-header">
              {{ data[treeLabelProp] }}
            </div>
            <el-bgy-tree
              ref="treeRef"
              :data="isArray(data) ? data : data[treeChildrenProp]"
              :node-key="nodeKey"
              :props="props"
              :render-after-expand="renderAfterExpand"
              :load="load"
              :render-content="renderContent"
              :highlight-current="highlightCurrent"
              :default-expand-all="defaultExpandAll"
              :expand-on-click-node="expandOnClickNode"
              :check-on-click-node="checkOnClickNode"
              :auto-expand-parent="autoExpandParent"
              :default-expanded-keys="defaultExpandedKeys"
              :show-checkbox="multiple"
              :check-strictly="checkStrictly"
              :default-checked-keys="defaultCheckedKeys"
              :current-node-key="currentNodeKey"
              :filter-node-method="filterNodeMethod"
              :accordion="accordion"
              :indent="indent"
              :icon="icon"
              :lazy="lazy"
              :draggable="draggable"
              :allow-drag="allowDrag"
              :allow-drop="allowDrop"
              @node-click="handleNodeClick"
              @node-contextmenu="handleNodeContextMenu"
              @check-change="handleCheckChange"
              @check="handleCheck"
              @current-change="handleCurrentChange"
              @node-expand="handleNodeExpand"
              @node-collapse="handleNodeCollapse"
              @node-drag-start="handleNodeDragStart"
              @node-drag-enter="handleNodeDragEnter"
              @node-drag-leave="handleNodeDragLeave"
              @node-drag-over="handleNodeDragOver"
              @node-drag-end="handleNodeDragEnd"
              @node-drop="handleNodeDrop"
            >
              <template v-if="$slots.treeNode" #default="{ node, data }">
                <slot name="treeNode" :node="node" :data="data"></slot>
              </template>
            </el-bgy-tree>
          </el-scrollbar>
          <!-- 空数据样式 -->
          <template v-if="emptyText && (isEmpty(data) || loading)">
            <slot v-if="$slots.empty" name="empty"></slot>
            <p v-else class="el-bgy-tree-select-dropdown__empty">
              {{ emptyText }}
            </p>
          </template>
        </el-tree-select-menu>
      </template>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
//@ts-nocheck
import {
  toRefs,
  defineComponent,
  onMounted,
  onBeforeUnmount,
  nextTick,
  reactive,
  provide,
  computed,
  unref,
} from 'vue'
import { ClickOutside } from '@element-plus/directives'
import { useLocale, useFocus } from '@element-plus/hooks'
import ElInput from '@element-plus/components/input'
import ElTooltip from '@element-plus/components/tooltip'
import ElScrollbar from '@element-plus/components/scrollbar'
import ElTag from '@element-plus/components/tag'
import ElIcon from '@element-plus/components/icon'
import ElBgyTree from '@element-plus/components/bgy-tree'
import {
  isEmpty,
  isArray,
  addResizeListener,
  removeResizeListener,
  debugWarn,
} from '@element-plus/utils'
import { UPDATE_MODEL_EVENT } from '@element-plus/constants'
import ElTreeSelectMenu from './tree-select-dropdown.vue'
import { useSelect, useSelectStates } from './useSelect'
import { selectKey } from './token'

import { treeSelectProps, treeSelectEmits } from './tree-select'
import type { TreeKey } from '@element-plus/components/tree/src/tree.type'
import type { SelectContext } from './token'

const COMPONENT_NAME = 'ElBgyTreeSelect'
const BgyTreeSelect: any = defineComponent({
  name: COMPONENT_NAME,
  directives: { ClickOutside },
  components: {
    ElInput,
    ElTooltip,
    ElScrollbar,
    ElTag,
    ElIcon,
    ElTreeSelectMenu,
    ElBgyTree,
  },
  props: treeSelectProps,
  emits: treeSelectEmits,
  setup(props, ctx) {
    if (props.defaultCheckedKeys && props.defaultCheckedKeys.length) {
      debugWarn(
        COMPONENT_NAME,
        `default-checked-keys 属性已弃用，请使用 v-model 设置默认值`
      )
    }
    const { t } = useLocale()
    const states = useSelectStates(props)
    const {
      input,
      debouncedQueryChange,
      optionsArray,
      selectSize,
      readonly,
      handleResize,
      collapseTagSize,
      debouncedOnInputChange,
      deleteTag,
      deletePrevTag,
      resetInputState,
      managePlaceholder,
      setSelected,
      resetInputHeight,
      showClose,
      selectDisabled,
      iconComponent,
      iconReverse,
      emptyText,
      handleComposition,
      handleMenuEnter,
      handleFocus,
      blur,
      handleBlur,
      handleClearClick,
      handleClose,
      toggleMenu,
      getNodeKey,
      getSelectedNodes,
      navigateOptions,
      dropMenuVisible,
      treeLabelProp,
      treeChildrenProp,

      reference,
      tooltipRef,
      tags,
      treeSelectWrapper,
      treeRef,
      scrollbar,
      queryChange,
      defaultCheckedKeys,
      filterNodeMethod,
      handleNodeClick,
      handleNodeContextMenu,
      handleCheckChange,
      handleCheck,
      handleCurrentChange,
      handleNodeExpand,
      handleNodeCollapse,
      handleNodeDragStart,
      handleNodeDragEnter,
      handleNodeDragLeave,
      handleNodeDragOver,
      handleNodeDragEnd,
      handleNodeDrop,
    } = useSelect(props, states, ctx)

    const {
      inputWidth,
      selected,
      filteredOptionsCount,
      visible,
      selectedLabel,
      hoverIndex,
      query,
      inputHovering,
      currentPlaceholder,
      options,
      cachedOptions,
      optionsCount,
      prefixWidth,
      tagInMultiLine,
      inputLength,
    } = toRefs(states)

    const { focus } = useFocus(reference)

    const popperPaneRef = computed(() => {
      return tooltipRef.value?.popperRef?.contentRef
    })

    const wrapperKls = computed(() => {
      const classList = ['el-bgy-tree-select']
      const _selectSize = unref(selectSize)
      if (_selectSize) {
        classList.push(`el-bgy-tree-select--${_selectSize}`)
      }
      return classList
    })

    // 选中tags样式
    const selectTagsStyle = computed(() => ({
      maxWidth: `${unref(inputWidth) - 32}px`,
      width: '100%',
    }))

    onMounted(() => {
      states.cachedPlaceHolder = currentPlaceholder.value =
        props.placeholder || t('el.select.placeholder')
      if (
        props.multiple &&
        Array.isArray(props.modelValue) &&
        props.modelValue.length > 0
      ) {
        currentPlaceholder.value = ''
      }
      addResizeListener(treeSelectWrapper.value, handleResize)
      if (reference.value && reference.value.$el) {
        const sizeMap = {
          large: 36,
          default: 32,
          small: 28,
        }
        const input = reference.value.input as HTMLInputElement
        states.initialInputHeight =
          input.getBoundingClientRect().height || sizeMap[selectSize.value]
      }

      nextTick(() => {
        const refEl = reference.value && reference.value.$el
        if (!refEl) return
        inputWidth.value = refEl.getBoundingClientRect().width
        if (ctx.slots.prefix) {
          const prefix = refEl.querySelector('.el-input__prefix')
          prefixWidth.value = Math.max(
            prefix.getBoundingClientRect().width + 5,
            30
          )
        }
        setSelected()
      })
    })

    onBeforeUnmount(() => {
      removeResizeListener(treeSelectWrapper.value, handleResize)
    })

    // 设置选中的Keys
    const setCheckedKeys = (keys: TreeKey[], leafOnly: boolean) => {
      if (!props.multiple) return false
      treeRef.value?.setCheckedKeys(keys, leafOnly)
      // 更新 modelValue
      const selectedNodes = getSelectedNodes()
      const value = selectedNodes.map((node) => node[props.nodeKey])
      ctx.emit(UPDATE_MODEL_EVENT, value)
    }

    provide(
      selectKey,
      reactive({
        props,
        options,
        optionsArray,
        cachedOptions,
        optionsCount,
        filteredOptionsCount,
        hoverIndex,
        treeSelectWrapper,
        selected,
        setSelected,
        queryChange,
      }) as unknown as SelectContext
    )

    return {
      input,
      handleClose,
      toggleMenu,
      dropMenuVisible,
      selectDisabled,
      deleteTag,
      deletePrevTag,
      resetInputState,
      managePlaceholder,
      selectSize,
      readonly,
      handleFocus,
      blur,
      focus,
      handleBlur,
      debouncedOnInputChange,
      handleComposition,
      navigateOptions,
      handleClearClick,
      handleMenuEnter,
      showClose,
      iconReverse,
      iconComponent,
      collapseTagSize,
      selectTagsStyle,
      inputWidth,
      tagInMultiLine,
      inputLength,
      selected,
      selectedLabel,
      currentPlaceholder,
      visible,
      inputHovering,
      wrapperKls,
      popperPaneRef, //  tooltip content ref
      query,
      filteredOptionsCount,
      emptyText,
      treeSelectWrapper,
      getNodeKey,
      tooltipRef, // tooptip ref
      scrollbar,
      resetInputHeight,
      prefixWidth,
      reference, // input ref
      tags, // 多选时标签容器ref
      treeRef,
      filterNodeMethod,
      handleNodeClick,
      handleNodeContextMenu,
      handleCheckChange,
      handleCheck,
      handleCurrentChange,
      handleNodeExpand,
      handleNodeCollapse,
      handleNodeDragStart,
      handleNodeDragEnter,
      handleNodeDragLeave,
      handleNodeDragOver,
      handleNodeDragEnd,
      handleNodeDrop,
      isEmpty,
      isArray,
      treeLabelProp,
      treeChildrenProp,
      defaultCheckedKeys,
      setCheckedKeys,
      debouncedQueryChange,
    }
  },
})

export default BgyTreeSelect
</script>
