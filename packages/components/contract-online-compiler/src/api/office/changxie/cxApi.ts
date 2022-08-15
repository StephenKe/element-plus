//@ts-nocheck
import { debugWarn } from '@element-plus/utils'
export const CxApi = {
  // 初始化在线编辑器
  initDefaultEditor(id, config) {
    if (!window?.CXO_API) {
      debugWarn('ElContractOnlineCompiler', '请引入外部依赖畅写Api')
      return
    }
    return new window.CXO_API.CXEditor(id, {
      type: config.type,
      documentType: 'word',
      token: '',
      document: {
        title: config.fileName,
        url: config.docUrl,
        fileType: config.fileType,
        key: config.docKey,
        permissions: config.permissions,
      },
      editorConfig: {
        mode: config.mode,
        user: {
          id: config.userId,
          name: config.username,
        },
        customization: {
          about: true,
          chat: false,
          comments: true,
          // 页面编辑宽度
          zoom: 120,
          leftMenu: false,
          rightMenu: false,
          toolbar: true,
          displayTitle: true,
          header: true,
          statusBar: true,
          autosave: true,
          forcesave: true,
        },
        callbackUrl: config.callbackUrl,
      },
      events: config.events,
    })
  },
  // 初始化自定义编辑器
  initCustomEditor(id, config) {
    if (!window?.CXO_API) {
      debugWarn('ElContractOnlineCompiler', '请引入外部依赖畅写Api')
      return
    }
    return new window.CXO_API.CXEditor(id, config)
  },
  // 获取内容域属性
  getContentPropertyByName(editor, name) {
    editor.getDocumentContent({
      object: 'content', // 表示操作对象为内容域，必填项
      type: 'property', // 提取内容域属性，必填项
      name, // 提取指定标签名称内容域的属性，name和id互斥，name优先级高于id,如name及id都未填写，则获取当前文档全部内容域
      id: '', // 提取指定id内容域的属性，name和id互斥,name优先级低于id,如name及id都未填写，则获取当前文档全部内容域
    })
  },
  // 将光标定位到内容域位置
  gotoxyContentArea(editor, id) {
    // 将光标跳转到内容域位置
    editor.setDocumentContent({
      object: 'content', // 表示操作对象为内容域，必填项
      type: 'select', // 表示是选中操作，必填项
      id, // 内容域的id
    })
  },
  // 设置内容域权限
  settingsContentPermission(editor, name, permission) {
    const object = {
      object: 'content',
      type: 'setting',
      list: [
        {
          id: name, // 内容域的id，时间戳，纯数字，与name互斥，优先级低于name
          name, // 内容域的标签，可以是英文数字，与id互斥，优先级高于id
          mode: permission, // 必填项，edit编辑 readonly只读 hide隐藏 nodelete不可删除 noedit不可编辑
        },
      ],
    }
    editor.setDocumentContent(object)
  },
  // 创建内容域
  createSelectContent(editor, id, type, text) {
    if (text === undefined || text === '' || text === null) {
      text = '      '
    }
    const object = {
      object: 'content', // 表示是文档控制域，必填项
      type: 'create', // 表示是建立操作，必填项
      ctrltype: type, // 必填，插入内容域类型，可选项：rich富文本、plain 纯文本、picture图片、combobox组合框、dropdown下拉列表、date日期、checkbox复选框
      force: true,
      props: {
        // 选填，内容域附加相关参数
        mode: 'edit', // 内容域编辑模式，默认edit，可选项：edit可编辑可删除、readonly不可编辑不可删除、nodelete可编辑不可删除、noedit可删除不可编辑
        name: id, // 标签，内容域标识，默认为空，字母或数字字符串
        displayname: id, // 标题，编辑区显示的名字
        pholder: '', // 预设文字，默认同界面操作，各类型不同
        border: {
          // 内容域边框 'none' 'default' 或 {r,g,b}
          r: 212,
          g: 146,
          b: 123,
        },
        text, // 插入文字内容，对图片、复选框、下拉列表无效
        value: '', // 选中项的值、图片等，如果类型为复选框，值为 true/false
      },
    }
    editor.setDocumentContent(object)
  },
  // 替换内容域中的文本
  replaceContentText(editor, name, newContent) {
    editor.setDocumentContent({
      object: 'content', // 表示操作对象为内容域，必填项
      type: 'replace', // 表示操作行为是替换内容，必填项
      name, // 内容域的标签，可以是英文数字，优先级高于ID
      id: undefined, // 内容域的ID，name和id必须有一
      value: newContent, // 替换完成后内容域内的文字内容
    })
  },
  // 插入指定json
  insertJson(editor, jsonArr) {
    const param = {
      object: 'content',
      type: 'html',
      jsonArr,
    }
    editor.setDocumentContentForBGY(param)
  },
  // 删除内容域
  deleteContentArea(editor, name, type) {
    // 删除前先将内容域权限取消
    this.settingsContentPermission(editor, name, 'edit')
    if (type === '1') {
      // 保留内容
      type = 'remove'
    } else {
      // 不保留内容
      type = 'delete'
    }
    editor.setDocumentContent({
      object: 'content',
      type,
      id: name,
      name,
      force: true,
    })
  },
  // 强制保存文档
  forceSave(editor) {
    editor.forceSave()
  },
  // 对打开的文档进行关闭摧毁
  destroyEditor(editor) {
    editor.destroyEditor()
  },
  // 调用获取内容域接口 todo 定制接口
  getContentAreaBGY(editor, name, without) {
    const names = [name]
    const param = {
      object: 'content',
      type: 'all',
      without: without || ['numbering'],
      name: names,
      id: [],
    }
    editor.getDocumentContentForBGY(param)
  },
}
