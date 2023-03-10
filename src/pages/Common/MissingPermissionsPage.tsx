import { Typography } from '@mui/material';
import { FC } from 'react';
import { Page } from '../../Page.styled';
import { HomeButton } from '../../components/Buttons';

export const MissingPermissionsPage: FC = () => (
    <Page>
        <Typography variant="h3" gutterBottom>
            Missing Permissions
        </Typography>
        <Typography color="text.secondary" textAlign="center">
            You do not have permission to access this page.
        </Typography>
        <HomeButton size="large" sx={{ mt: 3 }} />
    </Page>
);
