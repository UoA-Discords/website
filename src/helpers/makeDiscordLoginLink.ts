import { v4 as uuid } from 'uuid';

const SCOPES = [`identify`];

/** Makes a Discord OAuth2 authorization link to initiate the Discord login process. */
export function makeDiscordLoginLink(clientId: string, redirectUri: string): { link: string; state: string } {
    const state = uuid();

    const params = new URLSearchParams();
    params.set(`response_type`, `code`);
    params.set(`client_id`, clientId);
    params.set(`state`, state);
    params.set(`redirect_uri`, redirectUri);
    params.set(`prompt`, `consent`);
    params.set(`scope`, SCOPES.join(` `));

    return { link: `https://discord.com/api/v10/oauth2/authorize?${params.toString()}`, state };
}
