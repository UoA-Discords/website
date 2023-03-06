import { createContext } from 'react';
import { defaultLocationDataContext } from './Defaults';

export * from './Defaults';
export * from './Types';

export const LocationDataContext = createContext(defaultLocationDataContext);
