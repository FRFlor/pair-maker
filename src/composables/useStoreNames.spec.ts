import useStoreNames from "@/composables/useStoreNames";

describe("useStoreNames", () => {
    beforeEach(() => {
        localStorage.clear();
        const {names, pairingHistory} = useStoreNames();
        names.value = [];
        pairingHistory.value = {};
    })

    it("Starts with an empty list", () => {
        const {names} = useStoreNames();

        expect(names.value).toEqual([]);
    });

    it("Allows a new name to be added to the list", () => {
        const {names, addNewNameToList} = useStoreNames();
        addNewNameToList("Boris");
        expect(names.value).toContain("Boris");
    });

    describe("Data persistence", () => {
        it("Stores the names in Local Storage", () => {
            const {names, addNewNameToList} = useStoreNames();
            addNewNameToList("Boris");

            expect(localStorage.getItem("names")).toEqual(JSON.stringify(names.value));
            expect(localStorage.getItem("names")).toContain("Boris");
        });

        it("Retrieves names from Local Storage automatically upon instantiation", () => {
            const namesInLocalStorage = ["Ana", "Boris", "Clara"];
            localStorage.setItem("names", JSON.stringify(namesInLocalStorage));

            const {names} = useStoreNames();

            namesInLocalStorage.forEach(nameInLocalStorage => expect(names.value).toContain(nameInLocalStorage));
        });
    })

    it("Prevents duplicated names", () => {
        const {names, addNewNameToList} = useStoreNames();

        addNewNameToList("Boris");

        expect(() => addNewNameToList("Boris")).toThrowError("Each name must be unique.")
        expect(names.value).toHaveLength(1);
    })

    it("Allows a name to be deleted", () => {
        const {names, addNewNameToList, deleteName} = useStoreNames();
        addNewNameToList("Boris");
        deleteName("Boris");

        expect(names.value).toHaveLength(0);
    })
})
