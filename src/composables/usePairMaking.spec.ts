import usePairMaking from "@/composables/usePairMaking";

describe("Use Pair Making", () => {
    it("Starts with an empty list", () => {
        const {names} = usePairMaking();

        expect(names).toEqual([]);
    });
})

