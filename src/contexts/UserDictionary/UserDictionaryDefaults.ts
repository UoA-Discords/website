import { notImplementedFunction } from '../defaultFillers';
import { IUserDictionaryContext } from './UserDictionaryTypes';

export const defaultUserDictionaryContext: IUserDictionaryContext = {
    encounteredUsers: {},
    addIdsToDictionary: notImplementedFunction,
};
