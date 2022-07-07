import { mount } from '@vue/test-utils'
import ContractEditForm from '../src/contract-edit-form.vue'

const AXIOM = 'Rem is the best girl'

describe('contract-edit-form.vue', () => {
  test('render test', () => {
    const wrapper = mount(ContractEditForm, {
      slots: {
        default: AXIOM,
      },
    })
    expect(wrapper.text()).toEqual(AXIOM)
  })
})
