import {RNG} from "@/helpers/RNG";

describe("RNG", () => {
    it("Can generate random numbers between a given range", () => {
        const numbersGiven = new Set<number>();

        for (let i = 0; i < 10000; i++) {
            numbersGiven.add(RNG.randomNumberBetween(0, 2))
        }

        expect([...numbersGiven].sort()).toEqual([0, 1, 2]);
    });

    it("Can return a random element from an array", () => {
        const fruitsGiven = new Set<string>();
        const fruits = ["apple", "banana", "grape"];

        for (let i = 0; i < 10000; i++) {
            fruitsGiven.add(RNG.randomElementInArray(fruits))
        }

        expect([...fruitsGiven].sort()).toEqual(fruits);
    });
})
