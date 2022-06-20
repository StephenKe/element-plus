---
title: Input 输入框
lang: zh-CN
---

# Input 输入框

通过鼠标或键盘输入字符

:::warning

Input 为受控组件，它 **总会显示 Vue 绑定值**。

在正常情况下，`input` 的输入事件应该被正常响应。 它的处理程序应该更新组件的绑定值 (或使用 `v-model`)。 否则，输入框的值将不会改变。

不支持 `v-model` 修饰符。

:::

## 基础用法

:::demo

input/basic

:::

## 禁用状态

:::demo 通过 `disabled` 属性指定是否禁用 input 组件

input/disabled

:::

## 一键清空

:::demo 使用`clearable`属性即可得到一个可一键清空的输入框

input/clearable

:::

## 格式化

在 `formatter`的情况下显示值，我们通常同时使用 `parser`

:::demo

input/formatter

:::

## 密码框

:::demo 使用 `show-password` 属性即可得到一个可切换显示隐藏的密码框

input/password

:::

## 带图标的输入框

带有图标标记输入类型

:::demo 要在输入框中添加图标，你可以简单地使用 `prefix-icon` 和 `suffix-icon` 属性。 另外， `prefix` 和 `suffix` 命名的插槽也能正常工作。

input/with-icon

:::

## 文本域

用于输入多行文本信息可缩放的输入框。 Resizable for entering multiple lines of text information. Add attribute `type="textarea"` to change `input` into native `textarea`.

:::demo 文本域高度可通过 `rows` 属性控制

input/textarea

:::

## 自适应文本域

设置文字输入类型的 `autosize` 属性使得根据内容自动调整的高度。 你可以给 `autosize` 提供一个包含有最大和最小高度的对象，让输入框自动调整。

:::demo

input/auto-sizing-textarea

:::

## 复合型输入框

可以在输入框中前置或后置一个元素，通常是标签或按钮。

:::demo 可通过 `slot` 来指定在 Input 中分发的前置或者后置的内容。

input/mixed-input

:::

## 尺寸

:::demo 使用 `size` 属性改变输入框大小。 除了默认大小外，还有另外两个选项： `large`, `small`。

input/various-size

:::

## Limit length

:::demo `maxlength` and `minlength` attributes of input, they declare a limit on the number of characters a user can input. The "number of characters" is measured using JavaScript string length.Setting the `maxlength` prop for a text or textarea type of Input can limit the length of input value, allows you to show word count by setting `show-word-limit` to `true` at the same time.

input/length-limiting

:::

## Input Attributes

| 属性                 | 说明                                                                                                           | 类型                                     | 可选值                                                                                                                               | 默认值 |
| -------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| type                 | 类型                                                                                                           | string                                   | text，textarea 和其他[原生 input 的 type 值](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types) | text   |
| modelValue / v-model | 绑定值                                                                                                         | string / number                          | —                                                                                                                                    | —      |
| maxlength            | 最大输入长度                                                                                                   | string / number                          | —                                                                                                                                    | —      |
| minlength            | 原生属性，最小输入长度                                                                                         | number                                   | —                                                                                                                                    | —      |
| show-word-limit      | 是否显示输入字数统计，只在 `type = "text"` 或 `type = "textarea"` 时有效                                       | boolean                                  | —                                                                                                                                    | false  |
| placeholder          | 输入框占位文本                                                                                                 | string                                   | —                                                                                                                                    | —      |
| clearable            | 是否可清空                                                                                                     | boolean                                  | —                                                                                                                                    | false  |
| formatter            | 指定输入值的格式。(只有当 `type` 是"text"时才能工作)                                                           | function(value: string / number): string | —                                                                                                                                    | —      |
| parser               | 指定从格式化器输入中提取的值。(仅当 `type` 是"text"时才起作用)                                                 | function(string): string                 | —                                                                                                                                    | —      |
| show-password        | 是否显示切换密码图标                                                                                           | boolean                                  | —                                                                                                                                    | false  |
| disabled             | 是否禁用                                                                                                       | boolean                                  | —                                                                                                                                    | false  |
| size                 | 输入框尺寸，只在 `type` 不为 'textarea' 时有效                                                                 | string                                   | large / default / small                                                                                                              | —      |
| prefix-icon          | 自定义前缀图标                                                                                                 | string / Component                       | —                                                                                                                                    | —      |
| suffix-icon          | 自定义后缀图标                                                                                                 | string / Component                       | —                                                                                                                                    | —      |
| rows                 | 输入框行数，仅 `type` 为 'textarea' 时有效                                                                     | number                                   | —                                                                                                                                    | 2      |
| autosize             | textarea 高度是否自适应，仅 `type` 为 'textarea' 时生效。 可以接受一个对象，比如: `{ minRows: 2, maxRows: 6 }` | boolean / object                         | —                                                                                                                                    | false  |
| autocomplete         | 原生 `autocomplete` 属性                                                                                       | string                                   | —                                                                                                                                    | off    |
| name                 | 等价于原生 input `name` 属性                                                                                   | string                                   | —                                                                                                                                    | —      |
| readonly             | 原生 ` readonly` 属性，是否只读                                                                                | boolean                                  | —                                                                                                                                    | false  |
| max                  | 原生 `max` 属性，设置最大值                                                                                    | —                                        | —                                                                                                                                    | —      |
| min                  | 原生属性，设置最小值                                                                                           | —                                        | —                                                                                                                                    | —      |
| step                 | 原生属性，设置输入字段的合法数字间隔                                                                           | —                                        | —                                                                                                                                    | —      |
| resize               | 控制是否能被用户缩放                                                                                           | string                                   | none / both / horizontal / vertical                                                                                                  | —      |
| autofocus            | 原生属性，自动获取焦点                                                                                         | boolean                                  | —                                                                                                                                    | false  |
| form                 | 原生属性                                                                                                       | string                                   | —                                                                                                                                    | —      |
| label                | 标签文本                                                                                                       | string                                   | —                                                                                                                                    | —      |
| tabindex             | 输入框的 tabindex                                                                                              | string / number                          | -                                                                                                                                    | -      |
| validate-event       | 输入时是否触发表单的校验                                                                                       | boolean                                  | -                                                                                                                                    | true   |
| input-style          | input 元素或 textarea 元素的 style                                                                             | object                                   | -                                                                                                                                    | {}     |

## Input slots

| 名称    | 说明                                    |
| ------- | --------------------------------------- |
| prefix  | 输入框头部内容，只对 `type="text"` 有效 |
| suffix  | 输入框尾部内容，只对 `type="text"` 有效 |
| prepend | 输入框前置内容，只对 `type="text"` 有效 |
| append  | 输入框后置内容，只对 `type="text"` 有效 |

## Input Events

| 事件名 | 说明                                          | 参数                      |
| ------ | --------------------------------------------- | ------------------------- |
| blur   | 在 Input 失去焦点时触发                       | (event: Event)            |
| focus  | 在 Input 获得焦点时触发                       | (event: Event)            |
| change | 仅在输入框失去焦点或用户按下回车时触发        | (value: string \| number) |
| input  | 在 Input 值改变时触发                         | (value: string \| number) |
| clear  | 在点击由 `clearable` 属性生成的清空按钮时触发 | —                         |

## Input Methods

| 方法   | 说明                | 参数 |
| ------ | ------------------- | ---- |
| focus  | 使 input 获取焦点   | —    |
| blur   | 使 input 失去焦点   | —    |
| select | 选中 input 中的文字 | —    |
