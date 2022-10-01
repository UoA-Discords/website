import { getAveragePortionOnline } from './getAveragePortionOnline';

describe(`getAveragePortionOnline`, () => {
    it(`calculates known values`, () => {
        expect(getAveragePortionOnline([[0, 1]])).toBe(0);
        expect(getAveragePortionOnline([[1, 2]])).toBe(0.5);

        expect(
            getAveragePortionOnline([
                [0, 1],
                [1, 2],
                [2, 3],
            ]),
        ).toBe((1 / 2 + 2 / 3) / 3);

        expect(
            getAveragePortionOnline([
                [0, 1],
                [0, 1],
                [0, 1],
                [1, 1],
            ]),
        ).toBe(1 / 4);

        expect(
            getAveragePortionOnline([
                [100, 100],
                [50, 50],
            ]),
        ).toBe(1);
    });

    it(`throws an error if memberCountHistory is empty`, () => {
        try {
            getAveragePortionOnline([]);
            // eslint-disable-next-line jest/no-jasmine-globals
            fail(`Should have thrown an error`);
        } catch (e) {
            //
        }
    });
});
