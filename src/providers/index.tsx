import React, { ReactNode } from 'react';
import { LocationDataProvider } from './LocationData/LocationDataProvider';
import { MainStateProvider } from './MainState/MainStateProvider';
import { SettingsContextProvider } from './Settings/SettingsProvider';
import { UserSessionContextProvider } from './UserSession/UserSessionProvider';

export const ContextProviders: React.FC<{ children: ReactNode }> = ({ children }) => (
    <SettingsContextProvider>
        <MainStateProvider>
            <UserSessionContextProvider>
                <LocationDataProvider>{children}</LocationDataProvider>
            </UserSessionContextProvider>
        </MainStateProvider>
    </SettingsContextProvider>
);
