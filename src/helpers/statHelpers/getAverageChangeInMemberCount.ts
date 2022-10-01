import { FullEntry, EntryStates } from '../../shared/Types/Entries';

/**
 * Calculates the average change in total member count of a server.
 *
 *
 * @throws Throws an error if the `memberCountHistory` of the given entry contains less than 2 entries.
 */
export function getAverageChangeInMemberCount(
    memberCountHistory: FullEntry<Exclude<EntryStates, EntryStates.Pending>>[`memberCountHistory`],
): number {
    const memberCountChanges = memberCountHistory
        .map(([_, total], i) => total - memberCountHistory[i - 1]?.[1] ?? 0)
        .slice(1);

    return memberCountChanges.reduce((prev, next) => prev + next) / memberCountChanges.length;
}
