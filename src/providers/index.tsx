import React, { ReactNode } from 'react';
import { GlobalErrorsContextProvider } from './GlobalErrors/Provider';
import { LocationDataProvider } from './LocationData/Provider';
import { SettingsContextProvider } from './Settings/Provider';
import { UserSessionContextProvider } from './UserSession/Provider';

export const ContextProviders: React.FC<{ children: ReactNode }> = ({ children }) => (
    <SettingsContextProvider>
        <GlobalErrorsContextProvider>
            <UserSessionContextProvider>
                <LocationDataProvider>{children}</LocationDataProvider>
            </UserSessionContextProvider>
        </GlobalErrorsContextProvider>
    </SettingsContextProvider>
);
