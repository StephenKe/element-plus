---
title: Button 按钮
lang: zh-CN
---

# Button 按钮

常用的操作按钮。

## 基础用法

:::demo 使用 `type`、`plain`、`round` 和 `circle` 来定义按钮的样式。

button/basic

:::

## 禁用状态

你可以使用 `disabled` 属性来定义按钮是否被禁用。

:::demo 使用 `disabled` 属性来控制按钮是否为禁用状态。 该属性接受一个 `Boolean` 类型的值。

button/disabled

:::

## 文字按钮

:::tip

Text button has been upgraded with a new design since <el-tag round effect="plain" size="small">2.2.0</el-tag> , if you want to use the previous version like button, you might want to check [Link](./link.md#basic) out.

The API is also updated, because the `type` attribute also represents the button's style. So we have to make a new API `text: boolean` for text button.

:::

Buttons without border and background.

:::demo

button/text

:::

## 图标按钮

Use icons to add more meaning to Button. You can use icon alone to save some space, or use it with text.

:::demo Use the `icon` attribute to add icon. You can find the icon list in Element Plus icon component. Adding icons to the right side of the text is achievable with an `<i>` tag. Custom icons can be used as well.

button/icon

:::

## 按钮组

Displayed as a button group, can be used to group a series of similar operations.

:::demo Use tag `<el-button-group>` to group your buttons.

button/group

:::

## 加载中

Click the button to load data, then the button displays a loading state.

Set `loading` attribute to `true` to display loading state.

:::tip

You can use the `loading` slot or `loadingIcon` to customize your loading component

ps: `loading` slot has higher priority than loadingIcon

:::

:::demo

button/loading

:::

## 各种尺寸的按钮

Besides default size, Button component provides three additional sizes for you to choose among different scenarios.

:::demo Use attribute `size` to set additional sizes with `large`, `small`.

button/size

:::

## Custom Color <VersionTag version="beta" />

You can custom button color.

We will calculate hover color & active color automatically.

:::demo

button/custom

:::

## Button 属性

| 属性                                | 说明                                                            | 类型               | 可选值                                                        | 默认值  |
| ----------------------------------- | --------------------------------------------------------------- | ------------------ | ------------------------------------------------------------- | ------- |
| size                                | 尺寸                                                            | string             | large / default /small                                        | —       |
| type                                | 类型                                                            | string             | primary / success / warning / danger / info / <del>text</del> | —       |
| plain                               | 是否为朴素按钮                                                  | boolean            | —                                                             | false   |
| text <VersionTag version="2.2.0" /> | determine whether it's a text button                            | boolean            | —                                                             | false   |
| bg <VersionTag version="2.2.0" />   | determine whether the text button background color is always on | boolean            | —                                                             | false   |
| round                               | determine whether it's a round button                           | boolean            | —                                                             | false   |
| circle                              | determine whether it's a circle button                          | boolean            | —                                                             | false   |
| loading                             | determine whether it's loading                                  | boolean            | —                                                             | false   |
| loading-icon                        | customize loading icon component                                | string / Component | —                                                             | Loading |
| disabled                            | disable the button                                              | boolean            | —                                                             | false   |
| icon                                | icon component                                                  | string / Component | —                                                             | —       |
| autofocus                           | same as native button's `autofocus`                             | boolean            | —                                                             | false   |
| native-type                         | same as native button's `type`                                  | string             | button / submit / reset                                       | button  |
| auto-insert-space                   | automatically insert a space between two chinese characters     | boolean            |                                                               | —       |

## Button 插槽

| 插槽名  | 说明             |
| ------- | ---------------- |
| —       | 自定义默认内容   |
| loading | 自定义加载中组件 |
| icon    | 自定义图标组件   |

## Button Group 属性

| 属性 | 说明                         | 类型   | 可选值           | 默认值 |
| ---- | ---------------------------- | ------ | ---------------- | ------ |
| size | 用于控制该按钮组内按钮的大小 | string | 与按钮的大小相同 | —      |
| type | 用于控制该按钮组内按钮的类型 | string | 与按钮的类型一致 | —      |

## Button Group 插槽

| 插槽名 | 说明             | 子标签 |
| ------ | ---------------- | ------ |
| -      | 自定义按钮组内容 | Button |
