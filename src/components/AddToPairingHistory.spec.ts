import {mount} from "@vue/test-utils";
import AddToPairingHistory from "@/components/AddToPairingHistory.vue";
import useStoreNames from "@/composables/useStoreNames";
import {useMakePairs} from "@/composables/useMakePairs";
import PrimeVue from "primevue/config";
import ToggleButton from "primevue/togglebutton";

describe('AddToPairingHistory', () => {
    it('populates the select options with all the member names', () => {
        const names = ["Alice", "Bob"];
        const wrapper = getWrapper(names);

        const allSelectOptions = wrapper.findAll('option')

        names.forEach(name => {
            const hasOptionForName = allSelectOptions.some((option) => option.text().includes(name));
            expect(hasOptionForName).toBe(true)
        });
    });

    it("Allows Manual Entries to the Pairing History", async () => {
        const wrapper = getWrapper(["Alice", "Bob"]);

        await wrapper.find("select[name=right-hand-side]").setValue("Alice");
        await wrapper.find("[toggle-name=Bob]").trigger("click");
        await wrapper.find("#save-to-pairing-history").trigger("click");

        assertPairingHistoryHas("Alice");
        assertPairingHistoryHas("Bob");
    });
});


function getWrapper(startingNames: string[] = []) {
    localStorage.clear();
    const {names, addNewNameToList} = useStoreNames();
    const {pairingHistory} = useMakePairs(names);
    names.value = [];
    pairingHistory.value = {};
    startingNames.forEach(name => addNewNameToList(name));

    return mount(AddToPairingHistory, {
        global: {
            plugins: [PrimeVue],
            components: {ToggleButton}
        }
    });
}

function assertPairingHistoryHas(name: string) {
    const {names} = useStoreNames();
    const {pairingHistory} = useMakePairs(names);
    expect(pairingHistory.value).toHaveProperty(name);
}
