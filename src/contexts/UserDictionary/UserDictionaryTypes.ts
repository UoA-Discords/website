import { User } from '../../types/User';
import { DiscordIdString } from '../../types/Utility';

export interface IUserDictionaryContext {
    /** Makes an API request to resolve an array of user IDs, and adds them to the dictionary. */
    addIdsToDictionary: (userIds: DiscordIdString[]) => Promise<void>;

    /** Adds already-fetched users to the dictionary. */
    addUsersToDictionary: (users: User<'HideIP' | 'ShowIP'>[]) => void;

    /** Updates an existing user in the dictionary, inserting them if they do not exist. */
    updateUserInDictionary: (updatedUser: User<'HideIP' | 'ShowIP'>) => void;

    /** Gets a user from the dictionary. */
    getUser: (id: DiscordIdString) => User<'HideIP' | 'ShowIP'> | null;
}
