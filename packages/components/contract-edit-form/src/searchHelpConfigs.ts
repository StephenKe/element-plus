// 利润中心搜索帮助弹窗配置
export const getProfitCenterDiaConfigs = (field) => {
  const dialogTitle = '选择利润中心'
  const dialogWidth = '800px'
  const f4field = 'Prctr'
  const searchFormConfigs = [
    {
      label: '利润中心',
      model: 'NAME',
      value: '',
    },
    {
      label: '利润中心编码',
      model: 'PRCTR',
      value: '',
    },
  ]
  const tableConfigs = {
    columns: [
      {
        label: '法人公司',
        prop: 'BUTXT',
      },
      {
        label: '利润中心编码',
        prop: 'PRCTR',
      },
      {
        label: '利润中心',
        prop: 'ZNODE_NAME',
      },
    ],
  }

  return {
    dialogTitle,
    dialogWidth,
    field,
    f4field,
    searchFormConfigs,
    tableConfigs,
  }
}

// 公司搜索帮助弹窗配置
export const getCompanyDiaConfigs = (
  isFirstParty,
  field,
  Znodeid,
  ZconClassNo1
) => {
  const dialogTitle = '选择公司'
  const dialogWidth = '1000px'
  const f4field =
    isFirstParty && field === 'Provider' ? 'H1Provider' : 'NH1Provider'
  const searchFormConfigs = [
    {
      label: '公司名称',
      model: 'BUTXT',
      value: '',
    },
    {
      label: '公司编码',
      model: 'NODEID',
      value: '',
    },
    {
      label: '',
      model: 'ZNODEID',
      value: Znodeid,
      hidden: true,
    },
    {
      label: '',
      model: 'ZCON_CLASS_NO1',
      value: ZconClassNo1,
      hidden: true,
    },
  ]
  const tableConfigs = {
    columns: [
      {
        label: '公司编码',
        prop: 'NODEID',
        width: '150',
      },
      {
        label: '公司名称',
        prop: 'BUTXT',
      },
      {
        label: '统一社会信用代码',
        prop: 'ZTYSHXYDM',
      },
    ],
  }

  return {
    dialogTitle,
    dialogWidth,
    field,
    f4field,
    searchFormConfigs,
    tableConfigs,
  }
}

// 银行账号搜索帮助弹窗配置
export const getBankAccountDiaConfigs = (field, f4field, companyCode) => {
  const dialogTitle = '选择银行信息'
  const dialogWidth = '1000px'
  const searchFormConfigs = [
    {
      label: '公司编码',
      model: 'NODEID',
      value: companyCode,
      hidden: true,
    },
  ]
  const tableConfigs = {
    columns: [
      {
        label: f4field === 'H1BankAccount' ? '公司编码' : '供应商编码',
        prop: 'NODEID',
      },
      {
        label: f4field === 'H1BankAccount' ? '公司名称' : '供应商名称',
        prop: 'BUTXT',
      },
      {
        label: '银行账户名称',
        prop: 'ACCOUNT_NAME',
      },
      {
        label: '银行账号',
        prop: 'ZYYZH',
      },
      {
        label: '账号类别',
        prop: 'ACCOUNT_TYPE',
      },
      {
        label: '联行号',
        prop: 'BANK_ID',
      },
      {
        label: '开户银行名称',
        prop: 'BANK',
      },
    ],
  }

  return {
    dialogTitle,
    dialogWidth,
    field,
    f4field,
    searchFormConfigs,
    tableConfigs,
  }
}

// 印章搜索帮助弹窗配置
export const getSealDiaConfigs = (companyName, signType, field) => {
  const dialogTitle = '选择印章'
  const dialogWidth = '1000px'
  const f4field = 'Zseal'
  const searchFormConfigs = [
    {
      label: '印章名称',
      model: 'ZSEAL_NAME',
      value: '',
    },
    {
      label: '签章联系人',
      model: 'ZSIGN_USER_NAME',
      value: '',
    },
    {
      label: '公司名称',
      model: 'BUTXT',
      value: companyName,
      hidden: true,
    },
    {
      label: '签章方式',
      model: 'CATEGORY',
      value: signType,
      hidden: true,
    },
  ]
  const tableConfigs = {
    tableHeight: '400',
    multiSelect: true,
    columns: [
      {
        label: '印章ID',
        prop: 'ZSEAL_ID',
      },
      {
        label: '印章名称',
        prop: 'ZSEAL_NAME',
      },
      {
        label: '印章属性名称',
        prop: 'ZSEAL_TYPE',
      },
      {
        label: '签章联系人',
        prop: 'ZSIGN_USER_NAME',
      },
      {
        label: '联系人电话号码',
        prop: 'ZSIGN_USER_PHONE',
        width: '124px',
      },
      {
        label: '签章联系人BIP',
        prop: 'ZSIGN_USER',
        width: '124px',
      },
      {
        label: '印章分类描述',
        prop: 'ZSEAL_CATEGORYT',
        width: '124px',
      },
    ],
  }

  return {
    dialogTitle,
    dialogWidth,
    field,
    f4field,
    searchFormConfigs,
    tableConfigs,
  }
}

// 适用范围搜索帮助弹窗配置
export const getRangeDiaConfigs = (field) => {
  const dialogTitle = '选择适用范围'
  const dialogWidth = '800px'
  const f4field = 'ZapplyNo'
  const searchFormConfigs = [
    {
      label: '适用范围名称',
      model: 'ZORGNAME',
      value: '',
    },
  ]
  const tableConfigs = {
    tableHeight: '350',
    multiSelect: true,
    columns: [
      {
        label: '适用范围名称',
        prop: 'ZORGNAME',
      },
      {
        label: '适用范围编码',
        prop: 'ZAPPLY_NO',
      },
      {
        label: '适用范围类别',
        prop: 'ZORGCATG',
      },
    ],
  }

  return {
    dialogTitle,
    dialogWidth,
    field,
    f4field,
    searchFormConfigs,
    tableConfigs,
  }
}

/* ZJL :项目执行经理 20
 ZCBR: 10-实际承包人、40-乙方签约代表、60-监理人驻场总监 搜索帮助弹窗配置
 Zzjbr：30-甲方签约代表、50-委托人常驻代表
 */
export const getPersonDiaConfigs = (field, f4field) => {
  const dialogTitle = '选择管理人'
  const dialogWidth = '800px'
  const searchFormConfigs = [
    {
      label: '人员id',
      model: 'ZUSRID',
      value: '',
    },
    {
      label: '人员名称',
      model: 'ZNACHN',
      value: '',
    },
  ]

  const tableConfigs = {
    tableHeight: '350',
    columns: [
      {
        label: '人员名称',
        prop: 'ZNACHN',
      },
      {
        label: '联系方式',
        prop: 'MOBILE',
      },
      {
        label: '邮件信息',
        prop: 'EMAIL',
      },
      {
        label: '岗位状态',
        prop: 'ZSTATUS',
      },
    ],
  }

  return {
    dialogTitle,
    dialogWidth,
    field,
    f4field,
    searchFormConfigs,
    tableConfigs,
  }
}

// 楼栋搜索帮助弹窗配置
export const getBuildingDiaConfigs = (field, zxmzj) => {
  const dialogTitle = '选择楼栋'
  const dialogWidth = '800px'
  const f4field = 'Building'
  const searchFormConfigs = [
    {
      label: '楼栋编码',
      model: 'BUILDING',
      value: '',
    },
    {
      label: '楼栋名称',
      model: 'BUILDINGTXT',
      value: '',
    },
    {
      label: '分期主键',
      model: 'ZXMZJ',
      value: zxmzj,
      hidden: true,
    },
  ]
  const tableConfigs = {
    tableHeight: '350',
    columns: [
      {
        label: '楼栋编码',
        prop: 'BUILDING',
      },
      {
        label: '楼栋名称',
        prop: 'BUILDINGTXT',
      },
    ],
  }

  return {
    dialogTitle,
    dialogWidth,
    field,
    f4field,
    searchFormConfigs,
    tableConfigs,
  }
}
