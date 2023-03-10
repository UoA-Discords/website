import { Typography, Stack } from '@mui/material';
import { FC } from 'react';
import { Page } from '../../Page.styled';
import { HomeButton, LoginButton } from '../../components/Buttons';

export const NotLoggedInPage: FC = () => (
    <Page>
        <Typography variant="h3" gutterBottom>
            Not Logged In
        </Typography>
        <Typography color="text.secondary" textAlign="center">
            You must be logged in to access this page.
        </Typography>
        <Stack direction="row" sx={{ mt: 3 }} spacing={2}>
            <HomeButton size="large" />
            <LoginButton size="large" />
        </Stack>
    </Page>
);
