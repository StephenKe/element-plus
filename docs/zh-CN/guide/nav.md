---
title: 导航
lang: zh-CN
---

<style>
:root {
  --categories-c-bg: #F9FAFC;
  --categories-c-page: #E5E9F2;
  --categories-c-overlay: white;
  --categories-c-text: #99A9BF;
  --categories-c-icon: #E5E9F2;
  --categories-c-line: #E5E9F2;
}

.dark {
  --categories-c-bg: #1D1E1F;
  --categories-c-page: #0A0A0A;
  --categories-c-overlay: #141414;
  --categories-c-text: #53637A;
  --categories-c-icon: #2F333D;
  --categories-c-line: #242529;
}
</style>

# 导航

导航可以解决用户在访问页面时：在哪里，去哪里，怎样去的问题。 一般导航会有「侧栏导航」和「顶部导航」2 种类型。

## 选择合适的导航

选择合适的导航可以让用户在产品的使用过程中非常流畅，相反若是不合适就会引起用户操作不适（方向不明确）。 以下是「侧栏导航」和 「顶部导航」的区别。

## 侧栏导航

可将导航栏固定在左侧，提高导航可见性，方便页面之间切换； 顶部可放置常用工具，如搜索条、帮助按钮、通知按钮等。 适用于中后台的管理型、工具型网站。

### 一级类目

适用于结构简单的网站：只有一级页面时。 不需要使用面包屑。

<L1Categories />

### 二级类目

Sidebar displays up to two levels of navigation. Breadcrumbs are recommended in combination of second level navigation, making it easier for the users to locate and navigate.

<L2Categories />

### 三级类目

Suitable for complicated utility websites. The left sidebar holds first level navigation, and the middle column displays second level navigation or other utility options.

<L3Categories />

## 顶部导航

Conforms to the normal browsing order from top to bottom, which makes things more natural. The navigation amount and text length are limited to the width of the top.

Suitable for sites with few navigation and large chunks.

<TopNavigationExample />
