---
title: Image 图片
lang: zh-CN
---

# Image 图片

图片容器，在保留所有原生 img 的特性下，支持懒加载，自定义占位、加载失败等

## 基础用法

:::demo 可通过`fit`确定图片如何适应到容器框，同原生 [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)。

image/basic-usage

:::

## 占位内容

:::demo 可通过`slot = placeholder`可自定义占位内容

image/placeholder

:::

## 加载失败

:::demo 可通过`slot = error`可自定义加载失败内容

image/load-failed

:::

## 懒加载

:::demo 可通过`lazy`开启懒加载功能， 当图片滚动到可视范围内才会加载。 可通过 `scroll-container` 来设置滚动容器， 若未定义，则为最近一个 overflow 值为 auto 或 scroll 的父元素。

image/lazy-load

:::

## 图片预览

:::demo 可通过 `previewSrcList` 开启预览大图的功能。 你可以通过 `initial-index` 初始化第一张预览图片的位置。 默认初始位置为 0。

image/image-preview

:::

## 图像 API

### Image 属性

| 名称                    | 说明                                                                                                                          | 类型                                                        | 默认值                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------- |
| `src`                   | 图片源地址，同原生属性一致                                                                                                    | `string`                                                    | —                                              |
| `fit`                   | 确定图片如何适应容器框，同原生 [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)                      | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale'-down'` | —                                              |
| `hide-on-click-modal`   | 当开启 preview 功能时，是否可以通过点击遮罩层关闭 preview                                                                     | `boolean`                                                   | `false`                                        |
| `lazy`                  | 是否使用懒加载                                                                                                                | `boolean`                                                   | `false`                                        |
| `scroll-container`      | 开启懒加载功能后，监听 scroll 事件的容器                                                                                      | `string \| HTMLElement`                                     | 最近一个 overflow 值为 auto 或 scroll 的父元素 |
| `alt`                   | 原生属性 `alt`                                                                                                                | `string`                                                    | —                                              |
| `referrer-policy`       | 原生属性 `referrerPolicy`                                                                                                     | `string`                                                    | —                                              |
| `preview-src-list`      | 开启图片预览功能                                                                                                              | `string[]`                                                  | —                                              |
| `z-index`               | 设置图片预览的 z-index                                                                                                        | `number`                                                    | —                                              |
| `initial-index`         | 初始预览图像索引，小于 `url-list` 的长度                                                                                      | `number`                                                    | `0`                                            |
| `close-on-press-escape` | 是否可以通过按下 ESC 关闭 Image Viewer                                                                                        | `boolean`                                                   | `true`                                         |
| `preview-teleported`    | whether to append image-viewer to body. A nested parent element attribute transform should have this attribute set to `true`. | `boolean`                                                   | `false`                                        |

### Image 事件

| 事件名   | 说明                                                               | 类型                      |
| -------- | ------------------------------------------------------------------ | ------------------------- |
| `load`   | 图片加载成功触发                                                   | `(e: Event) => void`      |
| `error`  | 图片加载失败触发                                                   | `(e: Error) => void`      |
| `switch` | 切换图像时触发。                                                   | `(index: number) => void` |
| `close`  | 当点击 X 按钮或者在`hide-on-click-modal`为 true 时点击遮罩层时触发 | `() => void`              |

### Image 插槽

| 插槽名        | 说明                                                     |
| ------------- | -------------------------------------------------------- |
| `placeholder` | custom placeholder content when image hasn't loaded yet. |
| `error`       | custom image load failed content.                        |
| `viewer`      | 图片描述内容                                             |

## Image Viewer API

### ImageViewer 属性

| 名称                  | 说明                                                                                     | 类型               | 默认值  |
| --------------------- | ---------------------------------------------------------------------------------------- | ------------------ | ------- |
| `url-list`            | 用于预览的图片链接列表                                                                   | `string[]`         | `[]`    |
| `z-index`             | 预览时遮罩层的 z-index                                                                   | `number \| string` | —       |
| `initial-index`       | 初始预览图像索引，小于 `url-list` 的长度                                                 | `number`           | `0`     |
| `infinite`            | 是否可以无限循环预览                                                                     | `boolean`          | `true`  |
| `hide-on-click-modal` | 是否可以通过点击遮罩层关闭预览                                                           | `boolean`          | `false` |
| `teleported`          | image 自身是否插入至 body 元素上。 嵌套的父元素属性会发生修改时应该将此属性设置为 `true` | `boolean`          | `false` |

### ImageViewer 事件

| 事件名   | 说明                                                               | 类型                      |
| -------- | ------------------------------------------------------------------ | ------------------------- |
| `close`  | 当点击 X 按钮或者在`hide-on-click-modal`为 true 时点击遮罩层时触发 | `() => void`              |
| `switch` | 切换图像时触发。                                                   | `(index: number) => void` |
