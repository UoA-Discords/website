import { Fade, Stack, Typography } from '@mui/material';
import { Container } from '@mui/system';
import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { LoginResponse, useSiteLogin } from '../../../hooks/useSiteLogin';
import { getSettings } from '../../../redux/slices/main';
import CSRF from './CSRF';
import Errored from './Errored';
import Loading from './Loading';

enum AuthStages {
    /** Request access token from API. */
    Loading,

    /** State in cookie !== state in URL */
    CSRF,

    /** Non-200 response from API, or invalid URL parameters. */
    Errored,

    /** Login response retrieved successfully, redirecting to home page. */
    Exiting,
}

const LoginPage = () => {
    const [searchParams] = useSearchParams();

    const [authStage, setAuthStage] = useState<AuthStages>(AuthStages.Loading);
    const [error, setError] = useState<unknown>();

    const [{ oauth_state }, , clearOAuthState] = useCookies<`oauth_state`, { oauth_state?: string }>([`oauth_state`]);

    const { setUserData } = useSiteLogin();
    const settings = useSelector(getSettings);

    useEffect(() => {
        if (authStage !== AuthStages.Loading) return;

        const code = searchParams.get(`code`);
        const receivedState = searchParams.get(`state`);

        if (code === null) {
            setAuthStage(AuthStages.Errored);
            setError(
                new Error(
                    `Code is missing from URL, you should be redirected to this page after trying to log in with Discord.\nPlease do not try to access this page directly.`,
                ),
            );
            return;
        }
        if (oauth_state === undefined) {
            setAuthStage(AuthStages.Errored);
            setError(
                new Error(`Expected state is undefined (did you come here via the "Login With Discord" button?).`),
            );
            return;
        }
        if (receivedState === null) {
            setAuthStage(AuthStages.Errored);
            setError(
                new Error(
                    `State is missing from URL, you should be redirected to this page after trying to log in with Discord.\nPlease do not try to access this page directly.`,
                ),
            );
            return;
        }
        if (oauth_state !== receivedState) {
            setAuthStage(AuthStages.CSRF);
            clearOAuthState(`oauth_state`);
        }

        const controller = new AbortController();

        const requestObject: AxiosRequestConfig = {
            method: `post`,
            baseURL: settings.serverUrl,
            url: `/discord/login`,
            signal: controller.signal,
            data: {
                code,
                redirect_uri: settings.redirectURI,
            },
            headers: {},
        };

        if (settings.rateLimitBypassToken !== undefined) {
            requestObject.headers![`RateLimit-Bypass-Token`] = settings.rateLimitBypassToken;
        }

        axios
            .request<Omit<LoginResponse, `issuedAt`>>(requestObject)
            .then((res) => {
                setUserData({ ...res.data, issuedAt: Date.now() });
                clearOAuthState(`oauth_state`);
                setAuthStage(AuthStages.Exiting);
                window.open(`/`, `_self`);
            })
            .catch((e) => {
                setAuthStage(AuthStages.Errored);
                setError(e);
            });

        return () => {
            controller.abort();
        };
    }, [
        authStage,
        clearOAuthState,
        oauth_state,
        searchParams,
        setUserData,
        settings.rateLimitBypassToken,
        settings.redirectURI,
        settings.serverUrl,
    ]);

    return (
        <Container id="app">
            {authStage === AuthStages.Loading ? (
                <Loading />
            ) : authStage === AuthStages.Errored ? (
                <Errored error={error} />
            ) : authStage === AuthStages.CSRF ? (
                <CSRF />
            ) : (
                <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{ height: `100%`, position: `relative` }}
                    spacing={3}
                >
                    <Typography variant="h3">Login Complete</Typography>
                    <Typography>Now exiting the page, adios!</Typography>
                    <Fade in>
                        <img src="https://i.redd.it/m308pw9b09831.jpg" alt="adios" />
                    </Fade>
                </Stack>
            )}
        </Container>
    );
};

export default LoginPage;
