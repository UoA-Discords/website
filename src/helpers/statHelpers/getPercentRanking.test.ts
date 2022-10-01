import { getPercentRanking } from './getPercentRanking';

describe(`getPercentRanking`, () => {
    it(`handles ascending arrays`, () => {
        const asc100 = new Array(100).fill(0).map((_, i) => i);

        expect(getPercentRanking(-1, asc100).rankAsString).toBe(`bottom 1%`);
        expect(getPercentRanking(0, asc100).rankAsString).toBe(`bottom 1%`);

        expect(getPercentRanking(25, asc100).rankAsString).toBe(`bottom 25%`);

        expect(getPercentRanking(50, asc100).rankAsString).toBe(`top 50%`);

        expect(getPercentRanking(75, asc100).rankAsString).toBe(`top 25%`);

        expect(getPercentRanking(100, asc100).rankAsString).toBe(`top 1%`);
        expect(getPercentRanking(101, asc100).rankAsString).toBe(`top 1%`);
    });

    it(`handles descending arrays`, () => {
        const asc100 = new Array(100).fill(0).map((_, i) => i);

        expect(getPercentRanking(-1, asc100, `descending`).rankAsString).toBe(`top 1%`);
        expect(getPercentRanking(0, asc100, `descending`).rankAsString).toBe(`top 1%`);

        expect(getPercentRanking(25, asc100, `descending`).rankAsString).toBe(`top 25%`);

        expect(getPercentRanking(50, asc100, `descending`).rankAsString).toBe(`top 50%`);

        expect(getPercentRanking(75, asc100, `descending`).rankAsString).toBe(`bottom 25%`);

        expect(getPercentRanking(100, asc100, `descending`).rankAsString).toBe(`bottom 1%`);
        expect(getPercentRanking(101, asc100, `descending`).rankAsString).toBe(`bottom 1%`);
    });

    it(`handles empty arrays`, () => {
        expect(getPercentRanking(0, []).rankAsString).toBe(`top 1%`);
        expect(getPercentRanking(100, []).rankAsString).toBe(`top 1%`);
    });
});
