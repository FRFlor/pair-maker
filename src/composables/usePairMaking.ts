import {ref} from "vue";
import {Pairing, PairingHistory} from "@/types";


export default function usePairMaking() {
    function loadNames() {
        return JSON.parse(localStorage.getItem("names") ?? "[]");
    }

    function saveNames() {
        localStorage.setItem("names", JSON.stringify(names.value))
    }

    function loadPairingHistory() {
        return JSON.parse(localStorage.getItem("pairingHistory") ?? "{}");
    }

    function savePairingHistory() {
        localStorage.setItem("pairingHistory", JSON.stringify(pairingHistory.value))
    }

    const names = ref<string[]>(loadNames());
    const pairingHistory = ref<PairingHistory>(loadPairingHistory());

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

    function proposePairing(): Pairing {
        if (names.value.length === 0) {
            return {};
        }

        if (names.value.length === 1) {
            return {[names.value[0]]: "Timeout"}
        }

        if (names.value.length === 2) {
            names.value.sort();
            return {[names.value[0]]: names.value[1]}
        }

        return {
            [names.value[0]]: names.value[1],
            [names.value[2]]: "Timeout",
        }
    }

    function savePairing(pairing: Pairing) {
        const newHistory = {...pairingHistory.value};

        for (const rightSideName of Object.keys(pairing)) {
            const leftSideName = pairing[rightSideName];

            if (!newHistory[rightSideName]) {
                newHistory[rightSideName] = [];
            }

            if (!newHistory[leftSideName]) {
                newHistory[leftSideName] = [];
            }

            newHistory[rightSideName].push(leftSideName);
            newHistory[leftSideName].push(rightSideName);
        }

        pairingHistory.value = newHistory;
        savePairingHistory();
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
