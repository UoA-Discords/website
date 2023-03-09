import { useMemo } from 'react';
import { APIUser } from 'discord-api-types/payloads/v10/user';
import { User } from '../types/User';
import { DiscordIdString } from '../types/Utility';

export type AnyDiscordUserReference =
    | DiscordIdString
    | Pick<APIUser, 'id' | 'username' | 'discriminator' | 'avatar'>
    | User<'HideIP' | 'ShowIP'>;

export interface DiscordUserData {
    id: DiscordIdString;
    username: string | null;
    discriminator: string | null;
    avatar: string | null;
}

const isFullUser = (user: Exclude<AnyDiscordUserReference, DiscordIdString>): user is User<'HideIP' | 'ShowIP'> =>
    '_id' in user;

/**
 * Extracts common Discord user data from a variety of possible inputs.
 *
 * This is helpful anywhere where we can encounter Discord ID strings, partial {@link APIUser} objects, or full
 * {@link User} objects as a way of referencing a user.
 */
export function useDiscordUserData(discordUserReference: AnyDiscordUserReference): DiscordUserData {
    const user = useMemo<DiscordUserData>(() => {
        if (typeof discordUserReference === 'string')
            return {
                id: discordUserReference,
                username: null,
                discriminator: null,
                avatar: null,
            };

        if (isFullUser(discordUserReference))
            return {
                id: discordUserReference._id,
                username: discordUserReference.discord.username,
                discriminator: discordUserReference.discord.discriminator,
                avatar: discordUserReference.discord.avatar,
            };

        return {
            id: discordUserReference.id,
            username: discordUserReference.username,
            discriminator: discordUserReference.discriminator,
            avatar: discordUserReference.avatar,
        };
    }, [discordUserReference]);

    return user;
}
