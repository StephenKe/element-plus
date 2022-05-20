import { mount } from '@vue/test-utils'
import BgyUpload from '../src/bgyUpload.vue'

const AXIOM = 'Rem is the best girl'

describe('bgyUpload.vue', () => {
  test('render test', () => {
    const wrapper = mount(BgyUpload, {
      slots: {
        default: AXIOM,
      },
    })
    expect(wrapper.text()).toEqual(AXIOM)
  })
})
