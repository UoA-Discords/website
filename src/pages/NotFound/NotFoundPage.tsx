import React, { useContext, useEffect } from 'react';
import { Link, Typography } from '@mui/material';
import { ExternalLink, InternalLink } from '../../components/Links';
import { LocationDataContext } from '../../contexts/LocationData';
import { Page } from '../../Page.styled';

export const NotFoundPage: React.FC = () => {
    const { setLocationData } = useContext(LocationDataContext);

    useEffect(() => {
        setLocationData('Not Found', [{ to: '/???', text: '???' }]);
    }, [setLocationData]);

    return (
        <Page>
            <Typography variant="h2" textAlign="center" gutterBottom>
                Not Found
            </Typography>
            <Typography textAlign="center">
                The page you were looking for does not exist,{' '}
                <InternalLink to="/">
                    <Link component="span" underline="hover">
                        click here
                    </Link>
                </InternalLink>{' '}
                to go back home.
                <br />
                <br />
                Alternatively,{' '}
                <ExternalLink href="https://www.google.com/search?q=grass&tbm=isch" title="Some grass will do you good">
                    <Link component="span" underline="hover">
                        touch grass
                    </Link>
                </ExternalLink>
                .
            </Typography>
        </Page>
    );
};
