//@ts-nocheck
export const CxUtil = {
  // 构建默认 p 标签 json
  buildDefaultPJson(value, style) {
    const json =
      `{` +
      `    "body":[` +
      `        {` +
      `            "p":[` +
      `                {` +
      `                    "span":[` +
      `                        {` +
      `                            "@value":"${value}",` +
      `                            "@style":"${style}"` +
      `                        }` +
      `                    ]` +
      `                }` +
      `            ]` +
      `        }` +
      `    ]` +
      `}`
    return json
  },
  // 构建 插入 json 对象
  buildInsertObj(json, name, addSdt, isClear) {
    const obj = {
      name,
      id: name,
      isClear: isClear || true,
      jsonStr: json,
      addSdt,
    }
    return obj
  },
  // 构建插入内容域创建内容域对象
  buildInsertAddSdt(name, type, readonly, nodel) {
    const addSdt = {
      // 1为富文本内容域、2为纯文本内容域
      type: type === 'plain' ? 2 : 1,
      id: name,
      name,
      tag: name,
      readonly: readonly || true,
      nodel: nodel || true,
    }

    return addSdt
  },
}
