import { Typography } from '@mui/material';
import { FC, useContext, useEffect } from 'react';
import { Page } from '../../Page.styled';
import { ExternalLinkStyled, InternalLinkStyled } from '../../components/Links';
import { LocationDataContext } from '../../contexts/LocationData';

export const NotFoundPage: FC = () => {
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
                The page you were looking for does not exist, <InternalLinkStyled to="/">click here</InternalLinkStyled>{' '}
                to go back home.
                <br />
                <br />
                Alternatively,{' '}
                <ExternalLinkStyled
                    href="https://www.google.com/search?q=grass&tbm=isch"
                    title="Some grass will do you good"
                >
                    touch grass
                </ExternalLinkStyled>
                .
            </Typography>
        </Page>
    );
};
