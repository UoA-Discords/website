import { useContext, useMemo } from 'react';
import { UserSessionContext } from '../contexts';
import { hasPermissions } from '../helpers/hasPermissions';
import { UserPermissions } from '../types/User/UserPermissions';

export function useCanFeatureServers() {
    const { loggedInUser } = useContext(UserSessionContext);

    const canFeature = useMemo<boolean>(() => {
        // must be logged in to upload
        if (loggedInUser === null) return false;

        // must have the 'Feature' permission
        return hasPermissions(loggedInUser.user.permissions, UserPermissions.Feature);
    }, [loggedInUser]);

    return canFeature;
}
