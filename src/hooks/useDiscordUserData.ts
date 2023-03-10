import { APIUser } from 'discord-api-types/payloads/v10/user';
import { useContext, useMemo } from 'react';
import { UserDictionaryContext } from '../contexts';
import { User } from '../types/User';
import { DiscordIdString } from '../types/Utility';

type DiscordUserData = {
    id: DiscordIdString;
    username: string | null;
    discriminator: string | null;
    avatar: string | null;

    /**
     * This flag is used to signify that this object comes from the {@link useDiscordUserData} hook, differentiating it
     * from the {@link APIUser} object, which would otherwise have the same properties.
     */
    _converted: true;
};

/** A Discord user reference that can be used in any context where we need to reference a Discord user. */
export type AnyDiscordUserReference =
    | DiscordIdString
    | Pick<APIUser, 'id' | 'username' | 'discriminator' | 'avatar'>
    | User<'HideIP' | 'ShowIP'>
    | DiscordUserData;

const isFullUser = (user: Exclude<AnyDiscordUserReference, DiscordIdString>): user is User<'HideIP' | 'ShowIP'> =>
    '_id' in user;

const isAlreadyDiscordUserData = (user: Exclude<AnyDiscordUserReference, DiscordIdString>): user is DiscordUserData =>
    '_converted' in user;

/**
 * Extracts useful Discord user data from a reference to a user.
 *
 * This is useful since there are many different references for a user, with each one having a different shape.
 */
export function useDiscordUserData(discordUserReference: AnyDiscordUserReference): DiscordUserData {
    const { getUser } = useContext(UserDictionaryContext);

    const convertedUser = useMemo<DiscordUserData>(() => {
        if (typeof discordUserReference === 'string') {
            return {
                id: discordUserReference,
                username: null,
                discriminator: null,
                avatar: null,
                _converted: true,
            };
        }

        if (isAlreadyDiscordUserData(discordUserReference)) return discordUserReference;

        if (isFullUser(discordUserReference)) {
            return {
                id: discordUserReference._id,
                username: discordUserReference.discord.username,
                discriminator: discordUserReference.discord.discriminator,
                avatar: discordUserReference.discord.avatar,
                _converted: true,
            };
        }

        return {
            id: discordUserReference.id,
            username: discordUserReference.username,
            discriminator: discordUserReference.discriminator,
            avatar: discordUserReference.avatar,
            _converted: true,
        };
    }, [discordUserReference]);

    // we assume the user dictionary has more up-to-date information than the current user reference
    // so prefer the user that the user dictionary returns
    const user = useMemo<DiscordUserData>(() => {
        // if converted is true, then this user came from this hook already (elsewhere in the code)
        // so we don't need to do a dictionary lookup again
        if (convertedUser._converted) return convertedUser;

        const encountered = getUser(convertedUser.id);

        if (encountered === null) return convertedUser;

        return {
            id: encountered._id,
            username: encountered.discord.username,
            discriminator: encountered.discord.discriminator,
            avatar: encountered.discord.avatar,
            _converted: true,
        };
    }, [getUser, convertedUser]);

    return user;
}
