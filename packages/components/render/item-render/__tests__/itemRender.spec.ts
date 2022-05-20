import { mount } from '@vue/test-utils'
import ItemRender from '../src/index.vue'

const AXIOM = 'Rem is the best girl'

describe('itemRender.vue', () => {
  test('render test', () => {
    const wrapper = mount(ItemRender, {
      slots: {
        default: AXIOM,
      },
    })
    expect(wrapper.text()).toEqual(AXIOM)
  })
})
