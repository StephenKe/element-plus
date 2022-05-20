---
title: TableRender 组件
lang: zh-CN
---

# ElTableRender 组件

表格操作渲染组件，此组件支持对表格进行 增 删 改 查 的常规操作，且暴露相关的接口或插槽供使用者方便的进行自定义扩展，用户传入接口地址，请求参数，组件内部进行接口调用。

## 基础用法

:::demo 简单的 table 带分页功能。以下示例数据为 Mock 生成，均来自 [https://www.fastmock.site](https://www.fastmock.site/)

table-render/basic

:::

## 带搜索栏的使用

:::demo 添加属性 search-item 配置搜索字段

table-render/with-search

:::

## TableRender 属性

| 属性        | 说明                         | 类型   | 可选值 | 默认值 |
| ----------- | ---------------------------- | ------ | ------ | ------ |
| requests    | 请求接口相关配置             | object | -      | -      |
| searchItem  | 搜索字段，没有则不展示搜索区 | array  | -      | -      |
| tableColumn | 表格列字段，必填项           | array  | -      | -      |

## TableRender searchItem 搜索字段属性

| 属性        | 说明                       | 类型                                                                                      | 可选值 | 默认值                |
| ----------- | -------------------------- | ----------------------------------------------------------------------------------------- | ------ | --------------------- |
| prop        | 传给后端的字段名           | string                                                                                    | -      | —                     |
| type        | 表单项类型                 | text / select / switch / textarea / radio / year / month / date / dates / datetime / week | text   |
| label       | 标签名称                   | string                                                                                    | -      | -                     |
| placeholder | 输入类型的框内 plachholder | string                                                                                    | -      | 请输入/请选择 + label |

## TableRender tableColumn 搜索字段属性

| 属性     | 说明                                                           | 类型             | 可选值                                                                                                                             | 默认值 |
| -------- | -------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------ |
| slot     | 是否为插槽                                                     | string / boolean | 为 true 值时，取 prop 作为插槽名，为字符串时，则拿该值作为插槽名。内置的插槽有 link, slot: 'link' 时生效, operation 用于表示操作列 | false  |
| 其他属性 | 同 table 组件的 [table-column](./table.html#table-column-属性) | -                | -                                                                                                                                  |

## TableRender 插槽

| 插槽名      | 说明                 |
| ----------- | -------------------- |
| actionLeft  | 自定义操作栏左侧内容 |
| actionRight | 自定义操作栏右侧内容 |
| pagination  | 自定义分页器         |
