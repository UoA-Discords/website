import React, { ReactNode } from 'react';
import { LocationDataProvider } from './LocationData/LocationDataProvider';
import { MainStateProvider } from './MainState/MainStateProvider';
import { SettingsContextProvider } from './Settings/Provider';
import { UserSessionContextProvider } from './UserSession/Provider';

export const ContextProviders: React.FC<{ children: ReactNode }> = ({ children }) => (
    <SettingsContextProvider>
        <MainStateProvider>
            <UserSessionContextProvider>
                <LocationDataProvider>{children}</LocationDataProvider>
            </UserSessionContextProvider>
        </MainStateProvider>
    </SettingsContextProvider>
);
