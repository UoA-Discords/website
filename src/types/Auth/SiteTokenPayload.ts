import { DiscordIdString } from '../Utility';

/**
 * Shape of the payload that is stored in the body of a site token (a signed JWT).
 *
 * Site tokens are provided in the `Authorization` header of any elevated requests.
 */
export interface SiteTokenPayload {
    /**
     * The Discord user ID of the requester.
     *
     * This can be used to see if they exist in our users database.
     */
    id: DiscordIdString;

    /**
     * The Discord OAuth2 access token of the requester.
     *
     * This is used to make elevated requests to the Discord API on behalf of this user.
     *
     * Since we only require the 'Identify' scope, the only requests we can make are to:
     * - Terminate the current OAuth session (revoke).
     * - Get basic user info (ID, username, profile picture, etc...)
     */
    access_token: string;

    /**
     * The Discord OAuth2 refresh token of the requester.
     *
     * This can be used to extend the user's current OAuth session.
     */
    refresh_token: string;
}
