---
title: Cascader 级联选择器
lang: zh-CN
---

# Cascader 级联选择器

当一个数据集合有清晰的层级结构时，可通过级联选择器逐级查看并选择。

## 基础用法

有两种触发子菜单的方式

:::demo 只需为 Cascader 的`options`属性指定选项数组即可渲染出一个级联选择器。 通过`props.expandTrigger`可以定义展开子级菜单的触发方式。

cascader/basic

:::

## 有禁用选项

通过在数据源中设置 `disabled` 字段来声明该选项是禁用的

:::demo 本例中，`options`指定的数组中的第一个元素含有`disabled: true`键值对，因此是禁用的。 在默认情况下，Cascader 会检查数据中每一项的`disabled`字段是否为`true`，如果你的数据中表示禁用含义的字段名不为`disabled`，可以通过`props.disabled`属性来指定（详见下方 API 表格）。 当然，`value`、`label`和`children`这三个字段名也可以通过同样的方式指定。

cascader/option-disabling

:::

## 可清空

通过 `clearable` 设置输入框可清空

:::demo

cascader/clearable

:::

## 仅显示最后一级

可以仅在输入框中显示选中项最后一级的标签，而不是选中项所在的完整路径。

:::demo 属性`show-all-levels`定义了是否显示完整的路径， 将其赋值为 `false` 则仅显示最后一级。

cascader/last-level

:::

## 多选

在标签中添加 `:props="props"` 并设置 `props = { multiple: true }` 来开启多选模式。

正确用法：

```html
<template>
  <el-cascader :props="props" />
</template>
<script lang="ts">
  export default {
    setup() {
      return {
        props: {
          // props.
          multiple: true,
        },
      }
    },
  }
</script>
```

错误用法：

```html
<template>
  <!--  Object literal binging here is invalid syntax for cascader  -->
  <el-cascader :props="{ multiple: true }" />
</template>
```

:::demo 使用多选时，所有选中的标签将默认显示。 您可以设置 `collapse = true` 将选中的标签折叠。 当鼠标悬停折叠文字时，您可以使用 `collapse-tags-tooltip` 属性来查看它们。

cascader/multiple-selection

:::

## 选择任意一级选项

在单选模式下，你只能选择叶子节点；而在多选模式下，勾选父节点真正选中的都是叶子节点。 启用该功能后，可让父子节点取消关联，选择任意一级选项。

:::demo 可通过 `props.checkStrictly = true` 来设置父子节点取消选中关联，从而达到选择任意一级选项的目的。

cascader/any-level

:::

## 动态加载

当选中某一级时，动态加载该级下的选项。

:::demo 通过`lazy`开启动态加载，并通过`lazyload`来设置加载数据源的方法。 `lazyload`方法有两个参数，第一个参数`node`为当前点击的节点，第二个`resolve`为数据加载完成的回调(必须调用)。 为了更准确的显示节点的状态，还可以对节点数据添加是否为叶子节点的标志位 (默认字段为`leaf`，可通过`props.leaf`修改)。 否则，将以有无子节点来判断其是否为叶子节点。

cascader/dynamic-loading

:::

## 可搜索

可以快捷地搜索选项并选择。

:::demo 通过添加`filterable`来启用过滤。 Cascader 会匹配所有节点的标签和它们的亲节点的标签，是否包含有输入的关键字。 你也可以用`filter-method`自定义搜索逻辑，接受一个函数，第一个参数是节点`node`，第二个参数是搜索关键词`keyword`，通过返回布尔值表示是否命中。

cascader/filterable

:::

## 自定义节点内容

可以自定义备选项的节点内容

:::demo 你可以通过 `scoped slot` 自定义节点的内容。 使用 scoped slot 会传入两个参数`node`和`data`，分别表示当前节点的 Node 对象和当前节点的数据。

cascader/custom-content

:::

## 级联面板

级联面板是级联选择器的核心组件，与级联选择器一样，有单选、多选、动态加载等多种功能。

:::demo 和级联选择器一样，通过`options`来指定选项，也可通过`props`来设置多选、动态加载等功能，具体详情见下方 API 表格。

cascader/panel

:::

## Cascader 属性

| 属性                        | 说明                                                                                                                                               | 类型                    | 可选值                      | 默认值 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | --------------------------- | ------ |
| model-value / v-model       | 选中项绑定值                                                                                                                                       | -                       | —                           | —      |
| options                     | 可选项数据源，键名可通过 `Props` 属性配置                                                                                                          | array                   | —                           | —      |
| props                       | 配置选项，具体见下表                                                                                                                               | object                  | —                           | —      |
| size                        | 尺寸                                                                                                                                               | string                  | large / default / small     | —      |
| placeholder                 | 输入框占位文本                                                                                                                                     | string                  | —                           | Select |
| disabled                    | 是否禁用                                                                                                                                           | boolean                 | —                           | false  |
| clearable                   | 是否支持清空选项                                                                                                                                   | boolean                 | —                           | false  |
| show-all-levels             | 输入框中是否显示选中值的完整路径                                                                                                                   | boolean                 | —                           | true   |
| collapse-tags               | 多选模式下是否折叠 Tag                                                                                                                             | boolean                 | -                           | false  |
| collapse-tags-tooltip       | 当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签。 要使用此属性，`collapse-tags`属性必须设定为 true                                            | boolean                 | -                           | false  |
| separator                   | 用于分隔选项的字符                                                                                                                                 | string                  | —                           | ' / '  |
| filterable                  | 该选项是否可以被搜索                                                                                                                               | boolean                 | —                           | —      |
| filter-method               | 自定义搜索逻辑，第一个参数是`node`，第二个参数是`keyword`，返回的布尔值表示是否保留该选项                                                          | function(node, keyword) | -                           | -      |
| debounce                    | 搜索关键词正在输入时的去抖延迟，单位为毫秒                                                                                                         | number                  | —                           | 300    |
| before-filter               | 过滤函数调用前欲被调用的钩子函数，该函数接受一个参数。 如果该函数的返回值是 `false` 或者是一个被拒绝的 `Promise`，那么接下来的过滤逻辑便不会执行。 | function(value)         | —                           | —      |
| popper-class                | 弹出内容的自定义类名                                                                                                                               | string                  | —                           | —      |
| teleported                  | 是否在弹出内容时启用动画                                                                                                                           | boolean                 | true / false                | true   |
| popper-append-to-body(弃用) | 是否将弹出的内容直接插入到 body 元素。 在弹出内容的边框定位出现问题时，可将该属性设置为 false                                                      | boolean                 | -                           | true   |
| tag-type                    | 标签类型                                                                                                                                           | string                  | success/info/warning/danger | info   |

## Cascader 事件

| 事件名         | 说明                          | 回调参数                      |
| -------------- | ----------------------------- | ----------------------------- |
| change         | 当绑定值变化时触发的事件      | value                         |
| expand-change  | 当展开节点发生变化时触发      | 各父级选项值组成的数组        |
| blur           | 当失去焦点时触发              | (event: Event)                |
| focus          | 当获得焦点时触发              | (event: Event)                |
| visible-change | 下拉框出现/隐藏时触发         | 出现则为 true，隐藏则为 false |
| remove-tag     | 在多选模式下，移除 Tag 时触发 | 移除的 Tag 对应的节点的值     |

## Cascader 方法

| 方法名          | 说明           | 参数                                          |
| --------------- | -------------- | --------------------------------------------- |
| getCheckedNodes | 获取选中的节点 | (leafOnly) 是否只是叶子节点，默认值为 `false` |

## Cascader 插槽

| 插槽名 | 说明                                                                            |
| ------ | ------------------------------------------------------------------------------- |
| -      | 自定义备选项的节点内容，参数为 { node, data }，分别为当前节点的 Node 对象和数据 |
| empty  | 无匹配选项时的内容                                                              |

## CascaderPanel 属性

| 属性                  | 说明                                      | 类型   | 可选值 | 默认值 |
| --------------------- | ----------------------------------------- | ------ | ------ | ------ |
| model-value / v-model | 选中项绑定值                              | -      | —      | —      |
| options               | 可选项数据源，键名可通过 `Props` 属性配置 | array  | —      | —      |
| props                 | 配置选项，具体见下表                      | object | —      | —      |

## CascaderPanel 事件

| 事件名称      | 说明                     | 回调参数               |
| ------------- | ------------------------ | ---------------------- |
| change        | 当选中节点变化时触发     | value                  |
| expand-change | 当展开节点发生变化时触发 | 各父级选项值组成的数组 |

## CascaderPanel 方法

| 方法名            | 说明               | 参数                                          |
| ----------------- | ------------------ | --------------------------------------------- |
| getCheckedNodes   | 获取选中的节点数组 | (leafOnly) 是否只是叶子节点，默认值为 `false` |
| clearCheckedNodes | 清空选中的节点     | -                                             |

## CascaderPanel 插槽

| 插槽名 | 说明                                                                            |
| ------ | ------------------------------------------------------------------------------- |
| -      | 自定义备选项的节点内容，参数为 { node, data }，分别为当前节点的 Node 对象和数据 |

## Props

| 属性          | 说明                                                                                               | 类型                                                                                     | 可选值        | 默认值     |
| ------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------- | ---------- |
| expandTrigger | 次级菜单的展开方式                                                                                 | string                                                                                   | click / hover | 'click'    |
| multiple      | 是否多选                                                                                           | boolean                                                                                  | -             | false      |
| checkStrictly | 是否严格的遵守父子节点不互相关联                                                                   | boolean                                                                                  | -             | false      |
| emitPath      | 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值 | boolean                                                                                  | -             | true       |
| lazy          | 是否动态加载子节点，需与 lazyLoad 方法结合使用                                                     | boolean                                                                                  | -             | false      |
| lazyLoad      | 加载动态数据的方法，仅在 lazy 为 true 时有效                                                       | function(node, resolve)，`node`为当前点击的节点，`resolve`为数据加载完成的回调(必须调用) | -             | -          |
| value         | 指定选项的值为选项对象的某个属性值                                                                 | string                                                                                   | —             | 'value'    |
| label         | 指定选项标签为选项对象的某个属性值                                                                 | string                                                                                   | —             | 'label'    |
| children      | 指定选项的子选项为选项对象的某个属性值                                                             | string                                                                                   | —             | 'children' |
| disabled      | 指定选项的禁用为选项对象的某个属性值                                                               | string                                                                                   | —             | 'disabled' |
| leaf          | 指定选项的叶子节点的标志位为选项对象的某个属性值                                                   | string                                                                                   | —             | 'leaf'     |
