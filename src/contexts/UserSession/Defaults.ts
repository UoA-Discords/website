import { notImplementedFunction } from '../defaultFillers';
import { IUserSessionContext, UserSessionControllers } from './Types';

export const defaultUserSession = null;

export const defaultUserSessionControllers: UserSessionControllers = {
    requestLogin: notImplementedFunction,
    requestRefresh: notImplementedFunction,
    requestLogout: notImplementedFunction,
    updateUser: notImplementedFunction,
};

export const defaultUserSessionContext: IUserSessionContext = {
    loggedInUser: defaultUserSession,
    userControllers: defaultUserSessionControllers,
};
