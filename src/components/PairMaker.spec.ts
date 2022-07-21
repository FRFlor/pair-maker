import {mount} from '@vue/test-utils'
import PairMaker from '@/components/PairMaker.vue'

describe('PairMaker.vue', () => {
  it('Displays all names', () => {
    const namesInLocalStorage = ["Ana", "Boris", "Clara"];
    localStorage.setItem("names", JSON.stringify(namesInLocalStorage));
    const wrapper = mount(PairMaker)


    namesInLocalStorage.forEach(nameInLocalStorage => expect(wrapper.text()).toContain(nameInLocalStorage));
  })
})
