import {useStoreNames} from "@/composables/useStoreNames";
import {useMakePairs} from "@/composables/useMakePairs";
import {TIMEOUT} from "@/constants";

function getMakePairsComposable(startingNames: string[] = []) {
    localStorage.clear();
    const {names, addNewNameToList} = useStoreNames();
    names.value = [];
    startingNames.forEach(name => addNewNameToList(name));
    const {pairingHistory} = useMakePairs(names);
    pairingHistory.value = {};

    return useMakePairs(names);
}

describe("useMakePairs", () => {
    describe("data persistence", () => {
        it("Stores the pairingHistory in Local Storage", () => {
            const {savePairing, pairingHistory} = getMakePairsComposable(["Ana", "Boris"]);
            savePairing({"Ana": "Boris"});

            expect(localStorage.getItem("pairingHistory")).toEqual(JSON.stringify(pairingHistory.value));
        });

        it("Retrieves pairingHistory from Local Storage automatically upon instantiation", () => {
            localStorage.setItem("pairingHistory", JSON.stringify({
                "Ana": ["Boris"],
                "Boris": ["Ana"]
            }));

            const {pairingHistory} = useMakePairs(useStoreNames().names);
            expect(pairingHistory.value).toEqual({
                "Ana": ["Boris"],
                "Boris": ["Ana"]
            })
        });
    })

    describe("Propose Pairing", () => {
        it("returns empty when there are no names", () => {
            const {proposePairing} = getMakePairsComposable([]);

            expect(proposePairing()).toEqual({})
        });

        it("pairs 2 names together", () => {
            const {proposePairing} = getMakePairsComposable(["Ana", "Boris"]);

            expect(proposePairing()).toEqual({"Ana": "Boris"})
        });


        it("pairs 2 names together and leaves 1 in timeout when there is an odd number of names", () => {
            const {proposePairing} = getMakePairsComposable(["Ana", "Boris", "Charlie"]);

            const pairs = proposePairing();
            expect(Object.values(pairs)).toContain(TIMEOUT);
        });

        it("pairs everyone that is participating", () => {
            const allNames = ["Ana", "Boris", "Charlie", "Daniel", "Elias", "Felipe", "Gerald"];
            const {proposePairing} = getMakePairsComposable(allNames);

            const pairs = proposePairing();

            const namesPairedUp = [...Object.keys(pairs), ...Object.values(pairs)];
            allNames.forEach((name) => expect(namesPairedUp).toContain(name));
        })

        it("does not pair people who have paired in the past", () => {
            const {savePairing, proposePairing} = getMakePairsComposable(["Ana", "Boris", "Charlie"]);

            savePairing({"Ana": "Boris"});

            for (let i = 0; i < 10000; i++) {
                const pairs = proposePairing();
                expect(pairs["Ana"]).not.toEqual("Boris");
            }
        })

        it("throws error when finding new pairs is impossible", () => {
            const {savePairing, proposePairing} = getMakePairsComposable(["Ana", "Boris"]);
            savePairing({"Ana": "Boris"});

            expect(() => proposePairing()).toThrowError();
        })
    })

    describe("Saving parings", () => {
        it("allows a pairing to be saved", () => {
            const {savePairing, pairingHistory} = getMakePairsComposable(["Ana", "Boris"]);

            savePairing({"Ana": "Boris"});

            expect(pairingHistory.value).toEqual({
                "Ana": ["Boris"],
                "Boris": ["Ana"]
            })
        });

        it("does not allow duplication when saving pairs", () => {
            const {savePairing, pairingHistory} = getMakePairsComposable(["Ana", "Boris"]);

            savePairing({"Ana": "Boris"});
            savePairing({"Ana": "Boris"});

            expect(pairingHistory.value).toEqual({
                "Ana": ["Boris"],
                "Boris": ["Ana"]
            })
        });
    })

    it("Does not save timeout in the history", () => {
        const {savePairing, pairingHistory} = getMakePairsComposable(["Ana", "Boris", "Charlie"]);

        savePairing({"Ana": "Boris", "Charlie": TIMEOUT});

        expect(pairingHistory.value).toEqual({
            "Ana": ["Boris"],
            "Boris": ["Ana"]
        })
    });
});
