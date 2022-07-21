import {mount, VueWrapper} from '@vue/test-utils'
import PairMaker from '@/components/PairMaker.vue'

describe('PairMaker.vue', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    localStorage.clear();
    wrapper = mount(PairMaker);
  })

  it('Displays all names', () => {
    const namesInLocalStorage = ["Ana", "Boris", "Clara"];
    localStorage.setItem("names", JSON.stringify(namesInLocalStorage));
    wrapper = mount(PairMaker)

    namesInLocalStorage.forEach(nameInLocalStorage => expect(wrapper.text()).toContain(nameInLocalStorage));
  })

  it("Allows a new name to be added", async () => {
    await wrapper.find("input[type=text]#new-name").setValue("Boris");
    await wrapper.find("button#add-name").trigger("click");

    expect(wrapper.text()).toContain("Boris");
  });

  it("Does not allow an empty name to be added", async () => {
    await wrapper.find("input[type=text]#new-name").setValue(" ");
    const submitButton = await wrapper.find("button#add-name");

    expect(submitButton.attributes("disabled")).toBeDefined();

    await wrapper.find("input[type=text]#new-name").setValue("ABC");

    expect(submitButton.attributes("disabled")).not.toBeDefined();
  });
})
