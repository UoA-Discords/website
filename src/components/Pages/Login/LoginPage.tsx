import { Fade, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSearchParams } from 'react-router-dom';
import { config } from '../../../config';
import { LoginResponse, useSiteLogin } from '../../../hooks/useSiteLogin';
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
        axios
            .request<Omit<LoginResponse, `issuedAt`>>({
                method: `post`,
                url: `${config.serverUrl}/discord/login`,
                signal: controller.signal,
                data: {
                    code,
                    redirect_uri: config.redirectURI,
                },
            })
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
    }, [authStage, clearOAuthState, oauth_state, searchParams, setUserData]);

    switch (authStage) {
        case AuthStages.Loading:
            return <Loading />;
        case AuthStages.Errored:
            return <Errored error={error} />;
        case AuthStages.CSRF:
            return <CSRF />;
        default:
            return (
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
            );
    }
};

export default LoginPage;
