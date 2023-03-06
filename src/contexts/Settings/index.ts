import { createContext } from 'react';
import { defaultSettingsContext } from './Defaults';

export * from './Defaults';
export * from './Types';

export const SettingsContext = createContext(defaultSettingsContext);
