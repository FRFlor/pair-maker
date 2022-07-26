import {ref} from "vue";
import {useMakePairs} from "@/composables/useMakePairs";

export const TIMEOUT = "Timeout";
const names = ref<string[]>([]);

export default function useStoreNames() {
    names.value = loadNames();
    const {pairingHistory, savePairing, proposePairing} = useMakePairs(names);

    function loadNames() {
        return JSON.parse(localStorage.getItem("names") ?? "[]");
    }

    function saveNames() {
        localStorage.setItem("names", JSON.stringify(names.value))
    }

    function addNewNameToList(newName: string) {
        const sanitizedName = newName.trim();
        if (names.value.includes(sanitizedName)) {
            throw Error("Each name must be unique.");
        }

        names.value.push(sanitizedName);
        saveNames();
    }

    function deleteName(target: string) {
        names.value = names.value.filter(name => target !== name);
        saveNames();
    }

    return {
        names,
        pairingHistory,
        addNewNameToList,
        deleteName,
        proposePairing,
        savePairing
    }
}