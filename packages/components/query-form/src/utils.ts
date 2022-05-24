// 获取元素到顶部
export const getDistanceToTop = (ele: HTMLElement) => {
  let distance: number = ele.offsetTop
  let parent: HTMLElement | null = ele.offsetParent as HTMLElement

  while (parent !== null) {
    distance += parent.offsetTop
    parent = parent.offsetParent as HTMLElement
  }

  return distance
}

// px 转 number
export const pxToNumber = (pxStr) => {
  return Number(pxStr.replace('px', ''))
}

// formitem size 与高度映射
enum HeightOfSize {
  'small' = '24px',
  'default' = '32px',
  'large' = '40px',
}

// 获取元素整体高度，包括 内容，padding，border，margin，以及
// 传入 form 参数时，为计算收起时的展示高度，需要通过 form 计算第一个 item 与 form 的距离
// 不传入 form 参数时，为计算 form 的子元素高度，用于累加计算整个 form 内容的高度
export const getEleHeight = (
  ele: HTMLElement,
  size: string,
  form?: HTMLElement
) => {
  if (!ele) return 0
  let eleToTop = 0
  let formToTop = 0
  let calcProperties: string[] = []
  if (form) {
    // 子元素到 top 的距离
    eleToTop = getDistanceToTop(ele)
    // form 到 top 的距离
    formToTop = getDistanceToTop(form)
    // 子元素需要计算的距离属性，height 包括了 content，padding 和 border
    calcProperties = ['marginBottom']
  } else {
    // 子元素需要计算的距离属性，height 包括了 content，padding 和 border
    calcProperties = ['marginTop', 'marginBottom']
  }
  // 获取子元素的 style，包含以上计算属性及其对应值
  const computedStyle = getComputedStyle(ele, null)
  const eleHeight =
    pxToNumber(computedStyle.height) || pxToNumber(HeightOfSize[size])
  // 结果为 子元素的高度 + marginBottom + 顶部到 form 的距离
  return (
    calcProperties.reduce((total, property) => {
      total += pxToNumber(computedStyle[property])
      return total
    }, 0) +
    eleHeight +
    (eleToTop - formToTop)
  )
}
