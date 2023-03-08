import { Container, Fade, LinearProgress, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HomeButton, LoginButton } from '../../components/Buttons';
import { MainStateContext, SettingsContext, UserSessionContext } from '../../contexts';
import { LocationDataContext } from '../../contexts/LocationData';
import { Page } from '../../Page.styled';

import adios from '../../images/adios.jpg';
import { ErrorDisplayer } from '../../components/ErrorDisplayer';

enum AuthStage {
    /** Requesting an access token from the server registry API. */
    Loading,

    /** State in settings context !== state in URL. */
    CSRF,

    /** Non-200 response received from API, or invalid URL parameters. */
    Errored,

    /** Login response retrieved successfully, redirecting to home page. */
    Exiting,
}

export const LoginPage: React.FC = () => {
    const {
        sessionData: { state: localState },
    } = useContext(SettingsContext);
    const { setLocationData } = useContext(LocationDataContext);
    const { requestLogin } = useContext(UserSessionContext);
    const { setLatestError, setGlobalErrorDisplayType } = useContext(MainStateContext);

    const [searchParams] = useSearchParams();

    const [authStage, setAuthStage] = useState(AuthStage.Loading);
    const [error, setError] = useState('');

    useEffect(() => {
        setLocationData('Login', [{ to: '/login', text: 'Login' }]);
    }, [setLocationData]);

    useEffect(() => {
        setGlobalErrorDisplayType('inline');

        return () => {
            setGlobalErrorDisplayType('dialog');
            setLatestError(null);
        };
    }, [setGlobalErrorDisplayType, setLatestError]);

    useEffect(() => {
        if (authStage !== AuthStage.Loading) return;

        const code = searchParams.get('code');
        const receivedState = searchParams.get('state');

        if (code === null) {
            setAuthStage(AuthStage.Errored);
            setError(
                'Code is missing from the URL, you should be redirected to this page after trying to log in with Discord.\nPlease do not try to access this page directly.',
            );
            return;
        }

        if (receivedState === null) {
            setAuthStage(AuthStage.Errored);
            setError(
                'State is missing from the URL, you should be redirected to this page after trying to log in with Discord.\nPlease do not try to access this page directly.',
            );
            return;
        }

        setError('');

        if (receivedState !== localState) {
            setAuthStage(AuthStage.CSRF);
            return;
        }

        requestLogin(code)
            .then(() => {
                setAuthStage(AuthStage.Exiting);
                window.open('/', '_self');
            })
            .catch((error) => {
                setLatestError(error);
                setAuthStage(AuthStage.Errored);
            });
    }, [authStage, setLatestError, localState, searchParams, requestLogin]);

    switch (authStage) {
        case AuthStage.Loading:
            return (
                <Page>
                    <Typography variant="h3" textAlign="center">
                        Loading
                    </Typography>
                    <Typography color="text.secondary" gutterBottom textAlign="center">
                        This shouldn't take too long...
                    </Typography>
                    <div style={{ width: 'min(60%, 400px)' }}>
                        <LinearProgress />
                    </div>
                </Page>
            );
        case AuthStage.CSRF:
            return (
                <Page maxWidth="sm">
                    <Stack spacing={2} alignItems="center">
                        <Typography variant="h3" textAlign="center" color="#FF3333">
                            CSRF
                        </Typography>
                        <Typography color="text.secondary" textAlign="center">
                            A Cross Site Request Forgery may have taken place, meaning your request was intercepted.
                        </Typography>
                        <Typography color="text.secondary" textAlign="center">
                            You can try to login again, but make sure it's safe to do so.
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <HomeButton size="large" />
                            <LoginButton size="large" color="warning" />
                        </Stack>
                    </Stack>
                </Page>
            );
        case AuthStage.Errored:
            return (
                <Page maxWidth="sm">
                    <Stack spacing={2} alignItems="center">
                        {error !== '' ? (
                            <>
                                <Typography variant="h3" textAlign="center" color="orange">
                                    Error
                                </Typography>
                                <Typography color="text.secondary" textAlign="center">
                                    {error}
                                </Typography>
                            </>
                        ) : (
                            <Container maxWidth="sm">
                                <ErrorDisplayer inline />
                            </Container>
                        )}

                        <Stack direction="row" spacing={2}>
                            <HomeButton size="large" />
                            <LoginButton size="large" />
                        </Stack>
                    </Stack>
                </Page>
            );
        case AuthStage.Exiting:
            return (
                <Page maxWidth="sm">
                    <Stack spacing={2} alignItems="center">
                        <Typography variant="h3" textAlign="center">
                            Login Complete
                        </Typography>
                        <Typography color="text.secondary" textAlign="center">
                            Redirecting you to the homepage, adiós!
                        </Typography>
                        <Fade in>
                            <img src={adios} alt="adios" width={300} />
                        </Fade>
                    </Stack>
                </Page>
            );
    }
};
