---
title: BgyUpload 附件上传
lang: zh-CN
---

# BgyUpload 附件上传

通过点击上传附件文件，使用方式同 upload 组件大同小异

## 基础用法

:::demo 预览和下载需要用户自行实现，预览方法通过传入 `on-preview`，下载方法通过传入 `on-download`

bgy-upload/basic

:::

## 上传附件限制

:::demo `limit` 属性限制上传的文件个数，`multiple` 属性限制是否能多选，如果值为数字，则表示单次选择上传的文件个数，`per-size` 属性限制单个文件大小限制(单位 KB)，`accept` 属性限制文件格式，可以为一个二维数组，用于文件分组，以上四个属性均能生成上传提示信息

bgy-upload/limit

:::

## 自定义内容

:::demo 自定义触发其和文件列表后面添加附加信息

bgy-upload/customization

:::

## 勾选文件

:::demo 可以通过设置 `selectable` 属性开启文件列表选择功能

bgy-upload/selectable

:::

## 设置文件列表模式

:::demo 可以通过 `list-container-type` 属性设置文件列表的显示类型。该范例包括 table 类型的插槽使用方式。

bgy-upload/listcontainertype

:::

## 按钮控制

:::demo 可以通过设置每个文件对象的 operationButtons 属性控制需要显示的操作按钮，该属性的值是一个包含按钮编号的数组。可选值 “delete”，“reupload”，“preview”，“download”。

bgy-upload/buttoncontrol

:::

## 自定义文件中台接口

:::demo 可以通过设置 action，remove-url，download-url 属性来自定义文件中台接口。Url 不需要包含域名部分，其中涉及到文件 Id 的位置需要用 FILE_ID 占位。自定义接口开发需参考一体化管理平台。

bgy-upload/customurl

:::

## 属性

| 属性                | 描述                                                                                                                                                                                                                                                                             | 类型                               | 可选值         | 默认值                                               |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | -------------- | ---------------------------------------------------- |
| action              | 上传的地址，一体化项目默认文件中台接口地址，可不传                                                                                                                                                                                                                               | string                             | —              | /integration-api/platform-file/file/upload/query     |
| inline-tip          | 上传附件的提示文案和按钮展示同一行还是换行展示                                                                                                                                                                                                                                   | boolean                            | —              | true                                                 |
| headers             | 设置上传的请求头部                                                                                                                                                                                                                                                               | object                             | —              | —                                                    |
| method              | 设置上传请求方法                                                                                                                                                                                                                                                                 | string                             | post/put/patch | POST                                                 |
| multiple            | 是否支持多选文件，如果为 > 1 的数字，则表示每次上传时选择的文件个数限制，注意 0 默认为 false                                                                                                                                                                                     | boolean / number                   | —              | false                                                |
| data                | 上传时附带的额外参数                                                                                                                                                                                                                                                             | object                             | —              | —                                                    |
| name                | 上传的文件字段名                                                                                                                                                                                                                                                                 | string                             | —              | file                                                 |
| with-credentials    | 支持发送 cookie 凭证信息                                                                                                                                                                                                                                                         | boolean                            | —              | false                                                |
| show-file-list      | 是否显示已上传文件列表                                                                                                                                                                                                                                                           | boolean                            | —              | true                                                 |
| list-container-type | 文件列表显示类型                                                                                                                                                                                                                                                                 | string                             | table/list     | table                                                |
| drag                | 是否启用拖拽上传                                                                                                                                                                                                                                                                 | boolean                            | —              | false                                                |
| accept              | 接受上传的 [文件类型](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept)，可以是一个二维数组，例如：`:accept="[['png', 'jpg'], 'pdf']"`，生成的提示信息为：`支持png/jpg, pdf`,发现区别了吗？二维数组用于表示文件分组，使用`/`分隔，一维数组使用`,`分隔 | string[]                           | —              | —                                                    |
| on-preview          | 点击文件列表中已上传的文件时的钩子                                                                                                                                                                                                                                               | function(file)                     | —              | —                                                    |
| on-remove           | 文件列表移除文件时的钩子                                                                                                                                                                                                                                                         | function(file, fileList)           | —              | —                                                    |
| on-success          | 文件上传成功时的钩子                                                                                                                                                                                                                                                             | function(response, file, fileList) | —              | —                                                    |
| on-error            | 文件上传失败时的钩子                                                                                                                                                                                                                                                             | function(err, file, fileList)      | —              | —                                                    |
| on-progress         | 文件上传时的钩子                                                                                                                                                                                                                                                                 | function(event, file, fileList)    | —              | —                                                    |
| on-change           | 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用                                                                                                                                                                                                                   | function(file, fileList)           | —              | —                                                    |
| onSelectionChange   | `selectable` 为 true 时切换文件列表勾选状态时触发                                                                                                                                                                                                                                | function(selection, file)          | —              | —                                                    |
| before-upload       | 上传文件之前的钩子，参数为上传的文件。 若返回 `false` 或者返回 `Promise` 且被 reject，则终止上传。                                                                                                                                                                               | function(file)                     | —              | —                                                    |
| before-remove       | 删除文件之前的钩子，参数为上传的文件和文件列表。 若返回 `false` 或者返回 `Promise` 且被 reject，则终止删除。                                                                                                                                                                     | function(file, fileList)           | —              | —                                                    |
| thumbnail-mode      | 是否显示缩略图                                                                                                                                                                                                                                                                   | boolean                            | —              | false                                                |
| file-list           | 上传的文件列表，例如：[{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]                                                                                                                                                                                                   | array                              | —              | []                                                   |
| auto-upload         | 是否自动上传文件                                                                                                                                                                                                                                                                 | boolean                            | —              | true                                                 |
| http-request        | 覆盖默认的 xhr 行为，允许您实现自己的上传文件请求                                                                                                                                                                                                                                | function                           | —              | —                                                    |
| disabled            | 是否禁用                                                                                                                                                                                                                                                                         | boolean                            | —              | false                                                |
| selectable          | 是否可选择                                                                                                                                                                                                                                                                       | boolean                            | —              | false                                                |
| sourceSystem        | 来源系统，非一体化系统使用需传递该参数                                                                                                                                                                                                                                           | string                             | —              | yth                                                  |
| limit               | 允许上传的最大数量                                                                                                                                                                                                                                                               | number                             | —              | —                                                    |
| per-size            | 单个文件大小限制，单位 kb                                                                                                                                                                                                                                                        | number                             | —              | —                                                    |
| on-validator        | 用户自定义校验规则，如果提供了该方法，则内部校验文件大小，单次上传限制，总上传文件数限制等都将失效，交由该方法来决定，返回 true 则表示校验通过                                                                                                                                   | function(props, files) => boolean  | —              | -                                                    |
| preview-info        | 预览需要的用户信息，`{ bip: '', name: '', tenantKey: ''}`                                                                                                                                                                                                                        | object                             | —              |
| request-domain      | 一体化接口请求域名，若为空则默认与系统域名一致（涉及接口：预览，删除，下载，批量下载）                                                                                                                                                                                           | string                             | —              |
| remove-url          | 文件删除接口                                                                                                                                                                                                                                                                     | string                             | —              | /integration-api/platform-file/file/FILE_ID          |
| download-url        | 文件下载接口                                                                                                                                                                                                                                                                     | string                             | —              | /integration-api/platform-file/file/download/FILE_ID |
| terminal-type       | 终端类型，用于控制附件列表显示（仅 list-container-type="table" 有效）                                                                                                                                                                                                            | string                             | pc/mobile      | pc                                                   |

## 插槽

| 名称   | 描述                                                                                            | 参数                      |
| ------ | ----------------------------------------------------------------------------------------------- | ------------------------- |
| —      | 触发附件上传的触发器                                                                            | -                         |
| tip    | 提示说明文字                                                                                    | -                         |
| attach | 上传的每项文件后的内容/当 terminal-type="mobile" 时插槽结构只能传 el-table-column type="expand" | file ( #file = { file } ) |

## 方法

| 方法名        | 描述                     | 参数                                                  | Default |
| ------------- | ------------------------ | ----------------------------------------------------- | ------- |
| clearFiles    | 清除文件列表             | (UploadStatus = 'ready','uploading','success','fail') | -       |
| abort         | 取消上传请求             | ( file: fileList's item )                             | -       |
| submit        | 手动上传文件列表         | —                                                     | -       |
| handleStart   | select the file manually | ( file: files' item)                                  | -       |
| handleRemove  | remove the file manually | ( file: fileList's item )                             | -       |
| batchDownload | 批量下载                 | (fileList) 需要下载的文件列表                         | -       |
