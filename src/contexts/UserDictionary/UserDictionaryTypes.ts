import { User } from '../../types/User';
import { DiscordIdString } from '../../types/Utility';

export interface IUserDictionaryContext {
    addIdsToDictionary: (userIds: DiscordIdString[]) => Promise<void>;

    getUser: (id: DiscordIdString) => User<'HideIP' | 'ShowIP'> | null;
}
