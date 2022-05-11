---
title: TreeSelect 树形选择
lang: zh-CN
---

# TreeSelect 树形选择

含有下拉菜单的树形选择器，结合了 `el-tree` 和 `el-select` 两个组件的功能。

## 基础用法

树状选择器

:::demo

tree-select/basic

:::

## 选择任意级别

当属性 `check-strictly=true` 时，任何节点都可以被选择，否则只有子节点可被选择。

:::demo

tree-select/check-strictly

:::

## 多选

通过点击或复选框选择多个选项。

:::demo

tree-select/multiple

:::

## 禁用选项

使用 disabled 字段禁用选项。

:::demo

tree-select/disabled

:::

## 可筛选

使用关键字筛选或自定义筛选方法。 `filterMethod`可以自定义数据筛选的方法， `filterNodeMethod`可以自定义节点数据筛选的方法。

:::demo

tree-select/filterable

:::

## 自定义内容

自定义树节点的内容。

:::demo

tree-select/slots

:::

## 懒加载

树节点懒加载，更加适合于数据量大的列表。

:::demo

tree-select/lazy

:::

## TreeSelect 属性

由于这个组件是`el-tree`和`el-select`的结合体，他们的原始属性未被更改，故不在此重复。请跳转查看原组件的相应文档。

| 属性                                    | 方法                          | 事件                                | 插槽                               |
| --------------------------------------- | ----------------------------- | ----------------------------------- | ---------------------------------- |
| [tree](./tree.md#attributes)            | [tree](./tree.md#method)      | [tree](./tree.md#events)            | [tree](./tree.md#slots)            |
| [select](./select.md#select-attributes) | [select](./select.md#methods) | [select](./select.md#select-events) | [select](./select.md#select-slots) |
