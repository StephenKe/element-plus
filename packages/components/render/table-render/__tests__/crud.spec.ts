import { mount } from '@vue/test-utils'
import TableRender from '../src/index.vue'

const AXIOM = 'Rem is the best girl'

describe('render-table.vue', () => {
  test('render test', () => {
    const wrapper = mount(TableRender, {
      slots: {
        default: AXIOM,
      },
    })
    expect(wrapper.text()).toEqual(AXIOM)
  })
})
