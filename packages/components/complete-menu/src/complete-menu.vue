<template>
  <div
    :class="[
      'el-complete-menu',
      collapse ? 'el-complete-menu--collapse' : 'el-complete-menu--expand',
    ]"
    :style="{ 'background-color': $props.backgroundColor }"
  >
    <!-- 顶部操作按钮 -->
    <complete-menu-toolbar
      ref="toolbarRef"
      :active="active"
      :collapse="collapse"
      :common-used="$props.commonUsed"
      :collectable="$props.collectable"
      @toolbar-click="handleToolbarClick"
      @toolbar-collapse="handleToolbarCollapse"
    />

    <!-- 中间搜索框 -->
    <div
      v-show="!collapse && active !== 'collect'"
      class="el-complete-menu__middle"
    >
      <!-- 下拉框搜索 -->
      <div
        v-show="activeFilterMode === 'select'"
        class="el-complete-menu__middle--select"
      >
        <el-select
          v-model="searchState.selectValue"
          @change="handleSelectChange"
        >
          <!-- <el-option key="" value="" label="全部"></el-option> -->
          <el-option
            v-for="menu in firstLevelMenus"
            :key="menu.index"
            :value="menu.index"
            :label="menu.label"
          ></el-option>
        </el-select>
        <el-button :icon="Search" @click="handleSwitchFilterMode"></el-button>
      </div>
      <!-- 搜索框搜索 -->
      <el-input
        v-show="activeFilterMode === 'search'"
        v-model="searchState.searchValue"
        placeholder="搜索"
        clearable
        autocomplete="on"
        :suffix-icon="Search"
        @clear="handleSearchClear"
        @change="handleSearchChange"
        @input="handleSearchInput"
      >
        <template #prepend>
          <!-- <el-button
            v-show="!searchState.selectLabel"
            @click="handleSwitchFilterMode"
          >
            全部
          </el-button> -->
          <el-button
            v-show="searchState.selectLabel"
            @click="handleSwitchFilterMode"
          >
            {{ searchState.selectLabel }}
          </el-button>
        </template>
      </el-input>
    </div>
    <!-- 菜单 -->
    <el-scrollbar class="el-complete-menu__bottom">
      <el-custom-menu
        :collapse="collapse"
        v-bind="$attrs"
        @select="handMenuSelect"
        @open="handleOpen"
        @close="handleClose"
      >
        <template v-for="first in menuData" :key="first.index">
          <!-- 有子级 -->
          <el-custom-sub-menu
            v-if="first.children?.length"
            :index="first.index"
          >
            <template #title>
              <span :style="spanPaddingStyle">
                <el-icon v-if="first.icon">
                  <component :is="first.icon" />
                </el-icon>
                <span>{{ first.label }}</span>
              </span>
            </template>
            <!-- 二级子菜单 -->
            <template v-for="sed in first.children" :key="sed.index">
              <el-custom-sub-menu
                v-if="sed.children?.length"
                :index="sed.index"
                :is-menu-popup="$props.menuTrigger === 'hover'"
                :popper-append-to-body="true"
                :menu-trigger="$props.menuTrigger"
              >
                <template #title>
                  <span :style="spanPaddingStyle">
                    <el-icon v-if="sed.icon">
                      <component :is="sed.icon" />
                    </el-icon>
                    <span>{{ sed.label }}</span>
                  </span>
                </template>
                <!-- 三级菜单 -->
                <template v-for="third in sed.children" :key="third.index">
                  <el-custom-menu-item
                    :index="third.index"
                    :tooltip="third.tooltip"
                  >
                    <template #title>
                      <span :style="spanPaddingStyle">
                        <el-icon v-if="third.icon">
                          <component :is="third.icon" />
                        </el-icon>
                        <template v-if="isMenuMatch(third.label)">
                          <span>{{ isMenuMatch(third.label)[0] }}</span>
                          <span class="is-highlight">
                            {{ searchState.searchValue }}
                          </span>
                          <span>{{ isMenuMatch(third.label)[1] }}</span>
                        </template>
                        <span v-else>{{ third.label }}</span>
                        <el-icon
                          v-if="$props.collectable"
                          size="20px"
                          :class="{
                            'el-complete-menu__icon': true,
                            'el-complete-menu__icon--collect': true,
                            'is-collect': third.isCollected,
                            'is-unCollect': !third.isCollected,
                          }"
                          @click.stop="handleCollect(third)"
                        >
                          <component
                            :is="third.isCollected ? StarFilled : Star"
                          />
                        </el-icon>
                      </span>
                    </template>
                  </el-custom-menu-item>
                </template>
              </el-custom-sub-menu>
              <el-custom-menu-item
                v-else
                :index="sed.index"
                :tooltip="sed.tooltip"
              >
                <template #title>
                  <span :style="spanPaddingStyle">
                    <el-icon v-if="sed.icon">
                      <component :is="sed.icon" />
                    </el-icon>
                    <template v-if="isMenuMatch(sed.label)">
                      <span>{{ isMenuMatch(sed.label)[0] }}</span>
                      <span class="is-highlight">
                        {{ searchState.searchValue }}
                      </span>
                      <span>{{ isMenuMatch(sed.label)[1] }}</span>
                    </template>
                    <span v-else>{{ sed.label }}</span>
                    <el-icon
                      v-if="$props.collectable"
                      size="20px"
                      :class="{
                        'el-complete-menu__icon': true,
                        'el-complete-menu__icon--collect': true,
                        'is-collect': sed.isCollected,
                        'is-unCollect': !sed.isCollected,
                      }"
                      @click.stop="handleCollect(sed)"
                    >
                      <component :is="sed.isCollected ? StarFilled : Star" />
                    </el-icon>
                  </span>
                </template>
              </el-custom-menu-item>
            </template>
          </el-custom-sub-menu>
          <!-- 无子级 -->
          <el-custom-menu-item
            v-else
            :index="first.index"
            :tooltip="first.tooltip"
          >
            <!-- 收起时仅展示 icon -->
            <el-icon v-if="collapse && first.icon">
              <component :is="first.icon" />
            </el-icon>
            <template #title>
              <!-- 收起来时才有 spanPaddingStyle -->
              <span :style="!collapse ? spanPaddingStyle : {}">
                <el-icon v-if="first.icon" style="margin-right: 3px">
                  <component :is="first.icon" />
                </el-icon>
                <span>{{ first.label }}</span>
                <!-- 只有根级才展示收藏按钮 -->
                <el-icon
                  v-if="$props.collectable"
                  size="20px"
                  :class="{
                    'el-complete-menu__icon': true,
                    'el-complete-menu__icon--collect': true,
                    'is-collect': first.isCollected,
                    'is-unCollect': !first.isCollected,
                  }"
                  @click.stop="handleCollect(first)"
                >
                  <component :is="first.isCollected ? StarFilled : Star" />
                </el-icon>
              </span>
            </template>
          </el-custom-menu-item>
        </template>
      </el-custom-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import {
  defineComponent,
  watch,
  computed,
  ref,
  reactive,
  shallowRef,
} from 'vue'
import type { DefineComponent } from 'vue'
import debounce from 'lodash/debounce'
import {
  Star,
  StarFilled,
  Search,
  ArrowDownBold,
} from '@element-plus/icons-vue'
import {
  ElIcon,
  ElSelect,
  ElButton,
  ElOption,
  ElCustomMenu,
  ElCustomMenuItemGroup,
  ElCustomMenuItem,
  ElCustomSubMenu,
  ElTooltip,
  ElInput,
  ElScrollbar,
} from '@element-plus/components'
import CompleteMenuToolbar from './complete-menu-toolbar.vue'
import { completeMenuProps, completeMenuEmits } from './complete-menu'
import type { CompleteMenuDataItem } from './complete-menu'

const ElCompleteMenu: DefineComponent = defineComponent({
  name: 'ElCompleteMenu',
  components: {
    ElIcon,
    ElSelect,
    ElOption,
    ElButton,
    ElTooltip,
    ElInput,
    Star,
    StarFilled,
    ArrowDownBold,
    ElCustomMenu,
    ElCustomMenuItemGroup,
    ElCustomMenuItem,
    ElCustomSubMenu,
    CompleteMenuToolbar,
    ElScrollbar,
  },
  props: completeMenuProps,
  emits: completeMenuEmits,
  setup(props, { emit }) {
    // 默认选择第一个菜单
    const DEFAULT_MENU_VALUE = props.data[0].index
    // 当前激活的顶部按钮
    const active = ref('home')
    // 展开/收起是否展示tooltip
    const collapseTooltipVisible = ref(false)
    const toolbarRef = ref<typeof CompleteMenuToolbar>()
    // 菜单是否折叠
    const collapse = ref(props.collapse)
    // 已收藏的菜单
    const collectedMenuData = shallowRef(
      props.collectedData.map((data) => {
        return Object.assign({}, data, { isCollected: true })
      })
    )

    // 初始化菜单数据的isCollected属性
    const initMenuIsCollected = (menuData) => {
      const result: Array<CompleteMenuDataItem> = []
      menuData.forEach((menu) => {
        if (menu.children && menu.children.length) {
          const childResult = initMenuIsCollected(menu.children)
          if (childResult && childResult.length) {
            const item = {
              ...menu,
              children: childResult,
            }
            result.push(item)
          }
        } else {
          menu.isCollected =
            collectedMenuData.value.findIndex(
              (item) => item.index === menu.index
            ) > -1
          result.push(menu)
        }
      })
      return result
    }
    // 菜单数据结构
    const menuData = shallowRef(initMenuIsCollected(props.data))
    // const menuData = initMenuIsCollected(menuData.value)
    // const computedMenuData = computed(() => initMenuIsCollected(props.data))

    // 监听菜单展开收起状态，动态变更
    watch(
      () => props.collapse,
      (value, preValue) => {
        if (value !== preValue) {
          collapse.value = value
        }
      }
    )
    // 监听菜单数据变化，更新显示
    watch(
      () => props.data,
      (value, preValue) => {
        if (value !== preValue) {
          menuData.value = initMenuIsCollected(value)
        }
      }
    )
    // 监听收藏菜单数据变化，更新显示
    watch(props.collectedData, (value) => {
      if (collectedMenuData.value.length !== value.length) {
        collectedMenuData.value = value.map((data) => {
          return Object.assign({}, data, { isCollected: true })
        })
        if (active.value === 'collect') {
          menuData.value = [...collectedMenuData.value]
        }
        if (active.value === 'home') {
          menuData.value = [
            ...initMenuIsCollected(
              props.data.filter(
                (menu) => menu.index === searchState.selectValue
              )[0].children
            ),
          ]
        }
      }
    })
    // 常用菜单
    const commonUsedMenuData = shallowRef(
      props.commonUsedData.map((data) => {
        data.isCollected =
          collectedMenuData.value.findIndex(
            (item) => item.index === data.index
          ) > -1
        return data
      })
    )
    // 当前菜单筛选模式，select or search
    const activeFilterMode = ref('select')
    // 菜单搜索绑定值
    const searchState = reactive({
      selectValue: DEFAULT_MENU_VALUE,
      searchValue: '',
      selectLabel: '',
    })
    // 菜单项 span padding 样式
    const spanPaddingStyle = {
      paddingLeft: '10px',
    }

    // 获取所有一级菜单
    const firstLevelMenus = computed(() => {
      return props.data.map((item) => {
        return {
          index: item.index,
          label: item.label,
          icon: item.icon,
        }
      })
    })

    // 监听activeFilterMode
    watch(activeFilterMode, (value) => {
      if (value === 'select') {
        searchState.searchValue = ''
      }
      selectFilterMenus(searchState.selectValue)
    })

    watch(
      () => searchState.selectValue,
      (val) => {
        if (!val) searchState.selectLabel = ''
        else
          searchState.selectLabel = firstLevelMenus.value.filter(
            (menu) => menu.index === val
          )[0]?.label
      }
    )

    /*************************** 菜单搜索 start ***************************/
    // 下拉菜单筛选函数
    const selectFilterMenus = (val?: string) => {
      if (!val) menuData.value = props.data.slice(0)
      else
        menuData.value =
          props.data.filter((menu) => menu.index === val)[0]?.children || []
    }
    selectFilterMenus(DEFAULT_MENU_VALUE)
    // 根据 value 匹配菜单数据
    const matchMenus = (value: string, menus: Array<CompleteMenuDataItem>) => {
      const result: Array<CompleteMenuDataItem> = []
      if (!menus || !menus.length) return []
      else {
        menus.forEach((menu) => {
          if (menu.children && menu.children.length) {
            const childResult = matchMenus(value, menu.children)
            if (childResult && childResult.length) {
              const item = {
                ...menu,
                children: childResult,
              }
              result.push(item)
            }
          } else {
            if (menu.label.indexOf(value) > -1) {
              result.push(menu)
            }
          }
        })
      }
      return result
    }

    // 搜索菜单筛选函数
    const searchFilterMenus = (val?: string) => {
      selectFilterMenus(searchState.selectValue)
      if (val) menuData.value = matchMenus(val, menuData.value)
    }

    // 菜单下拉筛选变更事件
    const handleSelectChange = (val) => {
      selectFilterMenus(val)
    }

    // 菜单搜索清空事件
    const handleSearchClear = () => {
      searchFilterMenus(searchState.selectValue)
    }

    // 菜单搜索事件
    const handleSearchChange = () => {
      searchFilterMenus(searchState.searchValue)
    }

    // 菜单搜索事件
    const handleSearchInput = debounce(() => {
      searchFilterMenus(searchState.searchValue)
    }, 500)

    // 切换菜单筛选模式
    const handleSwitchFilterMode = () => {
      if (activeFilterMode.value === 'select') activeFilterMode.value = 'search'
      else activeFilterMode.value = 'select'
    }

    // 判断当前菜单是否匹配搜索文本，返回匹配的前后index
    const isMenuMatch = (label) => {
      if (!searchState.searchValue) return false
      const index = label.indexOf(searchState.searchValue)
      let endIndex = 0
      const matched = index > -1
      if (matched) {
        endIndex = index + searchState.searchValue.length
      }
      return matched ? [label.slice(0, index), label.slice(endIndex)] : false
    }
    /*************************** 菜单搜索 end *****************************/

    // 菜单顶部按钮点击事件
    const handleToolbarClick = (tool) => {
      active.value = tool.key
      // 更新菜单
      switch (tool.key) {
        case 'home':
          menuData.value = [
            ...initMenuIsCollected(
              props.data.filter(
                (menu) => menu.index === searchState.selectValue
              )[0].children
            ),
          ]
          break
        case 'common':
          menuData.value = [...commonUsedMenuData.value]
          break
        case 'collect':
          menuData.value = [...collectedMenuData.value]
          break
        default:
          break
      }
    }

    // 展开/收起菜单
    const handleToolbarCollapse = (collapsed) => {
      collapse.value = collapsed
      emit('collapseChange', collapsed)
    }

    const toggleCollapse = (collapsed) => {
      toolbarRef.value!.toggleCollapse(collapsed)
    }

    // 选中菜单事件
    const handMenuSelect = (
      index: string,
      indexPath: string[],
      item: any,
      routeResult: any
    ) => {
      emit('select', index, indexPath, item, routeResult)
    }

    // sub-menu 展开的回调
    const handleOpen = (index: string, indexPath: string[]) => {
      emit('open', index, indexPath)
    }

    // sub-menu 收起的回调
    const handleClose = (index: string, indexPath: string[]) => {
      emit('close', index, indexPath)
    }

    /********************** 菜单收藏 start *************************/
    // 收藏/取消收藏
    const handleCollect = (menu) => {
      // menu.isCollected = !menu.isCollected
      // // 调整全部菜单的收藏标识
      // menuData.value = [...menuData.value]
      // if (menu.isCollected) {
      //   collectedMenuData.value.push(menu)
      // } else {
      //   const index = collectedMenuData.value.findIndex(
      //     (menuItem) => menuItem.index === menu.index
      //   )
      //   collectedMenuData.value.splice(index, 1)
      //   if (active.value === 'collect') {
      //     menuData.value = [...collectedMenuData.value]
      //   }
      // }

      // // 若该菜单在常用菜单中，调整常用菜单的收藏标识
      // if (commonUsedMenuData.value && commonUsedMenuData.value.length) {
      //   const commonIndex = commonUsedMenuData.value.findIndex(
      //     (item) => item.index === menu.index
      //   )
      //   if (commonIndex > -1)
      //     commonUsedMenuData.value[commonIndex].isCollected = menu.isCollected
      // }
      emit('collect', menu)
    }
    /********************** 菜单收藏 end ***************************/

    return {
      Search,
      StarFilled,
      Star,
      ArrowDownBold,
      toolbarRef,
      menuData,
      collectedMenuData,
      active,
      searchState,
      collapse,
      collapseTooltipVisible,
      activeFilterMode,
      firstLevelMenus,
      spanPaddingStyle,
      handleToolbarClick,
      handleSelectChange,
      handleSearchChange,
      handleSearchClear,
      handleSearchInput,
      handleSwitchFilterMode,
      handleToolbarCollapse,
      handMenuSelect,
      handleCollect,
      handleOpen,
      handleClose,
      isMenuMatch,
      toggleCollapse,
      // computedMenuData
    }
  },
})

export default ElCompleteMenu
</script>
