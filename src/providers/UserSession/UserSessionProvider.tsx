import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../../api';
import {
    IUserSessionContext,
    MainStateContext,
    SettingsContext,
    UserSession,
    UserSessionContext,
} from '../../contexts';
import { getLocalUserSession, saveLocalUserSession } from './UserSessionHelpers';

export const UserSessionContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { settings } = useContext(SettingsContext);
    const { setLatestError } = useContext(MainStateContext);

    const [loggedInUser, setLoggedInUser] = useState<UserSession | null>(getLocalUserSession);

    const [doneInitialRefresh, setDoneInitialRefresh] = useState(false);

    // save any logged in user changes to local storage
    useEffect(() => saveLocalUserSession(loggedInUser), [loggedInUser]);

    const requestLogin = useCallback<IUserSessionContext['requestLogin']>(
        async (authorizationCode) => {
            const response = await api.postLogin(
                {
                    baseURL: settings.serverUrl,
                    siteToken: undefined,
                    rateLimitBypassToken: settings.rateLimitBypassToken,
                },
                authorizationCode,
                settings.redirectUri,
            );

            const now = new Date().toISOString();
            setLoggedInUser({ ...response, setAt: now, firstSetAt: now });
        },
        [settings.rateLimitBypassToken, settings.redirectUri, settings.serverUrl],
    );

    const requestRefresh = useCallback<IUserSessionContext['requestRefresh']>(async () => {
        if (loggedInUser?.siteAuth === undefined) throw new Error('Cannot refresh without first being logged in!');

        const response = await api.getRefresh({
            baseURL: settings.serverUrl,
            siteToken: loggedInUser.siteAuth,
            rateLimitBypassToken: settings.rateLimitBypassToken,
        });

        setLoggedInUser({ ...response, setAt: new Date().toISOString(), firstSetAt: loggedInUser.firstSetAt });
    }, [loggedInUser?.firstSetAt, loggedInUser?.siteAuth, settings.rateLimitBypassToken, settings.serverUrl]);

    const requestLogout = useCallback<IUserSessionContext['requestLogout']>(async () => {
        if (loggedInUser?.siteAuth === undefined) throw new Error('Cannot logout without first being logged in!');

        await api.getLogout({
            baseURL: settings.serverUrl,
            siteToken: loggedInUser.siteAuth,
            rateLimitBypassToken: settings.rateLimitBypassToken,
        });

        setLoggedInUser(null);
    }, [loggedInUser?.siteAuth, settings.rateLimitBypassToken, settings.serverUrl]);

    const updateUser = useCallback<IUserSessionContext['updateUser']>(
        (newUser) => {
            if (loggedInUser === null) throw new Error('Cannot update user without first being logged in!');

            setLoggedInUser({ ...loggedInUser, user: newUser });
        },
        [loggedInUser],
    );

    // fetching user data on page load
    useEffect(() => {
        if (doneInitialRefresh || loggedInUser === null) return;

        console.log('[UserSession] Doing initial user fetch on page load...');

        const controller = new AbortController();

        let fetchComplete = false;

        api.getSelf({
            baseURL: settings.serverUrl,
            siteToken: loggedInUser.siteAuth,
            controller,
            rateLimitBypassToken: settings.rateLimitBypassToken,
        })
            .then((user) => {
                console.log('[UserSession] Initial fetch successful');
                setLoggedInUser({ ...loggedInUser, user });
            })
            .catch((error) => {
                console.log('[UserSession] Initial fetch failed');
                setLatestError(error);
            })
            .finally(() => {
                fetchComplete = true;
                setDoneInitialRefresh(true);
            });

        return () => {
            if (!fetchComplete) {
                console.log('[UserSession] Aborting initial fetch');
                controller.abort();
            }
        };
    }, [doneInitialRefresh, setLatestError, loggedInUser, settings.rateLimitBypassToken, settings.serverUrl]);

    // scheduling a call to /refresh
    useEffect(() => {
        if (loggedInUser?.discordAuth.expires_in === undefined) return;

        /**
         * The unix timestamp (in milliseconds) for when the discord token expires.
         *
         * This should be the same as the site token, provided our API signed it correctly ;)
         */
        const expiryTimestamp = new Date(loggedInUser.setAt).getTime() + 1_000 * loggedInUser.discordAuth.expires_in;

        const secondsTillExpiry = Math.floor((expiryTimestamp - Date.now()) / 1_000);

        if (secondsTillExpiry < settings.minRefreshSeconds) {
            console.log(
                `[UserSession] Session expires too soon (in ${secondsTillExpiry} seconds, lowest acceptable is ${settings.minRefreshSeconds} seconds)`,
            );

            return void setLoggedInUser(null);
        }

        const minsTillExpiry = Math.floor(secondsTillExpiry / 60);

        const refresh = () =>
            requestRefresh()
                .then(() => {
                    console.log('[UserSession] Background refresh successful');
                })
                .catch((error) => {
                    console.log('[UserSession] Background refresh failed');
                    setLatestError(error);
                });

        if (minsTillExpiry <= settings.maxRefreshMinutes) {
            console.log(
                `[UserSession] Session expires in ${minsTillExpiry} minutes, below the ${settings.maxRefreshMinutes} minute threshold; attempting refresh...`,
            );

            return void refresh();
        }

        const scheduledInMinutes = minsTillExpiry - settings.maxRefreshMinutes;

        console.log(
            `[UserSession] Session expires in ${minsTillExpiry} minutes, will attempt refresh in ${scheduledInMinutes} minutes`,
        );

        const timeout = setTimeout(refresh, scheduledInMinutes * 1_000 * 60);

        return () => {
            clearTimeout(timeout);
        };
    }, [
        setLatestError,
        loggedInUser?.discordAuth.expires_in,
        loggedInUser?.setAt,
        requestRefresh,
        settings.maxRefreshMinutes,
        settings.minRefreshSeconds,
    ]);

    const finalValue = useMemo<IUserSessionContext>(
        () => ({
            loggedInUser,
            requestLogin,
            requestRefresh,
            requestLogout,
            updateUser,
        }),
        [loggedInUser, requestLogin, requestLogout, requestRefresh, updateUser],
    );

    return <UserSessionContext.Provider value={finalValue}>{children}</UserSessionContext.Provider>;
};
