import { notImplementedFunction } from '../defaultFillers';
import { ISettingsContext, Settings, SettingsControllers, SettingsSessionData } from './Types';

export const defaultSettings: Settings = {
    serverUrl: 'https://registry.uoa-discords.com',
    rateLimitBypassToken: '',
    discordApplicationId: '958568584349618227',
    redirectUri: `${window.location.origin}/login`,
    minRefreshSeconds: 30,
    maxRefreshMinutes: 3 * 24 * 60,
};

export const defaultSettingsControllers: SettingsControllers = {
    setValue: notImplementedFunction,
    resetValue: notImplementedFunction,
};

export const defaultSettingsSessionData: SettingsSessionData = {
    state: '',
    oAuthLink: '',
};

export const defaultSettingsContext: ISettingsContext = {
    settings: defaultSettings,
    settingsControllers: defaultSettingsControllers,
    sessionData: defaultSettingsSessionData,
};
