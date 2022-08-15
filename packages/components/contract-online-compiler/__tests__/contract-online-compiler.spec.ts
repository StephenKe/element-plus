import { mount } from '@vue/test-utils'
import ContractOnlineCompiler from '../src/contract-online-compiler.vue'

const AXIOM = 'Rem is the best girl'

describe('contract-online-compiler.vue', () => {
  test('render test', () => {
    const wrapper = mount(ContractOnlineCompiler, {
      slots: {
        default: AXIOM,
      },
    })
    expect(wrapper.text()).toEqual(AXIOM)
  })
})
