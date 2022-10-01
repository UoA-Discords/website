/**
 * Returns information about the {@link value}'s ranking in the given {@link dataset}.
 * @param {number} value Value to rank in array.
 * @param {number[]} dataset Sorted array of values to rank from.
 * @param {string} dataDirection Whether the "top" % is the left or the array
 * (ascending) or the right of the array (descending).
 */
export function getPercentRanking(
    value: number,
    dataset: number[],
    dataDirection: `ascending` | `descending` = `ascending`,
): { rank: number; rankAsString: string; shortRankAsString: string } {
    // start at index 0, i.e. top 100%
    let currentIndex = 0;

    const len = dataset.length - 1;

    while (currentIndex < len && dataset[currentIndex] < value) {
        currentIndex++;
    }

    const finalRanking = dataDirection === `ascending` ? dataset.length - currentIndex : currentIndex;

    const rank = Math.floor((100 * finalRanking) / dataset.length);

    return {
        rank,
        rankAsString: rank > 50 ? `bottom ${100 - rank || 1}%` : `top ${rank || 1}%`,
        shortRankAsString: rank > 50 ? `${100 - rank || 1}%` : `${rank || 1}%`,
    };
}
