import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../../api';
import {
    GlobalErrorsContext,
    IUserSessionContext,
    SettingsContext,
    UserSession,
    UserSessionContext,
    UserSessionControllers,
} from '../../contexts';
import { getLocalUserSession, saveLocalUserSession } from './Helpers';

export const UserSessionContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { settings } = useContext(SettingsContext);
    const { globalErrorsControllers } = useContext(GlobalErrorsContext);

    const [loggedInUser, setLoggedInUser] = useState<UserSession | null>(getLocalUserSession);

    const [doneInitialRefresh, setDoneInitialRefresh] = useState(false);

    // save any logged in user changes to local storage
    useEffect(() => saveLocalUserSession(loggedInUser), [loggedInUser]);

    const requestLogin = useCallback<UserSessionControllers['requestLogin']>(
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

    const requestRefresh = useCallback<UserSessionControllers['requestRefresh']>(async () => {
        if (loggedInUser?.siteAuth === undefined) throw new Error('Cannot refresh without first being logged in!');

        const response = await api.getRefresh({
            baseURL: settings.serverUrl,
            siteToken: loggedInUser.siteAuth,
            rateLimitBypassToken: settings.rateLimitBypassToken,
        });

        setLoggedInUser({ ...response, setAt: new Date().toISOString(), firstSetAt: loggedInUser.firstSetAt });
    }, [loggedInUser?.firstSetAt, loggedInUser?.siteAuth, settings.rateLimitBypassToken, settings.serverUrl]);

    const requestLogout = useCallback<UserSessionControllers['requestLogout']>(async () => {
        if (loggedInUser?.siteAuth === undefined) throw new Error('Cannot logout without first being logged in!');

        await api.getLogout({
            baseURL: settings.serverUrl,
            siteToken: loggedInUser.siteAuth,
            rateLimitBypassToken: settings.rateLimitBypassToken,
        });

        setLoggedInUser(null);
    }, [loggedInUser?.siteAuth, settings.rateLimitBypassToken, settings.serverUrl]);

    const updateUser = useCallback<UserSessionControllers['updateUser']>(
        (newUser) => {
            if (loggedInUser === null) throw new Error('Cannot logout without first being logged in!');

            setLoggedInUser({ ...loggedInUser, user: newUser });
        },
        [loggedInUser],
    );

    // fetching user data on page load
    useEffect(() => {
        if (doneInitialRefresh || loggedInUser === null) return;

        console.log('[UserSession] Doing initial user fetch on page load...');

        const controller = new AbortController();

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
                globalErrorsControllers.handleError(error);
            });

        setDoneInitialRefresh(true);

        return () => {
            controller.abort();
        };
    }, [doneInitialRefresh, globalErrorsControllers, loggedInUser, settings.rateLimitBypassToken, settings.serverUrl]);

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
                    globalErrorsControllers.handleError(error);
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
        globalErrorsControllers,
        loggedInUser?.discordAuth.expires_in,
        loggedInUser?.setAt,
        requestRefresh,
        settings.maxRefreshMinutes,
        settings.minRefreshSeconds,
    ]);

    const finalValue = useMemo<IUserSessionContext>(
        () => ({
            loggedInUser,
            userControllers: { requestLogin, requestRefresh, requestLogout, updateUser },
        }),
        [loggedInUser, requestLogin, requestLogout, requestRefresh, updateUser],
    );

    return <UserSessionContext.Provider value={finalValue}>{children}</UserSessionContext.Provider>;
};
