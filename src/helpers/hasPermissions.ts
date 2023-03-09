import { UserPermissions } from '../types/User/UserPermissions';

/** Checks if the set of target permissions contains every one of the required permissions. */
export function hasPermissions(targetPermissions: UserPermissions, requiredPermissions: UserPermissions): boolean {
    return (targetPermissions & requiredPermissions) === requiredPermissions;
}
