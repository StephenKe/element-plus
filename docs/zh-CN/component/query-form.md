---
title: QueryForm 筛选表单
lang: zh-CN
---

# QueryForm 筛选表单

Form 表单形式的，行为一致的，用法灵活的筛选条件容器组件。

## 基础用法

最基础的 QueryForm 支持各种输入表单项，比如`input`、`select`、`radio`、`checkbox`等。  
筛选参数对象完全由用户控制，组件内部不做特殊处理。  
组件暴露 reset（重置），search（查询） 事件，用户可以监听这两个事件并执行数据查询操作。

:::demo 在每一个 `query-form` 组件中，你需要一个 `form-item` 字段作为输入项的容器，用于获取值与验证值。通过 `query-form` 的 `collapse` 属性默认展开/关闭。

query-form/basic-usage

:::

## 标签对齐方式

根据需求的设计情况，来选择最佳的标签对齐方式。

:::demo 通过设置 `label-position` 属性可以改变表单域标签的位置，可选值为 `top`、`left`， 当设为 `top` 时标签会置于表单域的顶部

query-form/alignment

:::

## 表单校验

QueryForm 允许验证用户选择的条件是否符合特定规范，如某个查询条件必选等特殊情况。

:::demo `query-form` 组件提供了表单验证的功能，只需要通过 `rules` 属性传入约定的验证规则，并将 `form-Item` 的 `prop` 属性设置为该校验规则在 `rules` 中对应的字段名即可。 更多高级用法可参考 [async-validator](https://github.com/yiminghe/async-validator)。

query-form/validation

:::tip

当一个 `el-form-item` 嵌套在另一个 `el-form-item`时，其标签宽度将是 `0`。 如果需要可以为 `el-form-item` 单独设置 `label-width` 属性。

:::

## 尺寸控制

表单中的所有子组件都继承了该表单的 `size` 属性。 同样，form-item 也有一个 `size` 属性。

:::demo 如果希望某个表单项或某个表单组件的尺寸不同于 Form 上的 `size` 属性，直接为这个表单项或表单组件设置自己的 size 属性即可。

query-form/size-control

:::

## 高度计算

QueryForm 的高度判断基于 `form-item` 计算所得，包括 content，padding，border 和 margin，与 `form-item` 的容器无关。

:::demo

query-form/height-calc

:::

## QueryForm 属性

| 属性                   | 说明                                                                                                   | 类型            | 可选值                  | 默认值 |
| ---------------------- | ------------------------------------------------------------------------------------------------------ | --------------- | ----------------------- | ------ |
| model                  | 查询参数对象                                                                                           | object          | —                       | —      |
| rules                  | 表单验证规则                                                                                           | object          | —                       | —      |
| label-position         | 表单域标签的位置                                                                                       | string          | left / right / top      | right  |
| label-width            | 表单域标签的宽度，例如 '50px' 或 50。 作为 QueryForm 直接子元素的 form-item 会继承该值。 支持 `auto`。 | string / number | —                       | 100px  |
| label-suffix           | 表单域标签的后缀                                                                                       | string          | —                       | —      |
| hide-required-asterisk | 是否隐藏必填字段的标签旁边的红色星号                                                                   | boolean         | —                       | false  |
| show-message           | 是否显示校验错误信息                                                                                   | boolean         | —                       | true   |
| size                   | 用于控制该表单内组件的尺寸                                                                             | string          | large / default / small | —      |
| collapse               | 是否收起                                                                                               | boolean         | —                       | true   |
| collapse-text          | 收起按钮描述                                                                                           | string          | —                       | 收起   |
| expand-text            | 展开按钮描述                                                                                           | string          | —                       | 展开   |
| search-text            | 查询按钮描述                                                                                           | string          | —                       | 查询   |
| reset-text             | 重置按钮描述                                                                                           | string          | —                       | 重置   |

## QueryForm 方法

| 方法名        | 说明                                                                                                                                                                                      | 回调参数                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| validate      | 对整个表单作验证。 参数为一个回调函数。 验证表单后，回调函数会包含两个参数：一个布尔值，表示表单验证是否通过；一个对象，包含所有未通过验证的字段。 若不传入回调函数，则会返回一个 promise | Function(callback: Function(boolean, object))                              |
| validateField | 对部分表单字段进行校验的方法                                                                                                                                                              | Function(props: string \| array, callback: Function(errorMessage: string)) |
| resetFields   | 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果                                                                                                                                | —                                                                          |
| clearValidate | 清理指定字段的表单验证信息。 参数是一个或多个需要清除验证信息的表单属性名。 如果省略了参数，将清除所有字段的验证信息。                                                                    | Function(props: string \| array)                                           |

## QueryForm 事件

| 事件名称 | 说明                   | 回调参数                                                   |
| -------- | ---------------------- | ---------------------------------------------------------- |
| reset    | 点击重置按钮后触发     | QueryForm 的表单 element 对象                              |
| search   | 点击查询按钮后触发     | QueryForm 的表单 element 对象                              |
| validate | 任一表单项被校验后触发 | 被校验的表单项 prop 值，校验是否通过，错误消息（如果存在） |

## QueryForm 插槽

| 插槽名 | 说明                      | 子标签    |
| ------ | ------------------------- | --------- |
| —      | 存放所有的 form-item 内容 | Form-Item |

## Rules

| 属性    | 说明         | 类型   | 可选值        | 默认值 |
| ------- | ------------ | ------ | ------------- | ------ |
| trigger | 触发校验方式 | string | blur / change | —      |

## FormItem 属性

| 属性           | 说明                                                                                                     | 类型            | 可选值                            | 默认值  |
| -------------- | -------------------------------------------------------------------------------------------------------- | --------------- | --------------------------------- | ------- |
| prop           | 表单域 `model` 字段， 在使用 validate、resetFields 方法的情况下，该属性是必填的                          | string          | 传入 Form 组件的 `model` 中的字段 |         |
| label          | 标签                                                                                                     | string          | —                                 | —       |
| label-width    | 表单域标签的宽度，例如 '50px'。 支持 `auto`。                                                            | string / number | —                                 | —       |
| required       | 是否必填，如不设置，则会根据校验规则自动生成                                                             | boolean         | —                                 | false   |
| rules          | 表单验证规则, 具体配置见下表, 更多内容参考[async-validator](https://github.com/yiminghe/async-validator) | object / array  | —                                 | —       |
| error          | 表单域验证错误信息, 设置该值会使表单验证状态变为 error，并显示该错误信息                                 | string          | —                                 | —       |
| show-message   | 是否显示校验错误信息                                                                                     | boolean         | —                                 | true    |
| inline-message | 以行内形式展示校验信息                                                                                   | boolean         | —                                 | false   |
| size           | 控制组件在此表单项中的大小                                                                               | string          | large / default / small           | default |

## Form-Item 插槽

| 插槽名 | 说明                                                    |
| ------ | ------------------------------------------------------- |
| —      | Form Item 的内容                                        |
| label  | 标签上显示的自定义内容。 自定义标签，参数为 `{ label }` |
| error  | 自定义内容以显示验证消息。 参数是 `{ error } `          |

## Form-Item 方法

| 方法名        | 说明                                                 | 参数 |
| ------------- | ---------------------------------------------------- | ---- |
| resetField    | 对该表单项进行重置，将其值重置为初始值并移除校验结果 | —    |
| clearValidate | 移除该字段的验证状态                                 | —    |
