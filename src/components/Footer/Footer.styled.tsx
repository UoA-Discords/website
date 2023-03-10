import { Paper, styled } from '@mui/material';

export const FooterContainer = styled(Paper)(({ theme }) => ({
    width: '100vw',
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));
