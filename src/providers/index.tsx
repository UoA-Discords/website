import { FC, ReactNode } from 'react';
import { LocationDataProvider } from './LocationData/LocationDataProvider';
import { MainStateProvider } from './MainState/MainStateProvider';
import { SettingsContextProvider } from './Settings/SettingsProvider';
import { UserDictionaryProvider } from './UserDictionary/UserDictionaryProvider';
import { UserSessionContextProvider } from './UserSession/UserSessionProvider';

export const ContextProviders: FC<{ children: ReactNode }> = ({ children }) => (
    <SettingsContextProvider>
        <MainStateProvider>
            <UserSessionContextProvider>
                <UserDictionaryProvider>
                    <LocationDataProvider>{children}</LocationDataProvider>
                </UserDictionaryProvider>
            </UserSessionContextProvider>
        </MainStateProvider>
    </SettingsContextProvider>
);
