import {VueWrapper} from "@vue/test-utils";
import AddToPairingHistory from "@/components/AddToPairingHistory.vue";
import {useStoreNames} from "@/composables/useStoreNames";
import {useMakePairs} from "@/composables/useMakePairs";
import Dropdown from "primevue/dropdown";
import {mountComponentWithPrimeVue} from "../../testHelpers";
import {Pairing} from "@/types";

describe("AddToPairingHistory", () => {
    it("populates the select options with all the member names", async () => {
        const names = ["Alice", "Bob"];
        const wrapper = getWrapper(names);

        await selectNameInDropdown(wrapper, "Alice");
        expect(wrapper.find(`[toggle-name=Bob]`).exists()).toBe(true)

        await selectNameInDropdown(wrapper, "Bob");
        expect(wrapper.find(`[toggle-name=Alice]`).exists()).toBe(true)
    });

    it("Allows Manual Entries to the Pairing History", async () => {
        const wrapper = getWrapper(["Alice", "Bob"]);

        await selectNameInDropdown(wrapper, "Alice");
        await wrapper.find("[toggle-name=Bob]").trigger("click");
        await wrapper.find("#save-to-pairing-history").trigger("click");

        assertPairingHistoryHas("Alice");
        assertPairingHistoryHas("Bob");
    });

    it("has the button in OFF state if the person has not been a pair in the past", async () => {
        const wrapper = getWrapper(["Alice", "Bob"]);

        await selectNameInDropdown(wrapper, "Alice");

        await assertToggleButtonIsOff(wrapper, "[toggle-name=Bob]");
    })

    it("has the button in the ON state if the person has been a pair in the past", async () => {
        const wrapper = getWrapper(["Alice", "Bob"]);
        await savePairThroughComposable(wrapper, {"Alice": "Bob"});

        await selectNameInDropdown(wrapper, "Alice");

        await assertToggleButtonIsOn(wrapper, "[toggle-name=Bob]");
    })

    it("pre selects pairings that are already in history", async () => {
        const wrapper = getWrapper(["Alice", "Bob", "Charlie"]);

        await selectNameInDropdown(wrapper, "Alice");
        await wrapper.find("[toggle-name=Bob]").trigger("click");
        await assertToggleButtonIsOn(wrapper, "[toggle-name=Bob]");

        await wrapper.find("#save-to-pairing-history").trigger("click");

        await selectNameInDropdown(wrapper, "Bob");
        await assertToggleButtonIsOn(wrapper, "[toggle-name=Alice]");
        await assertToggleButtonIsOff(wrapper, "[toggle-name=Charlie]");
    });

    it("updates the selected pairings when the pairing history is updated", async () => {
        const wrapper = getWrapper(["Alice", "Bob"]);

        await selectNameInDropdown(wrapper, "Alice");
        await savePairThroughComposable(wrapper, {"Alice": "Bob"});

        await assertToggleButtonIsOn(wrapper, "[toggle-name=Bob]");
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
    wrapper.findComponent(Dropdown).vm.$emit("update:modelValue", name);
    await wrapper.vm.$nextTick();
}

async function savePairThroughComposable(wrapper: VueWrapper, pair: Pairing) {
    const {savePairing} = useMakePairs(useStoreNames().names);
    savePairing(pair);
    await wrapper.vm.$nextTick();
}

function assertPairingHistoryHas(name: string) {
    const {names} = useStoreNames();
    const {pairingHistory} = useMakePairs(names);
    expect(pairingHistory.value).toHaveProperty(name);
}

async function assertToggleButtonIsOn(wrapper: VueWrapper, selector: string) {
    expect(wrapper.find(selector).classes("p-highlight")).toBeTruthy();
}

async function assertToggleButtonIsOff(wrapper: VueWrapper, selector: string) {
    expect(wrapper.find(selector).classes("p-highlight")).toBeFalsy();
}
