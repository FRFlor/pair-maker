import usePairMaking from "@/composables/usePairMaking";

describe("Use Pair Making", () => {
    it("Starts with an empty list", () => {
        const {names} = usePairMaking();

        expect(names.value).toEqual([]);
    });

    it("Allows a new name to be added to the list", () => {
        const {names, addNewNameToList} = usePairMaking();
        addNewNameToList("Boris");
        expect(names.value).toContain("Boris");
    });
})

