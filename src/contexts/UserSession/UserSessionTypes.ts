import { LoginOrSignupResponse } from '../../types/Auth/LoginOrSignupResponse';
import { User } from '../../types/User';
import { ISOString } from '../../types/Utility';

export interface UserSession extends LoginOrSignupResponse {
    setAt: ISOString;
    firstSetAt: ISOString;
}

export interface IUserSessionContext {
    /** The currently logged in user. */
    loggedInUser: UserSession | null;

    /** Requests the server upgrade an authorization code to an access token. */
    requestLogin(authorizationCode: string): Promise<void>;

    /** Requests the server to fetch another access token. */
    requestRefresh(): Promise<void>;

    /** Requests the server to revoke the current access token. */
    requestLogout(): Promise<void>;

    /** Updates properties of the logged in user, e.g. when they have modified their own permissions. */
    updateUser(updatedUser: User): void;
}
