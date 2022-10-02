import { EntryStates, FullEntry } from '../../shared/Types/Entries';

/**
 * Calculates the average of portion of members online of a server.
 *
 * @throws Throws an error if the `memberCountHistory` of the given entry is empty.
 */
export function getAveragePortionOnline(
    memberCountHistory: FullEntry<Exclude<EntryStates, EntryStates.Pending>>[`memberCountHistory`],
): number {
    const portionOnline = memberCountHistory.map(([online, total]) => online / (total || 1));

    return portionOnline.reduce((prev, next) => prev + next) / memberCountHistory.length;
}
