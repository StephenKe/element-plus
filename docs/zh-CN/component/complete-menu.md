---
title: CompleteMenu 左侧菜单导航
lang: zh-CN
---

# CompleteMenu 左侧菜单导航

集成了菜单分类（常用菜单，收藏菜单），菜单搜索，层级菜单的完整体菜单导航。

## 基础用法

:::demo CompleteMenu 各属性配置使用默认值

complete-menu/basic

:::

## 开启常用和收藏菜单分类

通过设置 `commonUsed`，`commonUsedData`，`collectable`，`collectedData`，启用常用和收藏菜单分类并设置初始菜单数据，并可收藏/取消收藏

:::demo

complete-menu/category

:::

## 事件监听

通过设置事件处理函数，可对用户不同的操作做出响应。

:::demo

complete-menu/events

:::

## 手动控制展开/收起

:::demo 可以通过两种方式控制展开、收起： 1.动态设置 collapse 属性。2.调用 toggleCollapse 方法。

complete-menu/control-collapse

:::

## 属性

| 属性               | 说明                                                                                         | 类型    | 可选值        | 默认值 |
| ------------------ | -------------------------------------------------------------------------------------------- | ------- | ------------- | ------ |
| data               | 层级菜单数据（详见下方 data 数据结构）                                                       | array   | —             | —      |
| collapse           | 导航菜单是否折叠                                                                             | boolean | true/false    | false  |
| collectable        | 菜单是否可收藏                                                                               | boolean | true/false    | false  |
| collectedData      | 已收藏的菜单数据（末级菜单，数据结构同 data，但不包含子菜单），仅 collectable 为 true 时可用 | array   | —             | —      |
| commonUsed         | 是否开启常用分类                                                                             | boolean | true/false    | false  |
| commonUsedData     | 常用的菜单数据（末级菜单，数据结构同 data，但不包含子菜单），仅 commonUsed 为 true 时可用    | array   | —             | —      |
| backgroundColor    | 菜单的背景色（仅支持 hex 格式），现仅能设置层级菜单部分背景                                  | string  | —             | —      |
| textColor          | 菜单的文字颜色（仅支持 hex 格式），现仅能设置层级菜单部分文字颜色                            | string  | —             | —      |
| activeTextColor    | 当前激活菜单的文字颜色（仅支持 hex 格式）                                                    | string  | —             | —      |
| defaultActive      | 默认激活菜单的 index                                                                         | string  | —             | —      |
| defaultOpeneds     | 默认打开的 sub-menu 的 index 的数组                                                          | array   | —             | —      |
| uniqueOpened       | 是否只保持一个子菜单的展开                                                                   | boolean | true/false    | —      |
| router             | 是否启用 vue-router 模式。 启用该模式会在激活导航时以 index 作为 path 进行路由跳转           | boolean | true/false    | —      |
| collapseTransition | 是否开启折叠动画                                                                             | boolean | true/false    | true   |
| menu-trigger       | 三级菜单弹窗触发方式                                                                         | string  | hover / click | click  |

## data 数据结构

| 属性        | 说明               | 类型                 |
| ----------- | ------------------ | -------------------- |
| index       | （必须）唯一标志   | string               |
| label       | （必须）菜单描述   | string               |
| icon        | （可选）菜单图标   | @icons-vue component |
| isCollected | （可选）是否已收藏 | boolean              |
| children    | （可选）子菜单     | array                |

## 方法

| 方法名         | 说明                      | 回调参数                        |
| -------------- | ------------------------- | ------------------------------- |
| toggleCollapse | 切换左侧导航展开/收起状态 | (status) true(收起)/false(展开) |

## 事件

| 事件名         | 说明                     | 回调参数                                                                                    |
| -------------- | ------------------------ | ------------------------------------------------------------------------------------------- |
| open           | sub-menu 展开事件        | (index: string, indexPath: string[])                                                        |
| close          | sub-menu 关闭事件        | (index: string, indexPath: string[])                                                        |
| select         | 选中菜单                 | (index: string, indexPath: string[], item: CompleteMenuItemClicked, routerResult?: Promise) |
| collect        | 收藏菜单                 | (item: CompleteMenuDataItem, menuData: Array)                                               |
| collapseChange | 导航菜单收起状态变更事件 | (collapseFlag: boolean) ，collapseFlag 为 true 时表示收起                                   |
