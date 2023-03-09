import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import {
    defaultSettings,
    ISettingsContext,
    Settings,
    SettingsContext,
    SettingsControllers,
    SettingsSessionData,
} from '../../contexts';
import { generateSessionData, getLocalSettings, saveLocalSettings } from './SettingsHelpers';

export const SettingsContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(getLocalSettings);

    const sessionData = useMemo<SettingsSessionData>(
        () => generateSessionData(settings.discordApplicationId, settings.redirectUri),
        // this will cause the Discord OAuth2 link to regenerate if the application ID or redirect URI changes
        [settings.discordApplicationId, settings.redirectUri],
    );

    // save any settings changes to local storage
    useEffect(() => saveLocalSettings(settings), [settings]);

    const setValue = useCallback<SettingsControllers['setValue']>(
        (k, v) => setSettings({ ...settings, [k]: v }),
        [settings],
    );

    const resetValue = useCallback<SettingsControllers['resetValue']>(
        (k) => setSettings({ ...settings, [k]: defaultSettings[k] }),
        [settings],
    );

    const finalValue = useMemo<ISettingsContext>(
        () => ({ settings, settingsControllers: { setValue, resetValue }, sessionData }),
        [sessionData, settings, resetValue, setValue],
    );

    return <SettingsContext.Provider value={finalValue}>{children}</SettingsContext.Provider>;
};
