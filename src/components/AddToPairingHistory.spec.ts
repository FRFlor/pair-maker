import {mount} from "@vue/test-utils";
import AddToPairingHistory from "@/components/AddToPairingHistory.vue";
import usePairMaking from "@/composables/usePairMaking";

describe('AddToPairingHistory', () => {
    it('populates the select options with all the member names', () => {
        const {addNewNameToList} = usePairMaking();
        const names = ["Alice", "Bob"];
        names.forEach((name) => addNewNameToList(name));
        const wrapper = mount(AddToPairingHistory);

        const allSelectOptions = wrapper.findAll('option')

        names.forEach(name => {
            const hasOptionForName = allSelectOptions.some((option) => option.text().includes(name));
            expect(hasOptionForName).toBe(true)
        });
    });
});
