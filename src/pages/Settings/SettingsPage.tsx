import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Typography, Grid, useTheme, useMediaQuery } from '@mui/material';
import { defaultSettings, MainStateContext, Settings, SettingsContext } from '../../contexts';
import { Page } from '../../Page.styled';
import { SettingsCog } from './SettingsCog';
import { SettingsItem, SettingsItemTestState } from './SettingsItem';
import { LocationDataContext } from '../../contexts/LocationData';
import { api } from '../../api';
import { CanceledError } from 'axios';

type ChangeCallback<T extends keyof Settings> = (key: T) => (e: React.ChangeEvent<HTMLInputElement>) => void;

export const SettingsPage: React.FC = () => {
    const { setLocationData } = useContext(LocationDataContext);
    const { settings, settingsControllers } = useContext(SettingsContext);
    const { latestServerResponse, setLatestError, setLatestServerResponse } = useContext(MainStateContext);

    const theme = useTheme();

    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const [hideRateLimitToken, setHideRateLimitToken] = useState(true);

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

                if (k === 'serverUrl') setTestApiUrlState(SettingsItemTestState.Available);
                else if (k === 'rateLimitBypassToken') setTestRateLimitState(SettingsItemTestState.Available);
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

    const [testApiUrlState, setTestApiUrlState] = useState(SettingsItemTestState.Available);
    const [testRateLimitState, setTestRateLimitState] = useState(SettingsItemTestState.Available);

    const testApiUrlTitle = useMemo(() => {
        switch (testApiUrlState) {
            case SettingsItemTestState.Available:
                return 'Click to test URL';
            case SettingsItemTestState.InProgress:
                return 'Testing this URL...';
            case SettingsItemTestState.Failed:
                return 'Error occurred';
            case SettingsItemTestState.Succeeded:
                return 'Received expected response';
            default:
                return 'Unrecognized test state';
        }
    }, [testApiUrlState]);

    const testRateLimitTitle = useMemo(() => {
        switch (testRateLimitState) {
            case SettingsItemTestState.Available:
                return 'Click to test token';
            case SettingsItemTestState.InProgress:
                return 'Testing this token...';
            case SettingsItemTestState.Failed:
                return 'Token invalid';
            case SettingsItemTestState.Succeeded:
                return 'Token valid';
            default:
                return 'Unrecognized test state';
        }
    }, [testRateLimitState]);

    useEffect(() => {
        if (testApiUrlState !== SettingsItemTestState.InProgress) return;

        const controller = new AbortController();

        api.postRoot({
            baseURL: settings.serverUrl,
            siteToken: undefined,
            controller,
            rateLimitBypassToken: settings.rateLimitBypassToken,
        })
            .then((res) => {
                setTestApiUrlState(SettingsItemTestState.Succeeded);
                setLatestServerResponse(res);
            })
            .catch((error) => {
                if (setLatestError(error)) setTestApiUrlState(SettingsItemTestState.Failed);
                else setTestApiUrlState(SettingsItemTestState.Available);
            });

        return () => {
            controller.abort();
        };
    }, [setLatestError, setLatestServerResponse, settings.rateLimitBypassToken, settings.serverUrl, testApiUrlState]);

    useEffect(() => {
        if (testRateLimitState !== SettingsItemTestState.InProgress) return;

        const controller = new AbortController();

        api.checkRateLimitResponse({
            baseURL: settings.serverUrl,
            siteToken: undefined,
            controller,
            rateLimitBypassToken: settings.rateLimitBypassToken,
        })
            .then(() => {
                setTestRateLimitState(SettingsItemTestState.Succeeded);
            })
            .catch((error) => {
                if (error instanceof CanceledError) setTestRateLimitState(SettingsItemTestState.Available);
                else setTestRateLimitState(SettingsItemTestState.Failed);
            });

        return () => {
            controller.abort();
        };
    }, [
        setLatestError,
        setLatestServerResponse,
        settings.rateLimitBypassToken,
        settings.serverUrl,
        testRateLimitState,
    ]);

    const handleTestApiUrl = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            if (testApiUrlState === SettingsItemTestState.InProgress) {
                setTestApiUrlState(SettingsItemTestState.Available);
            } else {
                setTestApiUrlState(SettingsItemTestState.InProgress);
            }
        },
        [testApiUrlState],
    );

    const handleTestRateLimit = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            if (testRateLimitState === SettingsItemTestState.InProgress) {
                setTestRateLimitState(SettingsItemTestState.Available);
            } else {
                setTestRateLimitState(SettingsItemTestState.InProgress);
            }
        },
        [testRateLimitState],
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
                    test={{
                        state: testApiUrlState,
                        handleClick: handleTestApiUrl,
                        title: testApiUrlTitle,
                    }}
                />
                <SettingsItem
                    title="Rate limit bypass token for the server registry API."
                    label="Rate Limit Bypass Token"
                    value={settings.rateLimitBypassToken}
                    handleChange={handleTextChange('rateLimitBypassToken')}
                    handleReset={handleReset('rateLimitBypassToken')}
                    isDefault={defaultSettings.rateLimitBypassToken === settings.rateLimitBypassToken}
                    test={{
                        state: testRateLimitState,
                        handleClick: handleTestRateLimit,
                        title: testRateLimitTitle,
                    }}
                    hide={{ hidden: hideRateLimitToken, setHidden: setHideRateLimitToken }}
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
            <Typography color="gray" textAlign="right" sx={{ alignSelf: 'flex-end', justifySelf: 'flex-end' }}>
                Website Version {process.env.REACT_APP_VERSION}
                <br />
                API Version {latestServerResponse?.version ?? 'Unknown'}
            </Typography>
        </Page>
    );
};
