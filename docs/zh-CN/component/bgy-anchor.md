---
title: bgy-anchor 锚点
lang: zh-CN
---

# BgyAnchor 锚点

常用的锚点操作，可以通过 `BgyAnchor` 组件来实现。

## 基础用法

:::demo 你可以使用 `offset`定义具体 top 的高度。

bgy-anchor/basic

:::

## 和容器配合使用

:::demo 滚动到指定位置高亮锚点

bgy-anchor/Bcontainer

:::

## BgyAnchor 属性

| 属性         | 说明                 | 类型     | 可选值 | 默认值                  |
| ------------ | -------------------- | -------- | ------ | ----------------------- |
| offset       | 距离上边的尺寸       | number   | -      | 0                       |
| getContainer | 获取滚动部分容器 dom | function | -      | () => { return window } |

## BgyAnchorLink 锚点的链接属性

| 属性  | 说明         | 类型   | 可选值                                      | 默认值 |
| ----- | ------------ | ------ | ------------------------------------------- | ------ |
| href  | 指向的容器   | string | -                                           | —      |
| type  | 类型         | string | primary / success / warning / danger / info | info   |
| title | 锚点链接内容 |        |                                             |        |

## BgyAnchorLink 插槽

| 插槽名 | 说明           |
| ------ | -------------- |
| —      | 自定义默认内容 |
