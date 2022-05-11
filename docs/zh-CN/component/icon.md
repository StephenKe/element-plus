---
title: Icon 图标
lang: zh-CN
---

# Icon 图标

Element Plus 提供了一套常用的图标集合。

## 使用图标

- 如果你想像用例一样**直接使用**，你需要[全局注册组件](https://v3.vuejs.org/guide/component-registration.html#global-registration)，才能够直接在项目里使用。

- If you want to see all available SVG icons please check [@element-plus/icons-vue](https://unpkg.com/browse/@element-plus/icons-vue@latest/dist/es/) and the source [element-plus-icons](https://github.com/element-plus/element-plus-icons) out or [Icon Collection](#icon-collection)

## 安装

### 使用包管理器

```shell
# 选择一个你喜欢的包管理器

# NPM
$ npm install @element-plus/icons-vue
# Yarn
$ yarn add @element-plus/icons-vue
# pnpm
$ pnpm install @element-plus/icons-vue
```

### 注册所有图标

You need import all icons from `@element-plus/icons-vue` and register them globally.

```ts
// main.ts

// if you're using CDN, please remove this line.
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```

您也可以参考 [此模板](https://codepen.io/sxzz/pen/xxpvdrg)。

### Import in Browser

Import Element Plus Icons through browser HTML tags directly, and use global variable `ElementPlusIconsVue`.

According to different CDN providers, there are different introduction methods. Here we use [unpkg](https://unpkg.com) and [jsDelivr](https://jsdelivr.com) as example. You can also use other CDN providers.

#### unpkg

```html
<script src="//unpkg.com/@element-plus/icons-vue"></script>
```

#### jsDelivr

```html
<script src="//cdn.jsdelivr.net/npm/@element-plus/icons-vue"></script>
```

:::tip

We recommend using CDN to import Element Plus users to lock the version on the link address, so as not to be affected by incompatible updates when Element Plus is upgraded in the future. Please check [unpkg.com](https://unpkg.com) for the method to lock the version.

:::

### 自动导入

Use [unplugin-icons](https://github.com/antfu/unplugin-icons) and [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import) to automatically import any icon collections from iconify. You can refer to [this template](https://github.com/sxzz/element-plus-best-practices/blob/db2dfc983ccda5570033a0ac608a1bd9d9a7f658/vite.config.ts#L21-L58).

## Simple Usage

:::warning

Because HTML standard has already defined a tag named [menu](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu), so you need to use an alias in order to render the icon, if you register `Menu` directly it will not work.

:::

```vue
<!-- Use el-icon to provide attributes to SVG icon -->
<template>
  <div>
    <el-icon :size="size" :color="color">
      <edit />
    </el-icon>
    <!-- Or use it independently without derive attributes from parent -->
    <edit />
  </div>
</template>
```

<vp-script setup>
import { Edit, Share, Delete, Search, Loading } from '@element-plus/icons-vue'
</vp-script>

<ElRow>
  <div>
    <ElIcon :size="30">
      <Edit />
    </ElIcon>
    <Edit />
  </div>
</ElRow>

## 结合 el-icon 使用

`el-icon` provides extra attributes for raw SVG icon, for more detail, please read to the end.

```vue
<template>
  <p>
    with extra class <b>is-loading</b>, your icon is able to rotate 360 deg in 2
    seconds, you can also override this
  </p>
  <el-icon :size="20">
    <edit />
  </el-icon>
  <el-icon color="#409EFC" class="no-inherit">
    <share />
  </el-icon>
  <el-icon>
    <delete />
  </el-icon>
  <el-icon class="is-loading">
    <loading />
  </el-icon>
  <el-button type="primary">
    <el-icon style="vertical-align: middle">
      <search />
    </el-icon>
    <span style="vertical-align: middle"> Search </span>
  </el-button>
</template>
```

<ElRow>
  <p>
    通过添加额外的类名 <b>is-loading</b>，你的图标就可以在 2 秒内旋转 360 度，但让你也可以自己改写想要的动画。
  </p>
  <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
    <ElIcon :size="20">
      <Edit />
    </ElIcon>
    <ElIcon color="#409EFC" class="no-inherit">
      <Share />
    </ElIcon>
    <ElIcon>
      <Delete />
    </ElIcon>
    <ElIcon class="is-loading">
      <Loading />
    </ElIcon>
    <ElButton type="primary">
      <ElIcon style="vertical-align: middle; color: #fff;">
        <Search />
      </ElIcon>
      <span style="vertical-align: middle;">搜索</span>
    </ElButton>
  </div>
</ElRow>

## 直接使用 SVG 图标

```vue
<template>
  <div style="font-size: 20px">
    <!-- Since svg icons do not carry any attributes by default -->
    <!-- You need to provide attributes directly -->
    <edit style="width: 1em; height: 1em; margin-right: 8px" />
    <share style="width: 1em; height: 1em; margin-right: 8px" />
    <delete style="width: 1em; height: 1em; margin-right: 8px" />
    <search style="width: 1em; height: 1em; margin-right: 8px" />
  </div>
</template>
```

<ElRow>
  <div style="font-size: 20px;">
    <!-- Since svg icons do not carry any attributes by default -->
    <!-- You need to provide attributes directly -->
    <Edit style="width: 1em; height: 1em; margin-right: 8px;" />
    <Share style="width: 1em; height: 1em; margin-right: 8px;" />
    <Delete style="width: 1em; height: 1em; margin-right: 8px;" />
    <Search style="width: 1em; height: 1em; margin-right: 8px;" />
  </div>
</ElRow>

## 图标集合

:::tip

**You can use SVG icon in any version** as long as you install it

**You can click the icon to copy it**

:::

<IconList />

## Icon 属性

| 属性  | 说明                        | 类型                           | 可选值 | 默认值  |
| ----- | --------------------------- | ------------------------------ | ------ | ------- | ------- |
| color | svg 的 fill 颜色            | Pick\<CSSProperties, 'color'\> | -      | inherit |
| size  | SVG 图标的大小，size x size | number/                        | string | -       | inherit |

## Icon 插槽

| 名称 | 说明           |
| ---- | -------------- |
| —    | 自定义默认内容 |
