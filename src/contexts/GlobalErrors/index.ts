import { createContext } from 'react';
import { defaultGlobalErrorsContext } from './Defaults';

export * from './Defaults';
export * from './Types';

export const GlobalErrorsContext = createContext(defaultGlobalErrorsContext);
