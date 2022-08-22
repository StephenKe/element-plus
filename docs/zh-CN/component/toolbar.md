---
title: Toolbar 顶部工具栏
lang: zh-CN
---

# Toolbar 顶部工具栏

集成顶部工具栏常用内容，包括 logo ，系统描述，我要提问，消息提示及个人信息（修改密码，注销）。

## 基础用法

顶部工具栏默认固定在页面顶部。

:::demo

toolbar/basic

:::

## 相关事件的使用

通过设置事件处理函数，可对用户不同的操作做出响应。

:::demo

toolbar/events

:::

## 自定义插槽和自定义头像下拉列表

通过设置事件处理函数，可对用户不同的操作做出响应。

:::demo

toolbar/custom

:::

## 属性

| 属性            | 说明                                  | 类型   | 可选值 | 默认值                                                                                                          |
| --------------- | ------------------------------------- | ------ | ------ | --------------------------------------------------------------------------------------------------------------- |
| logoSrc         | logo 图片地址（为保持统一不建议修改） | string | —      | —                                                                                                               |
| title           | 系统标题                              | string | —      | 一体化平台                                                                                                      |
| questionPageUrl | 我要提问系统地址 URL                  | string | —      | —                                                                                                               |
| msgNum          | 消息数量                              | number | —      | 0                                                                                                               |
| avatarUrl       | 头像 URL                              | string | —      | https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png                                             |
| avatarOptList   | 头像下拉框选项                        | array  | -      | [{ key: 'changePwd', text: '修改密码', event: 'changePwd', }, { key: 'logout', text: '注销', event: 'logout' }] |

## 事件

| 事件名      | 说明                 | 回调参数 |
| ----------- | -------------------- | -------- |
| showMessage | 点击消息图标事件     | —        |
| changePwd   | 修改密码按钮点击事件 | —        |
| logout      | 注销按钮点击事件     | —        |

## 插槽

| 名称 | 说明           |
| ---- | -------------- |
| —    | 自定义默认内容 |
