import { DiscordIdString, ISOString } from '../Utility';
import { UserPermissions } from './UserPermissions';

/** Information about a change in permissions of a user. */
export interface UserChangeRecord {
    oldUserPermissions: UserPermissions;
    by: DiscordIdString;
    at: ISOString;
    reason: string | null;
}
