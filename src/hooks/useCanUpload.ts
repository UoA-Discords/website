import { useContext, useMemo } from 'react';
import { UserSessionContext } from '../contexts';
import { hasPermissions } from '../helpers/hasPermissions';
import { UserPermissions } from '../types/User/UserPermissions';

/** Returns whether the logged in user can upload a new server. */
export function useCanUpload(): boolean {
    const { loggedInUser } = useContext(UserSessionContext);

    const canUpload = useMemo<boolean>(() => {
        // must be logged in to upload
        if (loggedInUser === null) return false;

        // must have the 'Make Applications' permission to upload
        return hasPermissions(loggedInUser.user.permissions, UserPermissions.MakeApplications);
    }, [loggedInUser]);

    return canUpload;
}
