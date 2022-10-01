/* eslint-disable jest/no-jasmine-globals */
import { getAverageChangeInMemberCount } from './getAverageChangeInMemberCount';
import { getAveragePortionOnline } from './getAveragePortionOnline';

describe(`getAverageChangeInMemberCount`, () => {
    it(`calculates known values`, () => {
        expect(
            getAverageChangeInMemberCount([
                [0, 0],
                [0, 1],
                [0, 2],
            ]),
        ).toBe(1);

        expect(
            getAverageChangeInMemberCount([
                [0, 0],
                [0, 1], // +1
                [0, 2], // +1
                [0, 1], // - 1
            ]),
        ).toBe(1 / 3);
    });

    it(`throws an error if memberCountHistory.length < 2`, () => {
        try {
            getAveragePortionOnline([]);
            fail(`Should have thrown an error`);
        } catch (e) {
            //
        }

        try {
            getAveragePortionOnline([[123, 123]]);
            fail(`Should have thrown an error`);
        } catch (e) {
            //
        }
    });
});
