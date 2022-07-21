import usePairMaking from "@/composables/usePairMaking";

describe("Use Pair Making", () => {
    beforeEach(() => {
        localStorage.clear();
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

            const {names, addNewNameToList} = usePairMaking();

            namesInLocalStorage.forEach(nameInLocalStorage => expect(names.value).toContain(nameInLocalStorage));
        });

        it("Prevents duplicated names", () => {
            const {names, addNewNameToList} = usePairMaking();

            addNewNameToList("Boris");

            expect(() => addNewNameToList("Boris")).toThrowError("Each name must be unique.")
            expect(names.value).toHaveLength(1);
        })
    })
})

