import { PaginationParams } from '../Page';
import { ServerSortOptions } from '../Server/ServerSortOptions';
import { ServerStatus } from '../Server/ServerStatus';
import { ServerTagSearchOptions } from '../Server/ServerTagSearchOptions';

/** Parameters for the `getAllServers` method. */
export interface GetAllServersParams extends PaginationParams {
    /** How to sort the results, default is by Discord ID. */
    sortBy?: ServerSortOptions;

    /** Order to sort the results in, default is ascending. */
    sortDirection?: 'asc' | 'desc';

    /**
     * If present, will only include servers that have this status.
     *
     * You can use `visible` to include both public and featured servers.
     */
    withStatus?: ServerStatus | 'visible';

    /** If present, will only include servers with these tags. */
    withTags?: ServerTagSearchOptions;

    /** If present, will only include servers whose guild name matches this. */
    searchTerm?: string;
}
