import { createContext } from 'react';
import { defaultUserSessionContext } from './Defaults';

export * from './Defaults';
export * from './Types';

export const UserSessionContext = createContext(defaultUserSessionContext);
