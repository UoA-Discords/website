import { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getAveragePortionOnline } from '../helpers/statHelpers/getAveragePortionOnline';
import { getAverageChangeInMemberCount } from '../helpers/statHelpers/getAverageChangeInMemberCount';
import { getAllEntries } from '../redux/slices/entryManager';
import { getPercentRanking } from '../helpers/statHelpers/getPercentRanking';

/** Object containing statistics about featured and approved entries.  */
export interface EntryStats {
    /** Average portion of total member count online for each server. */
    averagePortionOnline: number[];

    /** Average change in total member count for each server. */
    averageChangeInMemberCount: number[];

    /** Net change in member count for each server. */
    netChangeInMemberCount: number[];

    /** Total member count for each server. */
    totalMemberCount: number[];
}

export function useEntryStats() {
    const allEntries = useSelector(getAllEntries);

    const stats = useMemo<EntryStats>(() => {
        const entries = Object.values(allEntries);

        const averagePercentageOnline = [];

        const averageChangeInMemberCount = [];
        const netChangeInMemberCount = [];
        const totalMemberCount = [];

        for (const { memberCountHistory } of entries) {
            if (memberCountHistory.length > 0) {
                totalMemberCount.push(memberCountHistory.at(-1)![1]);
                averagePercentageOnline.push(getAveragePortionOnline(memberCountHistory));

                if (memberCountHistory.length > 1) {
                    averageChangeInMemberCount.push(getAverageChangeInMemberCount(memberCountHistory));

                    netChangeInMemberCount.push(memberCountHistory.at(-1)![1] - memberCountHistory[0][1]);
                }
            }
        }

        averagePercentageOnline.sort((a, b) => a - b);
        averageChangeInMemberCount.sort((a, b) => a - b);
        netChangeInMemberCount.sort((a, b) => a - b);
        totalMemberCount.sort((a, b) => a - b);

        return {
            averagePortionOnline: averagePercentageOnline,
            averageChangeInMemberCount,
            netChangeInMemberCount,
            totalMemberCount,
        };
    }, [allEntries]);

    const getRanking = useCallback(
        (k: keyof EntryStats, v: number) => {
            return getPercentRanking(v, stats[k]);
        },
        [stats],
    );

    return { ...stats, getRanking };
}
