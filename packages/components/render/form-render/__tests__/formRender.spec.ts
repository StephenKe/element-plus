import { mount } from '@vue/test-utils'
import FormRender from '../src/index.vue'

const AXIOM = 'Rem is the best girl'

describe('formRender.vue', () => {
  test('render test', () => {
    const wrapper = mount(FormRender, {
      slots: {
        default: AXIOM,
      },
    })
    expect(wrapper.text()).toEqual(AXIOM)
  })
})
