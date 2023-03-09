import { createContext } from 'react';
import { defaultUserDictionaryContext } from './UserDictionaryDefaults';

export * from './UserDictionaryDefaults';
export * from './UserDictionaryTypes';

export const UserDictionaryContext = createContext(defaultUserDictionaryContext);
