import { computed, reactive } from 'vue'
import type { PaginationProps } from '@element-plus/components'
import type { Pagination } from '../index'

export function usePagination(pagination: Pagination | boolean) {
  const {
    pageSize = pagination === false ? 999 : 10,
    pageSizes = [10, 20, 50, 100],
    pagerCount = 5,
    layout = ['total', 'sizes', 'prev', 'pager', 'next', 'jumper'],
    ...others
  } = pagination as Pagination
  /**
   * 是否展示 pagination
   */
  const visible = computed(() => Boolean(pagination))
  /**
   * 分页对象
   */
  const pager = reactive<PaginationProps>({
    // 其他属性
    ...others,
    // 当前页
    currentPage: 1,
    // 每页展示数量
    pageSize,
    // 每页展示数量可选值切换
    pageSizes,
    // 总条目数
    total: 0,
    // 设置最大页码按钮数。 页码按钮的数量，当总页数超过该值时会折叠
    pagerCount,
    // 组件布局 sizes / prev / pager / next / jumper / -> / total / slot
    layout: layout.join(', '),
  } as PaginationProps)

  /**
   * 每页展示数量量变更
   * @param pageSize 每页展示数量
   */
  const handleSizeChange = (pageSize: number) => {
    pager.currentPage = 1
    pager.pageSize = pageSize
  }

  /**
   * 切换页码
   * @param currentPage 当前页
   */
  const handleCurrentChange = (currentPage: number) => {
    pager.currentPage = currentPage
  }

  return {
    pager,
    visible,
    handleSizeChange,
    handleCurrentChange,
  }
}
