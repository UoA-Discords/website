import { v4 as uuid } from 'uuid';
import { config } from '../config';

const SCOPES = [`guilds`, `identify`];

/** Makes a Discord OAuth2 authorization link to initiate the Discord login process. */
export function makeDiscordLoginLink(): { link: string; state: string } {
    const state = uuid();

    const params = new URLSearchParams();
    params.set(`response_type`, `code`);
    params.set(`client_id`, config.discordClientID);
    params.set(`state`, state);
    params.set(`redirect_uri`, config.redirectURI);
    params.set(`prompt`, `consent`);
    params.set(`scope`, SCOPES.join(` `));

    return { link: `https://discord.com/api/v10/oauth2/authorize?${params.toString()}`, state };
}
