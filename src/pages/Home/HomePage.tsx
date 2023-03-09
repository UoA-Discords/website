import React, { useContext, useEffect } from 'react';
import { Typography } from '@mui/material';
import { LocationDataContext } from '../../contexts/LocationData';
import { Page } from '../../Page.styled';
import { MainStateContext, SettingsContext } from '../../contexts';
import { api } from '../../api';

export const HomePage: React.FC = () => {
    const { settings } = useContext(SettingsContext);
    const { latestServerResponse, setLatestError, setLatestServerResponse } = useContext(MainStateContext);
    const { setLocationData } = useContext(LocationDataContext);

    useEffect(() => {
        if (latestServerResponse) {
            const { numServers, numUsers } = latestServerResponse;
            setLocationData(
                'UoA Discords',
                `Cataloguing ${numServers.toLocaleString(
                    'en-NZ',
                )} University of Auckland Discord servers (and ${numUsers.toLocaleString('en-NZ')} users).`,
            );
        } else {
            setLocationData('UoA Discords', 'Your catalogue for the various University of Auckland Discord servers.');
        }
    }, [latestServerResponse, setLocationData]);

    useEffect(() => {
        const controller = new AbortController();

        api.postRoot({
            baseURL: settings.serverUrl,
            siteToken: undefined,
            controller,
            rateLimitBypassToken: settings.rateLimitBypassToken,
        })
            .then((res) => {
                setLatestServerResponse(res);
            })
            .catch((error) => {
                setLatestError(error);
            });

        return () => {
            controller.abort();
        };
    }, [setLatestError, setLatestServerResponse, settings.rateLimitBypassToken, settings.serverUrl]);

    return (
        <Page>
            <Typography variant="h1" textAlign="center">
                UoA Discords
            </Typography>
            <Typography variant="subtitle2" color="gray" sx={{ pl: 1, pr: 1, mb: 3 }} textAlign="center">
                Your catalogue for the University of Auckland's various Discord servers.
            </Typography>
            <Typography color="gold">
                Hey there! We're currently undergoing some changes right now, so check back later 👻
            </Typography>
        </Page>
    );
};
