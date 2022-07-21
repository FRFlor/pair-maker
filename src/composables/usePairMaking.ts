import {ref} from "vue";
import {Pairing, PairingHistory} from "@/types";
import {RNG} from "@/helpers/RNG";

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

export const TIMEOUT = "Timeout";
const names = ref<string[]>([]);
const pairingHistory = ref<PairingHistory>({});

export default function usePairMaking() {
    names.value = loadNames();
    pairingHistory.value = loadPairingHistory();

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

    function throwErrorIfPairingIsNoLongerPossible() {
        if (names.value.length < 2) {
            return;
        }

        const hasEveryonePairedWithEveryone = names.value.every((name) => {
            const everyoneElse = names.value.filter(otherName => otherName !== name);
            const currentPairs = pairingHistory.value[name] ?? [];
            const possiblePairs = everyoneElse
                .filter(name => !currentPairs.includes(name));

            return possiblePairs.length === 0;
        });

        if (hasEveryonePairedWithEveryone) {
            throw Error("Cannot make more pairs!");
        }
    }

    function proposePairing(): Pairing {
        let namesUnpaired = [...names.value];
        const proposedPairing: Pairing = {};

        throwErrorIfPairingIsNoLongerPossible();

        while (namesUnpaired.length >= 2) {
            const firstPick = RNG.randomElementInArray(namesUnpaired);
            namesUnpaired = namesUnpaired.filter(name => name !== firstPick);

            const previousPairsForFirstPick: string[] = pairingHistory.value[firstPick] ?? [];
            const possiblePairs = namesUnpaired.filter(name => !previousPairsForFirstPick.includes(name));
            if (possiblePairs.length === 0) {
                proposedPairing[firstPick] = TIMEOUT;
                continue;
            }

            const secondPick = RNG.randomElementInArray(possiblePairs);
            namesUnpaired = namesUnpaired.filter(name => name !== secondPick);

            if (firstPick < secondPick) {
                proposedPairing[firstPick] = secondPick;
            } else {
                proposedPairing[secondPick] = firstPick;
            }
        }

        if (namesUnpaired.length === 1) {
            proposedPairing[namesUnpaired[0]] = TIMEOUT;
        }

        return proposedPairing;
    }

    function savePairing(pairing: Pairing) {
        const newHistory = {...pairingHistory.value};

        for (const rightSideName of Object.keys(pairing)) {
            const leftSideName = pairing[rightSideName];

            if (leftSideName === TIMEOUT || rightSideName === TIMEOUT) {
                continue;
            }

            if ((pairingHistory.value[leftSideName] ?? []).includes(rightSideName)) {
                continue;
            }

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
