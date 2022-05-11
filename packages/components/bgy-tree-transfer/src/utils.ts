// @ts-check
import type { App } from 'vue'

export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}
//扁平化
export function convertTreeData(data: any[]) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].children != undefined) {
      const temp = data[i].children
      // 删除孩子节点
      delete data[i].children
      // 孩子节点加入数组末尾
      for (const element of temp) {
        data.push(element)
      }
    }
  }
  return duplicateRemoval(data, 'id')
}
//过滤 父组件 children
export function filterPid(data: any[], Pid: string | number) {
  const arr: any[] = []
  data.forEach((item) => {
    if (item.pid === Pid && item.children.length > 0) {
      item.children = []
    }
    arr.push(item)
  })
  return arr
}
//克隆
export function deepClone(obj: any) {
  let newObj: any
  try {
    newObj = obj.push ? [] : {}
  } catch {
    newObj = {}
  }
  for (const attr in obj) {
    if (typeof obj[attr] === 'object') {
      newObj[attr] = deepClone(obj[attr])
    } else {
      newObj[attr] = obj[attr]
    }
  }
  return newObj
}
//生成树
export function spanningTree(from: any[], to: any[]) {
  //合并数组 防止 有的地方为扁平化 再做一次
  const arr: any[] = convertTreeData([...from, ...to])
  //手动去重 保证 id唯一
  const obj = tree(duplicateRemoval(arr, 'id'), 0)
  return obj
}
// 根据 传值 动态删除 数据
export function dynamicDeletion(data: any[], del: any[]) {
  const set = del.map((item) => {
    if (item.pid !== 0) return item.id
    return item
  })
  console.error(set)
  data = data.filter((item) => {
    return !set.includes(item.id)
  })
  // 转成树
  return spanningTree(data, [])
}
//树父节点
function tree(data: string | any[], attrdata: number) {
  const result = [] //存储返回结果
  if (data && data.length > 0) {
    //判断传入数组是否有值
    for (const key of data) {
      //循环该数组
      if (key.pid == attrdata) {
        //匹配一级元素
        let obj: any = {} //存储我想要得属性
        //这里也可以增加自己想要属性
        const child = getChild(key.id, data) //匹配children 需要自身ID 数组
        if (child && child.length > 0) {
          obj.children = child
        }
        obj = Object.assign(key, obj) //合并数据
        result.push(obj)
      }
    }
  }
  return result
}
//getChild 方法和上述一样
function getChild(pid: string | number, data: string | any[]) {
  const result = []
  if (data && data.length > 0) {
    for (const key of data) {
      if (key.pid == pid) {
        let obj: any = {} //存储我想要得属性
        //这里也可以增加自己想要属性
        const child = getChild(key.id, data) //匹配children 需要自身ID 数组
        if (child && child.length > 0) {
          obj.children = child
        }
        obj = Object.assign(key, obj) //合并数据
        result.push(obj) //添加返回chidren数组
      }
    }
  }
  return result
}
// 去重
function duplicateRemoval(arr: any[], key: string | any) {
  const newobj = {},
    newArr = []
  for (const item of arr) {
    if (!newobj[item[key]]) {
      newobj[item[key]] = newArr.push(item)
    }
  }
  return newArr
}
