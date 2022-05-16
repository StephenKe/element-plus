---
title: bgy-tree-transfer 树形穿梭框
lang: zh-CN
---

# BgyTreeTransfer 树形穿梭框

常用的操作按钮。

## 基础用法

你可以使用 `from_title`,`to_title`来定义标题(左侧和右侧标题)。
使用 v-model:from_data,v-model:to_data 来设置(左侧的数据和右侧的数据)。

:::demo

bgy-tree-transfer/basic

:::

## 属性

| 属性       | 说明             | 类型   | 可选值 | 默认值 |
| ---------- | ---------------- | ------ | ------ | ------ |
| fromData   | 左侧的数据源     | array  | —      | —      |
| toData     | 右侧默认的数据源 | array  | —      | —      |
| from_title | 左侧标题         | string | —      | ''     |
| to_title   | 右侧标题         | string | —      | ''     |

## 事件(目前需要手动触发,左右两侧数据才会变化)

| 事件名    | 说明               | 回调参数         |
| --------- | ------------------ | ---------------- |
| addBtn    | 点击向右的按钮触发 | 返回左侧目前的值 |
| removeBtn | 点击向左的按钮出发 | 返回右侧目前的值 |
