import { ServerStatus } from '../Server/ServerStatus';
import { ServerStatusAction } from '../Server/ServerStatusAction';
import { DiscordIdString, ISOString } from '../Utility';
import { UserChangeRecord } from './UserChangeRecord';
import { UserPermissions } from './UserPermissions';

/** Shape of a user in our database. */
export interface User<TPrivacy extends 'ShowIP' | 'HideIP' = 'ShowIP'> {
    /** This is underscored to show that it is used as a document index in MongoDB. */
    _id: DiscordIdString;

    /** Discord user data, this can get outdated since we only re-check it on login and refresh. */
    discord: {
        username: string;

        discriminator: string;

        avatar: string | null;
    };

    permissions: UserPermissions;

    metaData: {
        /** These are never shown to anyone besides {@link UserPermissions.Owner Owners} for administration purposes. */
        latestIp: TPrivacy extends 'ShowIP' ? string : string | null;

        registered: ISOString;

        lastLoginOrRefresh: ISOString;
    };

    /** ID of their favourited server, if they have one. */
    favouriteServer: DiscordIdString | null;

    /**
     * Number of servers this user has submitted to the registry, categorized by their current status.
     *
     * For instance, if the user has made 2 applications and 1 got accepted, this would have the value of:
     * ```ts
     * {
     *     [ServerStatus.Pending]: 1,
     *     [ServerStatus.Accepted]: 1,
     *     // ...rest
     * }
     * ```
     */
    submissions: Record<ServerStatus, number>;

    /**
     * Total number of administrative actions this user has made for servers.
     *
     * For instance, if the user withdrew, reinstated, and then again withdrew a server, this would have the value of:
     * ```ts
     * {
     *     [ServerStatusAction.Withdraw]: 2,
     *     [ServerStatusAction.Reinstate]: 1,
     *     // ...rest
     * }
     * ```
     */
    actions: Record<ServerStatusAction, number>;

    /** Ordered from newest to oldest. */
    permissionsLog: UserChangeRecord[];
}
