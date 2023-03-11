import { useContext, useMemo } from 'react';
import { UserSessionContext } from '../contexts';
import { hasPermissions } from '../helpers/hasPermissions';
import { UserPermissions } from '../types/User/UserPermissions';

export function useCanManageUsers() {
    const { loggedInUser } = useContext(UserSessionContext);

    const canManage = useMemo<boolean>(() => {
        // must be logged in to upload
        if (loggedInUser === null) return false;

        // must have the 'Manage Users' permission
        return hasPermissions(loggedInUser.user.permissions, UserPermissions.ManageUsers);
    }, [loggedInUser]);

    return canManage;
}
