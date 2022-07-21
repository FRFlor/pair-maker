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

    it("Allows a name to be deleted", async () => {
        await wrapper.find("input[type=text]#new-name").setValue("Boris");
        await wrapper.find("button#add-name").trigger("click");

        await wrapper.find("button.delete-name").trigger("click");

        expect(wrapper.text()).not.toContain("Boris");
    });

    it("Displays proposed pairings", async () => {
        const namesInLocalStorage = ["Ana", "Boris", "Clara", "Daniel"];
        localStorage.setItem("names", JSON.stringify(namesInLocalStorage));
        wrapper = mount(PairMaker)

        await wrapper.find("button#see-proposed-pairings").trigger("click");
        namesInLocalStorage.forEach(name => expect(wrapper.find('#pairs-list').text()).toContain(name));
    });

    it("allows a proposed pairing to be saved", async () => {
        window.alert = jest.fn();
        const namesInLocalStorage = ["Ana", "Boris", "Clara", "Daniel"];
        localStorage.setItem("names", JSON.stringify(namesInLocalStorage));
        wrapper = mount(PairMaker)

        await wrapper.find("button#see-proposed-pairings").trigger("click");
        const originalProposedPair = wrapper.find('#pairs-list li').text();
        await wrapper.find("button#save-proposed-pairing").trigger("click");


        expect(window.alert).toHaveBeenCalled();

        for (let i = 0; i < 300; i++) {
            await wrapper.find("button#see-proposed-pairings").trigger("click");
            wrapper.findAll('#pairs-list li').forEach((proposedPair) =>
                expect(proposedPair.text()).not.toContain(originalProposedPair))
        }
    });
})
