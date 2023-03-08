import { createContext } from 'react';
import { defaultMainStateContext } from './MainStateDefaults';

export * from './MainStateDefaults';
export * from './MainStateTypes';

export const MainStateContext = createContext(defaultMainStateContext);
