import { createContext } from 'react';
import { defaultLocationDataContext } from './LocationDataDefaults';

export * from './LocationDataDefaults';
export * from './LocationDataTypes';

export const LocationDataContext = createContext(defaultLocationDataContext);
