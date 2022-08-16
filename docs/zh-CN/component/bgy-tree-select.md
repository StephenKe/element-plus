---
title: TreeSelect 选择器

lang: zh-CN
---

# BgyTreeSelect 选择器

下拉选项为树形结构的 Select 选择器，仅能选择末级叶子节点。

<style lang="scss">

.example-showcase .el-bgy-tree-select {

  width: 240px;

}

</style>

## 基础用法

:::demo 适用广泛的基础单选 `v-model` 的值为当前被选中的 tree 叶子节点对应的 nodeKey（默认 id，可自定义） 属性值

bgy-tree-select/basic-usage

:::

## 禁用状态

禁用整个选择器组件

:::demo 为 `el-tree-select` 设置 `disabled`属性，则整个选择器不可用。

bgy-tree-select/disabled

:::

## 可清空选项

包含清空按钮，可将选择器清空为初始状态

:::demo 为 `el-tree-select` 设置 `clearable` 属性，则可将选择器清空。此处同时开启手风琴模式，即对于同一级的节点，每次只能展开一个

bgy-tree-select/clearable

:::

## 基础多选

适用性较广的基础多选，用 Tag 展示已选项

:::demo 为 `el-bgy-tree-select` 设置 `multiple` 属性即可启用多选， 此时 `v-model` 的值为当前选中值所组成的数组。 默认情况下选中值会以 Tag 的形式展现， 你也可以设置 `collapse-tags` 属性将它们合并为一段文字。

bgy-tree-select/multiple

:::

## 自定义 BgyTreeSelect 组件内容

你可以自定义 BgyTreeSelect 组件头部和下拉框无数据时的显示内容

:::demo 使用 prefix 和 empty 插槽实现头部和无数据下拉框的自定义内容
bgy-tree-select/custom-parts
:::

## tree: 根节点描述设置

默认情况，根节点描述只读，且不可选中，可通过将 data 属性设置为数组形式，使得根节点与其他父节点效果相同。

:::demo data 的值为对象时，根节点仅起到描述的作用。为数组时，根节点的行为与其他父节点相同。

bgy-tree-select/tree-root-node

:::

## tree: 自定义树节点

你可以自定义单个选项怎么被渲染

:::demo 将自定义的 HTML 模板插入 BgyTreeSelect 的 treeNode slot 中即可。

bgy-tree-select/tree-custom-node

:::

## tree: 可禁用的叶子节点

你可以定义 tree 中禁用的叶子节点，仅用于 multiple 为 true 的情况。
:::demo 设置 data 属性绑定数据元素的 disabled 属性即可
bgy-tree-select/tree-disabled-node
:::

## tree: 自定义 tree data 属性结构

你可以自定义 tree data 数据结构属性映射关系，默认

```
{
    children: 'children',
    label: 'label',
    disabled: 'disabled',
}
```

:::demo 通过设置 props 属性实现 tree data 数据属性映射关系

bgy-tree-select/tree-custom-props

:::

## tree: 懒加载叶子节点

:::demo 由于在点击节点时才进行该层数据的获取，默认情况下 Tree 无法预知某个节点是否为叶子节点， 所以会为每个节点添加一个下拉按钮，如果节点没有下层数据，则点击后下拉按钮会消失。 同时，你也可以提前告知 Tree 某个节点是否为叶子节点，从而避免在叶子节点前渲染下拉按钮。

bgy-tree-select/tree-lazy-node

:::

## tree: 默认选中及默认展开

:::demo 可通过 v-model 设置默认选中节点；通过 default-expanded-keys 设置默认展开节点。
bgy-tree-select/tree-default-setting
:::

## 可筛选

:::demo 设置 `filterable` 属性为 **true** 以启用筛选。可通过 `filterMethod` 或 `filterNodeMethod` 实现自定义筛选逻辑。
bgy-tree-select/filterable
:::

## BgyTreeSelect 属性

| 属性                         | 说明                                                                                               | 类型                               | 可选值                      | 默认值                                        |
| ---------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------- | --------------------------- | --------------------------------------------- |
| model-value / v-model        | 选中项绑定值                                                                                       | string / number / boolean / object | —                           | —                                             |
| data                         | 下拉框 tree 绑定的数据结构                                                                         | object / array                     | —                           | —                                             |
| multiple                     | 是否多选                                                                                           | boolean                            | —                           | false                                         |
| filterable                   | 是否可筛选                                                                                         | boolean                            | —                           | false                                         |
| disabled                     | 是否禁用                                                                                           | boolean                            | —                           | false                                         |
| size                         | 输入框尺寸                                                                                         | string                             | large/default/small         | default                                       |
| clearable                    | 是否可以清空选项                                                                                   | boolean                            | —                           | false                                         |
| collapse-tags                | 多选时是否将选中值按文字的形式展示                                                                 | boolean                            | —                           | false                                         |
| multiple-limit               | 多选时用户最多可以选择的项目数， 为 0 则不限制                                                     | number                             | —                           | 0                                             |
| filter-method                | 自定义筛选，需要在本函数中更新 TreeSelect 绑定的 `data`                                            | function                           | —                           | —                                             |
| filter-node-method           | 对树节点进行筛选时执行的方法， 返回 `false` 则表示这个节点会被隐藏                                 | Function(value, data, node)        | —                           | —                                             |
| multiple-limit               | 多选时用户最多可以选择的项目数， 为 0 则不限制                                                     | number                             | —                           | 0                                             |
| name                         | 多选框的输入框的原生 name 属性                                                                     | string                             | —                           | —                                             |
| placeholder                  | 占位符                                                                                             | string                             | —                           | Select                                        |
| loading                      | 是否正在从远程获取数据                                                                             | boolean                            | —                           | false                                         |
| loading-text                 | 搜索内容加载中的文字                                                                               | string                             | —                           | Loading                                       |
| no-data-text                 | 选项为空时显示的文字，也可以使用 `empty` 插槽设置                                                  | string                             | —                           | No data                                       |
| popper-class                 | TreeSelect 下拉框的类名                                                                            | string                             | —                           | —                                             |
| popper-append-to-body        | 是否将弹出框插入至 body 元素。 在弹出框的定位出现问题时，可将该属性设置为 false                    | boolean                            | —                           | true                                          |
| automatic-dropdown           | 是否在输入框获得焦点后自动弹出选项菜单                                                             | boolean                            | —                           | false                                         |
| clear-icon                   | 自定义清除当前选择的图标                                                                           | string / Component                 | —                           | CircleClose                                   |
| fit-input-width              | 下拉框是否与输入框同宽                                                                             | boolean                            | —                           | false                                         |
| suffix-icon                  | 自定义后缀图标组件                                                                                 | string / Component                 | —                           | ArrowUp                                       |
| tag-type                     | tag type                                                                                           | string                             | success/info/warning/danger | info                                          |
| render-after-expand          | tree 是否在第一次展开某个树节点后才渲染其子节点                                                    | boolean                            | success/info/warning/danger | false                                         |
| node-key                     | tree 每个树节点用来作为唯一标识的属性，也是 modalValue 值绑定的属性，整棵树应该是唯一的            | string                             | —                           | id                                            |
| check-strictly               | tree 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法                                      | boolean                            | —                           | false                                         |
| default-expand-all           | tree 是否默认展开所有节点                                                                          | boolean                            | —                           | false                                         |
| expand-on-click-node         | tree 是否在点击节点的时候展开或者收缩节点， 若为 false，则只有点箭头图标的时候才会展开或者收缩节点 | boolean                            | —                           | true                                          |
| check-on-click-node          | tree 是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点                | boolean                            | —                           | false                                         |
| default-checked-keys（弃用） | tree 默认勾选的节点的 key 的数组                                                                   | array                              | —                           | —                                             |
| default-expanded-keys        | tree 默认展开的节点的 key 的数组                                                                   | array                              | —                           | —                                             |
| current-node-key             | tree 当前选中的节点 key                                                                            | string / number                    | —                           | —                                             |
| props                        | tree 配置选项，详见下方 props                                                                      | object                             | —                           | —                                             |
| lazy                         | tree 是否懒加载子节点，需与 load 方法结合使用                                                      | boolean                            | —                           | false                                         |
| highlight-current            | tree 是否高亮当前选中节点                                                                          | boolean                            | —                           | true                                          |
| load                         | tree 加载子树数据的方法，仅当 lazy 属性为 true 时生效                                              | function                           | —                           | —                                             |
| accordion                    | tree 是否每次只打开一个同级树节点                                                                  | boolean                            | —                           | false                                         |
| indent                       | tree 相邻级节点间的水平缩进，单位为像素                                                            | number                             | —                           | 18                                            |
| icon                         | tree 自定义图标组件                                                                                | string / object                    | —                           | CaretRight(@element-plus/icons-vue component) |

## props

| Props    | 说明                                                     | 类型                          | 可选值 | 默认值   |
| -------- | -------------------------------------------------------- | ----------------------------- | ------ | -------- |
| label    | 指定节点标签为节点对象的某个属性值                       | string, function(data, node)  | —      | label    |
| children | 指定子树为节点对象的某个属性值                           | string                        | —      | children |
| disabled | 指定节点选择框是否禁用为节点对象的某个属性值             | boolean, function(data, node) | —      | disabled |
| isLeaf   | 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效 | boolean, function(data, node) | —      | —        |
| class    | 自定义节点类名                                           | string, function(data, node)  | —      | —        |

## BgyTreeSelect 事件

| 事件名           | 说明                                        | 回调参数                                                                                                                                                         |
| ---------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| change           | 选中值发生变化时触发                        | val，目前的选中值                                                                                                                                                |
| visible-change   | 下拉框出现/隐藏时触发                       | val，出现则为 true，隐藏则为 false                                                                                                                               |
| remove-tag       | 多选模式下移除 tag 时触发                   | val，移除的 tag 值                                                                                                                                               |
| clear            | 可清空的单选模式下用户点击清空按钮时触发    | —                                                                                                                                                                |
| blur             | 当 input 失去焦点时触发                     | (event: Event)                                                                                                                                                   |
| focus            | 当 input 获得焦点时触发                     | (event: Event)                                                                                                                                                   |
| check            | tree 点击节点复选框之后触发                 | 共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性 |
| check-change     | tree 当复选框被点击的时候触发               | 共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性 |
| current-change   | tree 当前选中节点变化时触发的事件           | 共两个参数，依次为：当前节点的数据，当前节点的 Node 对象                                                                                                         |
| node-click       | tree 当节点被点击的时候触发                 | 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。                                                                  |
| node-contextmenu | tree 当某一节点被鼠标右键点击时会触发该事件 | 共四个参数，依次为：event、传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。                                                           |
| node-collapse    | tree 节点被关闭时触发的事件                 | 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身                                                                    |
| node-expand      | tree 节点被展开时触发的事件                 | 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身                                                                    |

## BgyTreeSelect 插槽

| 插槽名   | 说明                        | 子标签 |
| -------- | --------------------------- | ------ |
| prefix   | TreeSelect 组件头部内容     | —      |
| empty    | 无选项时的列表              | —      |
| treeNode | 下拉框树 tree node 节点内容 | —      |

## BgyTreeSelect 方法

| 方法名         | 说明                                       | 参数                                                           |
| -------------- | ------------------------------------------ | -------------------------------------------------------------- |
| focus          | 使选择器的输入框获取焦点                   | -                                                              |
| blur           | 使选择器的输入框失去焦点，并隐藏下拉框     | -                                                              |
| setCheckedKeys | 仅 multiple 为 true 时可用，设置选中的节点 | keys: nodeKey 数组, leafOnly: 是否仅选中叶子节点，默认为 false |
