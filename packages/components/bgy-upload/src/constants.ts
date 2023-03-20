//@ts-nocheck
// 一体化项目
export const YTH_PROJECT = 'yth'

/** 一体化中台接口集合 */
// 单个附件上传
export const UPLOAD_URL = '/integration-api/platform-file/file/upload/query'
// TODO:批量附件上传
// export const MULTI_UPLOAD_URL =
//   '/integration-api/platform-file/file/upload/query'
// 删除单个附件
export const REMOVE_URL = '/integration-api/platform-file/file/FILE_ID'
// TODO:批量删除
// export const MULTI_REMOVE_URL = '/integration-api/platform-file/file/FILE_ID'
// 预览地址
export const PREVIEW_URL = '/integration-api/platform-file/file/preview'
// 单个附件下载
export const DOWNLOAD_URL =
  '/integration-api/platform-file/file/download/FILE_ID'
// 批量下载
export const MULTI_DOWNLOAD_URL =
  '/integration-api/platform-file/file/batch/download?fileIds=FILEIDS'
// 一体化附件后缀
export const YTH_ACCEPT = ['bmp', 'csv', 'doc', 'docx', 'dwg', 'et', 'etb', 'gsh6', 'heic', 'html', 'jpeg', 'jpg', 'l52', 'mov', 'mp4', 'ofd', 'pdf', 'png', 'ppt', 'pptx', 'psd', 'rar', 'rtf', 'tif', 'txt', 'webp', 'wps', 'xls', 'xlsx']
