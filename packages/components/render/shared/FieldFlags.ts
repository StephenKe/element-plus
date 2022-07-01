/**
 * 字段类型
 * 对应 type 属性
 */
export enum FieldFlags {
  /** 文本输入框 */
  text = 1,
  /** 多行文本 */
  textarea = 1 << 1,
  /** 数字输入框 */
  number = 1 << 2,
  /** 日期时间选择框 */
  datetime = 1 << 3,
  /** 日期选择框 */
  date = 1 << 4,
  /** 周选择框 */
  week = 1 << 5,
  /** 月份选择框 */
  month = 1 << 6,
  /** 年份选择框 */
  year = 1 << 7,
  /** 多日期选择框 */
  dates = 1 << 8,
  /** 下拉选择框 */
  select = 1 << 9,
  /** 单选框 */
  radio = 1 << 10,
  /** 开关框 */
  switch = 1 << 11,
  /** 日期时间区间框 */
  datetimerange = 1 << 12,
  /** 日期区间框 */
  daterange = 1 << 13,
  /** 月份区间框 */
  monthrange = 1 << 14,
  /** 年份区间框 */
  yearrange = 1 << 15,
  /** 插槽 */
  slot = 1 << 16,
}

/**
 * el-input
 */
export const isInputFlags = (flag: FieldFlags): boolean =>
  Boolean(flag & (FieldFlags.text | FieldFlags.textarea))

/**
 * el-date-picker
 */
export const isDateFlags = (flag: FieldFlags): boolean =>
  Boolean(
    flag &
      (FieldFlags.datetime |
        FieldFlags.date |
        FieldFlags.week |
        FieldFlags.month |
        FieldFlags.year |
        FieldFlags.dates |
        FieldFlags.datetimerange |
        FieldFlags.daterange |
        FieldFlags.monthrange)
  )

/**
 * 区间框
 */
export const isRangeFlags = (flag: FieldFlags): boolean =>
  Boolean(
    flag &
      (FieldFlags.daterange |
        FieldFlags.datetimerange |
        FieldFlags.monthrange |
        FieldFlags.yearrange)
  )

/**
 * 选择型
 */
export const isSelectableFlags = (flag: FieldFlags): boolean =>
  Boolean(flag & FieldFlags.select || isDateFlags(flag) || isRangeFlags(flag))
