import {Ref, ref} from "vue";
import {Pairing, PairingHistory} from "@/types";
import {RNG} from "@/helpers/RNG";
import {TIMEOUT} from "@/constants";

const pairingHistory = ref<PairingHistory>({});

export function useMakePairs(names: Ref<string[]>) {
    pairingHistory.value = loadPairingHistory();

    function loadPairingHistory() {
        return JSON.parse(localStorage.getItem("pairingHistory") ?? "{}");
    }

    function savePairingHistory() {
        localStorage.setItem("pairingHistory", JSON.stringify(pairingHistory.value))
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
        pairingHistory,
        proposePairing,
        savePairing
    }
}
