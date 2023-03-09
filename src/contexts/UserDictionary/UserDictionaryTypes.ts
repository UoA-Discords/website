import { User } from '../../types/User';
import { DiscordIdString } from '../../types/Utility';

export interface IUserDictionaryContext {
    encounteredUsers: Record<DiscordIdString, User<'HideIP' | 'ShowIP'>>;

    addIdsToDictionary: (userIds: DiscordIdString[]) => Promise<void>;
}
