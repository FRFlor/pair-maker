export class RNG {

    static randomNumberBetween(low: number, high: number): number {
        return Math.floor(Math.random() * (high + 1 - low) + low);
    }

    static randomElementInArray<T>(arrayOfElements: T[]): T {
        return arrayOfElements[this.randomNumberBetween(0, arrayOfElements.length - 1)];
    }
}
