import {mount, VueWrapper} from '@vue/test-utils'
import PairMaker from '@/components/PairMaker.vue'
import PrimeVue from "primevue/config";
import ToggleButton from "primevue/togglebutton";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

describe('PairMaker.vue', () => {
    let wrapper: VueWrapper;

    beforeEach(() => {
        wrapper = getWrapper([]);
    })

    it('Displays all names', () => {
        const names = ["Ana", "Boris", "Clara", "Daniel"];
        wrapper = getWrapper(names);

        names.forEach(nameInLocalStorage => expect(wrapper.text()).toContain(nameInLocalStorage));
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

        expect(wrapper.find("#all-names-list").text()).not.toContain("Boris");
    });

    it("Displays proposed pairings", async () => {
        const names = ["Ana", "Boris", "Clara", "Daniel"];
        wrapper = getWrapper(names);

        await wrapper.find("button#see-proposed-pairings").trigger("click");
        names.forEach(name => expect(wrapper.find('#pairs-list').text()).toContain(name));
    });

    it("allows a proposed pairing to be saved", async () => {
        const names = ["Ana", "Boris", "Clara", "Daniel"];
        wrapper = getWrapper(names);

        await wrapper.find("button#see-proposed-pairings").trigger("click");
        const originalProposedPair = wrapper.find('#pairs-list li').text();
        await wrapper.find("button#save-proposed-pairing").trigger("click");

        for (let i = 0; i < 300; i++) {
            await wrapper.find("button#see-proposed-pairings").trigger("click");
            wrapper.findAll('#pairs-list li').forEach((proposedPair) =>
                expect(proposedPair.text()).not.toContain(originalProposedPair))
        }
    });

    it("Displays pairing history", async () => {
        const names = ["Ana", "Boris", "Clara", "Daniel"];
        wrapper = getWrapper(names);

        await wrapper.find("button#see-proposed-pairings").trigger("click");

        await wrapper.find("button#save-proposed-pairing").trigger("click");

        names.forEach(name =>
            expect(wrapper.find('#pairing-history').text()).toContain(name));

    });

    it("Displays errors", async () => {
        wrapper = getWrapper(["Ana", "Boris"]);

        expect(wrapper.find('#errors').text()).toEqual("");

        await wrapper.find("button#see-proposed-pairings").trigger("click");
        await wrapper.find("button#save-proposed-pairing").trigger("click");
        await wrapper.find("button#see-proposed-pairings").trigger("click");

        expect(wrapper.find('#errors').text()).not.toEqual("");
    })
})

function getWrapper(initialNames: string[]): VueWrapper {
    localStorage.clear();
    localStorage.setItem("names", JSON.stringify(initialNames));

    return mount(PairMaker, {
        global: {
            plugins: [PrimeVue],
            components: {ToggleButton, Dropdown, Button}
        }
    })
}
