import { mount } from '@vue/test-utils'
import BgyAnchor from '../src/BgyAnchorLink.vue'

const AXIOM = 'Rem is the best girl'

describe('BgyAnchor.vue', () => {
  test('render test', () => {
    const wrapper = mount(BgyAnchor, {
      slots: {
        default: AXIOM,
      },
    })
    expect(wrapper.text()).toEqual(AXIOM)
  })
})
