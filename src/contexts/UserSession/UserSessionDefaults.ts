import { notImplementedFunction } from '../defaultFillers';
import { IUserSessionContext } from './UserSessionTypes';

export const defaultUserSessionContext: IUserSessionContext = {
    loggedInUser: null,
    requestLogin: notImplementedFunction,
    requestRefresh: notImplementedFunction,
    requestLogout: notImplementedFunction,
    updateUser: notImplementedFunction,
};
