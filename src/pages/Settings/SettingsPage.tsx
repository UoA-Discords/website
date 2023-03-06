import React, { useCallback, useContext, useEffect } from 'react';
import { Typography, Grid, useTheme, useMediaQuery } from '@mui/material';
import { defaultSettings, Settings, SettingsContext } from '../../contexts';
import { Page } from '../../Page.styled';
import { SettingsCog } from './SettingsCog';
import { SettingsItem } from './SettingsItem';
import { LocationDataContext } from '../../contexts/LocationData';

type ChangeCallback<T extends keyof Settings> = (key: T) => (e: React.ChangeEvent<HTMLInputElement>) => void;

export const SettingsPage: React.FC = () => {
    const { setLocationData } = useContext(LocationDataContext);
    const { settings, settingsControllers } = useContext(SettingsContext);

    const theme = useTheme();

    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        setLocationData(<span style={{ textAlign: 'center' }}>Settings {!isSmall && <SettingsCog />}</span>, [
            { to: '/settings', text: 'Settings' },
        ]);
    }, [isSmall, setLocationData]);

    const handleTextChange = useCallback<
        ChangeCallback<'discordApplicationId' | 'rateLimitBypassToken' | 'redirectUri' | 'serverUrl'>
    >(
        (k) => {
            return (e) => {
                e.preventDefault();
                settingsControllers.setValue(k, e.target.value);
            };
        },
        [settingsControllers],
    );

    const handleNumberChange = useCallback<ChangeCallback<'maxRefreshMinutes' | 'minRefreshSeconds'>>(
        (k) => {
            return (e) => {
                e.preventDefault();
                const val = Number(e.target.value);
                if (!Number.isNaN(val) && Number.isInteger(val)) {
                    settingsControllers.setValue(k, val);
                }
            };
        },
        [settingsControllers],
    );

    const handleReset = useCallback(
        (k: keyof Settings) => {
            return (e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                settingsControllers.resetValue(k);
            };
        },
        [settingsControllers],
    );

    return (
        <Page maxWidth="lg">
            <Grid container spacing={4} alignItems="center" sx={{ mt: 2 }}>
                <SettingsItem
                    title="Endpoint for the server registry API."
                    label="API URL"
                    value={settings.serverUrl}
                    handleChange={handleTextChange('serverUrl')}
                    handleReset={handleReset('serverUrl')}
                    isDefault={defaultSettings.serverUrl === settings.serverUrl}
                    inputMode="url"
                    // test={{
                    //     state: testApiUrlState,
                    //     handleClick: handleTestApiUrl,
                    //     title: testApiUrlTitles,
                    // }}
                />
                <SettingsItem
                    title="Rate limit bypass token for the server registry API."
                    label="Rate Limit Bypass Token"
                    value={settings.rateLimitBypassToken}
                    handleChange={handleTextChange('rateLimitBypassToken')}
                    handleReset={handleReset('rateLimitBypassToken')}
                    isDefault={defaultSettings.rateLimitBypassToken === settings.rateLimitBypassToken}
                    // test={{
                    //     state: testRateLimitState,
                    //     handleClick: handleTestRateLimit,
                    //     title: testRateLimitTitles,
                    // }}
                    // hide={{ hidden: hideRateLimitToken, setHidden: setHideRateLimitToken }}
                />
                <SettingsItem
                    title="ID of Discord application to use in OAuth."
                    label="Discord Application ID"
                    value={settings.discordApplicationId}
                    handleChange={handleTextChange('discordApplicationId')}
                    handleReset={handleReset('discordApplicationId')}
                    isDefault={defaultSettings.discordApplicationId === settings.discordApplicationId}
                    inputMode="numeric"
                />
                <SettingsItem
                    title="URI to redirect to after login attempt."
                    label="Login Redirect URI"
                    value={settings.redirectUri}
                    handleChange={handleTextChange('redirectUri')}
                    handleReset={handleReset('redirectUri')}
                    isDefault={defaultSettings.redirectUri === settings.redirectUri}
                    inputMode="url"
                />
                <SettingsItem
                    title="Will not try to refresh site token if it expires in less than this many seconds."
                    label="Min Refresh Threshold (Seconds)"
                    value={settings.minRefreshSeconds.toString()}
                    handleChange={handleNumberChange('minRefreshSeconds')}
                    handleReset={handleReset('minRefreshSeconds')}
                    isDefault={defaultSettings.minRefreshSeconds === settings.minRefreshSeconds}
                    inputMode="numeric"
                />
                <SettingsItem
                    title="Will try to refresh site token if it expires in this many minutes or less."
                    label="Max Refresh Threshold (Minutes)"
                    value={settings.maxRefreshMinutes.toString()}
                    handleChange={handleNumberChange('maxRefreshMinutes')}
                    handleReset={handleReset('maxRefreshMinutes')}
                    isDefault={defaultSettings.maxRefreshMinutes === settings.maxRefreshMinutes}
                    inputMode="numeric"
                />
            </Grid>
            <div style={{ flexGrow: 1 }} />
            <Typography color="gray" textAlign="center" sx={{ alignSelf: 'flex-end', justifySelf: 'flex-end' }}>
                Website Version {process.env.REACT_APP_VERSION}
                <br />
                API Version Unknown
            </Typography>
        </Page>
    );
};
