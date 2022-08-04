---
title: Element/Bgy Plus 升级
lang: zh-CN
---

# 升级

## 依赖替换

1. `npm uninstall bgy-plus --save`
2. `npm install cs-element-plus --save`
3. 更多安装方式见[快速上手](/zh-CN/guide/quickstart)

## 引入依赖包名修改

1. 所有 `import { ... } from bgy-plus` 改为 `import { ... } from cs-element-plus`

## 组件修改

1. ` <button type="text" />` 组件推荐使用 `Link` 组件,文字按钮使用了` <button type="text" />`这种方式仍然兼容,但后续文字按钮需使用`Link`组件,详情见组件文档关于 `Button` 组件文字按钮的 `warining` 和 `Link` 组件文档
2. 原 bgy-plus 的 `TreeSelect` 树形选择组件需要使用新的`BgyTreeSelect`,而 `TreeSelect` 组件是官方 element-plus 的,详情见组件文档 `TreeSelect`组件
3. `Message` 组件如有报错请把 Vue 版本升至 `3.2.32` 以上,详见[官方 issue](https://github.com/element-plus/element-plus/issues/8796)

<style scoped>
  details {
    margin-top: 8px;
  }
</style>
