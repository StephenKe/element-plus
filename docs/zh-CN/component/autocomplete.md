---
title: 自动补全输入框
lang: zh-CN
---

## 自动补全输入框

根据输入内容提供对应的输入建议

:::demo Autodcomplete 组件提供输入建议。 `fetch-suggestions` 属性是返回建议输入的方法。 在此示例中， `querySearch(queryString, cb)` 返回建议通过 `cb(data)` 自动完成建议。

autocomplete/autocomplete

:::

## 自定义模板

自定义如何显示输入建议。

:::demo 使用 `scoped slot` 自定义输入建议。 在这个范围中，你可以使用 `item` 键来访问当前输入建议对象。

autocomplete/autocomplete-template

:::

## 远程搜索

从服务端搜索数据

:::demo

autocomplete/remote-search

:::

## Autocomplete 属性

| 参数属性                          | 详情                                                                                         | 类型                            | 可选值                                                         | 默认值       |
| --------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------- | -------------------------------------------------------------- | ------------ |
| placeholder                       | 占位文本                                                                                     | string                          | —                                                              | —            |
| clearable                         | 是否可清空                                                                                   | boolean                         | —                                                              | false        |
| disabled                          | 是否禁用                                                                                     | boolean                         | —                                                              | false        |
| value-key                         | 输入建议对象中用于显示的键名                                                                 | string                          | —                                                              | value        |
| icon                              | 图标组件                                                                                     | string / Component              | —                                                              | —            |
| model-value / v-model             | 选中项绑定值                                                                                 | string                          | —                                                              | —            |
| debounce                          | 获取输入建议的防抖延时                                                                       | number                          | —                                                              | 300          |
| placement                         | 菜单弹出位置                                                                                 | string                          | top / top-start / top-end / bottom / bottom-start / bottom-end | bottom-start |
| fetch-suggestions                 | 获取输入建议的方法， 仅当你的输入建议数据 resolve 时，通过调用 `callback(data:[]) ` 来返回它 | Function(queryString, callback) | —                                                              | —            |
| popper-class                      | 下拉列表的类名                                                                               | string                          | —                                                              | —            |
| trigger-on-focus                  | 是否在输入框 focus 时显示建议列表                                                            | boolean                         | —                                                              | true         |
| name                              | 等价于原生 input `name` 属性                                                                 | string                          | —                                                              | —            |
| select-when-unmatched             | 在输入没有任何匹配建议的情况下，按下回车是否触发 `select` 事件                               | boolean                         | —                                                              | false        |
| label                             | 标签文本                                                                                     | string                          | —                                                              | —            |
| prefix-icon                       | 输入框头部图标                                                                               | string / Component              | —                                                              | —            |
| suffix-icon                       | 输入框尾部图标                                                                               | string / Component              | —                                                              | —            |
| hide-loading                      | 是否隐藏远程加载时的加载图标                                                                 | boolean                         | —                                                              | false        |
| popper-append-to-body(deprecated) | 是否将下拉列表插入至 body 元素。 在下拉列表的定位出现问题时，可将该属性设置为 false          | boolean                         | —                                                              | false        |
| teleported                        | 是否将下拉列表插入至 body 元素                                                               | boolean                         | true / false                                                   | true         |
| highlight-first-item              | 是否默认突出显示远程搜索建议中的第一项                                                       | boolean                         | —                                                              | false        |
| fit-input-width                   | 下拉框是否与输入框同宽                                                                       | boolean                         | —                                                              | false        |

## Autocomplete 插槽

| 插槽名  | 详情                                               |
| ------- | -------------------------------------------------- |
| —       | 自定义输入建议的内容。 自定义标签，参数为 { item } |
| prefix  | 输入框占位文本                                     |
| suffix  | 输入框尾部内容                                     |
| prepend | 输入框前置内容                                     |
| append  | 输入框后置内容                                     |

## Autocomplete 事件

| 事件名 | 描述说明              | 参数                      |
| ------ | --------------------- | ------------------------- |
| select | 点击选中建议项时触发  | 选中的建议项              |
| change | 在 Input 值改变时触发 | (value: string \| number) |

## Autocomplete 方法

| 方法  | 详情              | 参数 |
| ----- | ----------------- | ---- |
| focus | 使 input 获取焦点 | —    |
| blur  | 使 input 失去焦点 | —    |
