//@ts-nocheck
import cloneDeep from 'lodash/cloneDeep'
import { ElMessage } from '@element-plus/components'
import { contractDefaultData } from './dataStructure'
import type { ContractEditData, ContractUser } from './interface/contractEdit'
import type { ErrorCheck } from './interface'
/**
 * 对象数组去重
 * @param arr 对象数组
 * @param prop 根据此属性去重
 * @returns
 */
export function arrDistinctByProp(arr: object[], prop: string) {
  return arr.filter((item: object, index: number, self: object[]) => {
    return self.findIndex((s) => s[prop] === item[prop]) === index
  })
}

/**
 * 数组元素交换位置
 * @param {array} arr 数组
 * @param {number} index1 添加项目的位置
 * @param {number} index2 删除项目的位置
 * index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
 */
export function swapArray(arr: any, index1: number, index2: number) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  return arr
}

// 检测后端返回报错并抛出信息的方法
export function checkErrMsg(res: any) {
  const msgSet = res.d?.ContMsgSet?.results || []
  const msgs = msgSet.filter((d) => d.Type === 'E')
  const warnings = msgSet.filter((d) => d.Type === 'W')
  const As = msgSet.filter((d) => d.Type === 'A')
  const resObj: ErrorCheck = {}
  if (msgs.length) {
    const duration = 3000 * msgs.length
    const showClose = msgs.length >= 3
    const msgHTML = msgs.reduce((prev, curr) => {
      let style = 'word-break:break-all;line-height:20px;display:block;'
      if (prev.length > 0) {
        style += 'margin-top:8px;'
      }
      return `${prev}<span style="${style}">${curr.MessageText}</span>`
    }, '')
    ElMessage({
      type: 'error',
      dangerouslyUseHTMLString: true,
      message: msgHTML,
      duration,
      showClose,
    })
    Object.assign(resObj, {
      E: msgs.length,
    })
    if (As.length) {
      Object.assign(resObj, {
        A: As.length,
      })
    }
  } else if (warnings.length) {
    const duration = 3000 * warnings.length
    const showClose = warnings.length >= 3
    const msgHTML = warnings.reduce((prev, curr) => {
      let style = 'word-break:break-all;line-height:20px;display:block;'
      if (prev.length > 0) {
        style += 'margin-top:8px;'
      }
      return `${prev}<span style="${style}">${curr.MessageText}</span>`
    }, '')
    ElMessage({
      type: 'warning',
      dangerouslyUseHTMLString: true,
      message: msgHTML,
      duration,
      showClose,
    })
    Object.assign(resObj, {
      W: warnings.length,
    })
  }

  return resObj
}

// 合同数据结构提交前转换成后端需要的格式
export function formatContractData(data: ContractEditData) {
  const res = {
    ...cloneDeep(contractDefaultData),
    ...cloneDeep(data),
    ZconClass3: Array.isArray(data.ZconClass3)
      ? data.ZconClass3.join(',')
      : data.ZconClass3,
    ZconClassNo3: Array.isArray(data.ZconClassNo3)
      ? data.ZconClassNo3.join(',')
      : data.ZconClassNo3,
    ZmainZconClassNo3: Array.isArray(data.ZmainZconClassNo3)
      ? data.ZmainZconClassNo3.join(',')
      : data.ZmainZconClassNo3,
    Zterritory: Array.isArray(data.Zterritory)
      ? data.Zterritory.join(',')
      : data.Zterritory,
    ZsReasonNo: Array.isArray(data.ZsReasonNo)
      ? data.ZsReasonNo.join(',')
      : data.ZsReasonNo,
  }
  res.ContPartySet.results.forEach((d) => {
    d.Zfzmk = Array.isArray(d.Zfzmk) ? d.Zfzmk.join(',') : d.Zfzmk
  })
  return res
}

// 合同数据获取后解析成前端需要的格式
export function parseContractData(data: ContractEditData, pageType?: string) {
  const res = {
    ...cloneDeep(contractDefaultData),
    ...cloneDeep(data),
    ZconClassNo3: data.ZconClassNo3
      ? (data.ZconClassNo3 as string).split(',')
      : [],
    ZmainZconClassNo3: data.ZmainZconClassNo3
      ? (data.ZmainZconClassNo3 as string).split(',')
      : [],
    Zterritory: data.Zterritory ? (data.Zterritory as string).split(',') : [],
    ZsReasonNo: data.ZsReasonNo ? (data.ZsReasonNo as string).split(',') : [],
  }
  // 描述性字段，只有在编辑时才转换成数组
  if (pageType !== 'view') {
    res.ZconClass3 = data.ZconClass3
      ? (data.ZconClass3 as string).split(',')
      : []
  }
  res.ContPartySet.results.forEach((d) => {
    d.Zfzmk = d.Zfzmk ? (d.Zfzmk as string).split(',') : []
  })
  return res
}

export function randomId() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16) // Number.toString(16)  表示将其转换为16进制
}

export function getBgyUploadConfigs(env: string, user: ContractUser) {
  const configs = {
    data: {
      fileBusinessDomain: 'Kr6MdJviNPnDN6bPpYrp',
      fileProject: 'project100001',
      fileType: '-qpJR8Txk5bNWZo50TDB',
      fileSourceSystem: 'ysWmeXRODZPrFgkAMf0Z',
    },
    action: '/api/file/middleground/upload/query',
    previewInfo: {
      bip: user.bip || '',
      name: user.name,
      tenantKey: '5c38eb06-d28f-4f06-afee-e7fbf9516d7e',
    },
    requestDomain: 'https://yth-sit.countrygarden.com.cn',
  }
  // if (env === 'production' || env === 'prod') {
  //   configs.requestDomain = 'https://yth.countrygarden.com.cn'
  // }
  return configs
}
