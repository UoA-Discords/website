import { LoginOrSignupResponse } from '../../types/Auth/LoginOrSignupResponse';
import { User } from '../../types/User';
import { ISOString } from '../../types/Utility';

export interface UserSession extends LoginOrSignupResponse {
    setAt: ISOString;
    firstSetAt: ISOString;
}

export interface UserSessionControllers {
    /** Requests the server upgrade an authorization code to an access token. */
    requestLogin(authorizationCode: string): Promise<void>;

    /** Requests the server to fetch another access token. */
    requestRefresh(): Promise<void>;

    /** Requests the server to revoke the current access token. */
    requestLogout(): Promise<void>;

    /** Updates properties of the logged in user, e.g. when they have modified their own permissions. */
    updateUser(updatedUser: User): void;
}

export interface IUserSessionContext {
    /** The currently logged in user. */
    loggedInUser: UserSession | null;

    /** Functions for managing the currently logged in user's session. */
    userControllers: UserSessionControllers;
}
