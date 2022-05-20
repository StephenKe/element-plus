// 下载 blob 文件
export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a') // 创建a标签
  link.href = url
  link.download = fileName
  link.click()
  document.body.appendChild(link)
  URL.revokeObjectURL(url) // 释放内存
}
