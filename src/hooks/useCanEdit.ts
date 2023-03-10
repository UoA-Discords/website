import { useContext, useMemo } from 'react';
import { UserSessionContext } from '../contexts';
import { hasPermissions } from '../helpers/hasPermissions';
import { User } from '../types/User';
import { UserPermissions } from '../types/User/UserPermissions';

/** Returns whether the logged in user can edit the permissions of the target user. */
export function useCanEdit(targetUser: User<'HideIP' | 'ShowIP'>): boolean {
    const { loggedInUser } = useContext(UserSessionContext);

    const canEdit = useMemo(() => {
        // must be logged in to edit permissions
        if (loggedInUser === null) return false;

        // must have the 'Manage Users' permission to edit permissions
        if (!hasPermissions(loggedInUser.user.permissions, UserPermissions.ManageUsers)) return false;

        // can always edit your own permissions
        if (loggedInUser.user._id === targetUser._id) return true;

        // can never edit an owner (excluding yourself)
        if (hasPermissions(targetUser.permissions, UserPermissions.Owner)) return false;

        // only owners can edit admins
        if (hasPermissions(targetUser.permissions, UserPermissions.ManageUsers)) {
            return hasPermissions(loggedInUser.user.permissions, UserPermissions.Owner);
        }

        // otherwise should be valid
        return true;
    }, [loggedInUser, targetUser._id, targetUser.permissions]);

    return canEdit;
}
