/**
 * 字段类型
 */
export const enum FieldFlags {
  /**
   * 文本输入框
   */
  text = 1,
  /**
   * 多行文本
   */
  textarea = 1 << 1,
  /**
   * 数字输入框
   */
  number = 1 << 2,
  /**
   * 货币输入框
   */
  currency = 1 << 3,
  /**
   * 日期时间选择框
   */
  datetime = 1 << 4,
  /**
   * 日期选择框
   */
  date = 1 << 5,
  /**
   * 周选择框
   */
  week = 1 << 6,
  /**
   * 月份选择框
   */
  month = 1 << 7,
  /**
   * 年份选择框
   */
  year = 1 << 8,
  /**
   * 多日期选择框
   */
  dates = 1 << 9,
  /**
   * 下拉选择框
   */
  select = 1 << 10,
  /**
   * 单选框
   */
  radio = 1 << 11,
  /**
   * 开关框
   */
  switch = 1 << 12,
  /**
   * 插槽
   */
  slot = 1 << 13,
}

/**
 * 字段进行分组
 */
export const enum FieldGroupFlags {
  /**
   * 输入型
   */
  Input = FieldFlags.text |
    FieldFlags.textarea |
    FieldFlags.number |
    FieldFlags.currency,
  /**
   * 选择型
   */
  Picker = FieldFlags.datetime |
    FieldFlags.date |
    FieldFlags.week |
    FieldFlags.month |
    FieldFlags.year |
    FieldFlags.dates |
    FieldFlags.select |
    FieldFlags.radio,
  /**
   * 可多选的类型
   */
  Multiple = FieldFlags.select,
}
