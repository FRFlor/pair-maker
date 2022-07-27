import {VueWrapper} from "@vue/test-utils";
import AddToPairingHistory from "@/components/AddToPairingHistory.vue";
import useStoreNames from "@/composables/useStoreNames";
import {useMakePairs} from "@/composables/useMakePairs";
import Dropdown from "primevue/dropdown";
import {mountComponentWithPrimeVue} from "../../testHelpers";

describe('AddToPairingHistory', () => {
    it('populates the select options with all the member names', async () => {
        const names = ["Alice", "Bob"];
        const wrapper = getWrapper(names);

        await selectNameInDropdown(wrapper, 'Alice');
        expect(wrapper.find(`[toggle-name=Bob]`).exists()).toBe(true)

        await selectNameInDropdown(wrapper, 'Bob');
        expect(wrapper.find(`[toggle-name=Alice]`).exists()).toBe(true)
    });

    it("Allows Manual Entries to the Pairing History", async () => {
        const wrapper = getWrapper(["Alice", "Bob"]);

        await selectNameInDropdown(wrapper, 'Alice');
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

    return mountComponentWithPrimeVue(AddToPairingHistory);
}

async function selectNameInDropdown(wrapper: VueWrapper, name: string) {
    wrapper.findComponent(Dropdown).vm.$emit('update:modelValue', name);
    await wrapper.vm.$nextTick();
}

function assertPairingHistoryHas(name: string) {
    const {names} = useStoreNames();
    const {pairingHistory} = useMakePairs(names);
    expect(pairingHistory.value).toHaveProperty(name);
}
