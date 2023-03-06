import { PaginationParams } from '../Page';
import { UserPermissions } from '../User/UserPermissions';
import { UserSortOptions } from '../User/UserSortOptions';
import { DiscordIdString } from '../Utility';

/** Parameters for the `getAllUsers` method. */
export interface GetAllUsersParams extends PaginationParams {
    /** How to sort the results, default is by Discord ID. */
    sortBy?: UserSortOptions;

    /** Order to sort the results in, default is ascending. */
    sortDirection?: 'asc' | 'desc';

    /** If present, will only include users that have these IDs. */
    withIds?: DiscordIdString[];

    /** If present, will only include users that have **all** of these permissions. */
    withPermissions?: UserPermissions;

    /** If present, will only include users whos Discord username matches this. */
    searchTerm?: string;
}
