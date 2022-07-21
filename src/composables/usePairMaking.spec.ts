import usePairMaking, {TIMEOUT} from "@/composables/usePairMaking";

describe("Use Pair Making", () => {
    beforeEach(() => {
        localStorage.clear();
        const {names, pairingHistory} = usePairMaking();
        names.value = [];
        pairingHistory.value = {};
    })

    it("Starts with an empty list", () => {
        const {names} = usePairMaking();

        expect(names.value).toEqual([]);
    });

    it("Allows a new name to be added to the list", () => {
        const {names, addNewNameToList} = usePairMaking();
        addNewNameToList("Boris");
        expect(names.value).toContain("Boris");
    });

    describe("Data persistence", () => {
        it("Stores the names in Local Storage", () => {
            const {names, addNewNameToList} = usePairMaking();
            addNewNameToList("Boris");

            expect(localStorage.getItem("names")).toEqual(JSON.stringify(names.value));
            expect(localStorage.getItem("names")).toContain("Boris");
        });

        it("Retrieves names from Local Storage automatically upon instantiation", () => {
            const namesInLocalStorage = ["Ana", "Boris", "Clara"];
            localStorage.setItem("names", JSON.stringify(namesInLocalStorage));

            const {names} = usePairMaking();

            namesInLocalStorage.forEach(nameInLocalStorage => expect(names.value).toContain(nameInLocalStorage));
        });

        it("Stores the pairingHistory in Local Storage", () => {
            const namesInLocalStorage = ["Ana", "Boris"];
            localStorage.setItem("names", JSON.stringify(namesInLocalStorage));
            const {savePairing, pairingHistory} = usePairMaking();
            savePairing({"Ana": "Boris"});

            expect(localStorage.getItem("pairingHistory")).toEqual(JSON.stringify(pairingHistory.value));
        });

        it("Retrieves pairingHistory from Local Storage automatically upon instantiation", () => {
            localStorage.setItem("pairingHistory", JSON.stringify({
                "Ana": ["Boris"],
                "Boris": ["Ana"]
            }));

            const {pairingHistory} = usePairMaking();
            expect(pairingHistory.value).toEqual({
                "Ana": ["Boris"],
                "Boris": ["Ana"]
            })
        });
    })

    it("Prevents duplicated names", () => {
        const {names, addNewNameToList} = usePairMaking();

        addNewNameToList("Boris");

        expect(() => addNewNameToList("Boris")).toThrowError("Each name must be unique.")
        expect(names.value).toHaveLength(1);
    })

    it("Allows a name to be deleted", () => {
        const {names, addNewNameToList, deleteName} = usePairMaking();
        addNewNameToList("Boris");
        deleteName("Boris");

        expect(names.value).toHaveLength(0);
    })

    describe("Propose Pairing", () => {
        it("returns empty when there are no names", () => {
            const {proposePairing} = usePairMaking();

            expect(proposePairing()).toEqual({})
        });

        it("pairs 2 names together", () => {
            const namesInLocalStorage = ["Ana", "Boris"];
            localStorage.setItem("names", JSON.stringify(namesInLocalStorage));
            const {proposePairing} = usePairMaking();

            expect(proposePairing()).toEqual({"Ana": "Boris"})
        });


        it("pairs 2 names together and leaves 1 in timeout when there is an odd number of names", () => {
            const namesInLocalStorage = ["Ana", "Boris", "Charlie"];
            localStorage.setItem("names", JSON.stringify(namesInLocalStorage));
            const {proposePairing} = usePairMaking();

            const pairs = proposePairing();
            expect(Object.values(pairs)).toContain(TIMEOUT);
        });

        it("pairs everyone that is participating", () => {
            const namesInLocalStorage = ["Ana", "Boris", "Charlie", "Daniel", "Elias", "Felipe", "Gerald"];
            localStorage.setItem("names", JSON.stringify(namesInLocalStorage));
            const {proposePairing} = usePairMaking();
            const pairs = proposePairing();

            const namesPairedUp = [...Object.keys(pairs), ...Object.values(pairs)];
            namesInLocalStorage.forEach((name) => expect(namesPairedUp).toContain(name));
        })

        it("does not pair people who have paired in the past", () => {
            const namesInLocalStorage = ["Ana", "Boris", "Charlie"];
            localStorage.setItem("names", JSON.stringify(namesInLocalStorage));
            const {savePairing, proposePairing} = usePairMaking();
            savePairing({"Ana": "Boris"});

            for (let i = 0; i < 10000; i++) {
                const pairs = proposePairing();
                expect(pairs["Ana"]).not.toEqual("Boris");
            }
        })

        it("throws error when finding new pairs is impossible", () => {
            const namesInLocalStorage = ["Ana", "Boris"];
            localStorage.setItem("names", JSON.stringify(namesInLocalStorage));
            const {savePairing, proposePairing} = usePairMaking();
            savePairing({"Ana": "Boris"});

            expect(() => proposePairing()).toThrowError();
        })
    })

    describe("Saving parings", () => {
        it("allows a pairing to be saved", () => {
            const namesInLocalStorage = ["Ana", "Boris"];
            localStorage.setItem("names", JSON.stringify(namesInLocalStorage));
            const {savePairing, pairingHistory} = usePairMaking();

            savePairing({"Ana": "Boris"});

            expect(pairingHistory.value).toEqual({
                "Ana": ["Boris"],
                "Boris": ["Ana"]
            })
        });

        it("does not allow duplication when saving pairs", () => {
            const namesInLocalStorage = ["Ana", "Boris"];
            localStorage.setItem("names", JSON.stringify(namesInLocalStorage));
            const {savePairing, pairingHistory} = usePairMaking();

            savePairing({"Ana": "Boris"});
            savePairing({"Ana": "Boris"});

            expect(pairingHistory.value).toEqual({
                "Ana": ["Boris"],
                "Boris": ["Ana"]
            })
        });
    })


    it("Does not save timeout in the history", () => {
        const namesInLocalStorage = ["Ana", "Boris", "Charlie"];
        localStorage.setItem("names", JSON.stringify(namesInLocalStorage));
        const {savePairing, pairingHistory} = usePairMaking();

        savePairing({"Ana": "Boris", "Charlie": TIMEOUT});

        expect(pairingHistory.value).toEqual({
            "Ana": ["Boris"],
            "Boris": ["Ana"]
        })
    });
})
