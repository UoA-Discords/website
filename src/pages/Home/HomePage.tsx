import React, { useContext, useEffect } from 'react';
import { Typography } from '@mui/material';
import { LocationDataContext } from '../../contexts/LocationData';
import { Page } from '../../Page.styled';
import { MainStateContext } from '../../contexts';

export const HomePage: React.FC = () => {
    const { latestServerResponse } = useContext(MainStateContext);
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
