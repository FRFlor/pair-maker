import {shallowMount} from '@vue/test-utils'
import PairMaker from '@/components/PairMaker.vue'

describe('PairMaker.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(PairMaker, {
      props: {msg}
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
