import {mount} from '@vue/test-utils'
import PairMaker from '@/components/PairMaker.vue'

describe('PairMaker.vue', () => {
  beforeEach(() => {
    localStorage.clear();
  })

  it('Displays all names', () => {
    const namesInLocalStorage = ["Ana", "Boris", "Clara"];
    localStorage.setItem("names", JSON.stringify(namesInLocalStorage));
    const wrapper = mount(PairMaker)


    namesInLocalStorage.forEach(nameInLocalStorage => expect(wrapper.text()).toContain(nameInLocalStorage));
  })

  it("Allows a new name to be added", async () => {
    expect(localStorage.getItem("names")).toBeNull();
    const wrapper = mount(PairMaker);

    await wrapper.find("input[type=text]#new-name").setValue("Boris");
    await wrapper.find("button#add-name").trigger("click");

    expect(wrapper.text()).toContain("Boris");

  });
})
