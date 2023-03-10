import { Paper, Stack, styled } from '@mui/material';

export const HeaderContainer = styled(Paper)(() => ({
    width: '100vw',
    margin: 0,
    padding: '0.5em 0',
}));

export const HeaderItemList = styled(Stack)(() => ({
    marginLeft: '1rem',
    marginRight: '1rem',
    overflowX: 'auto',
}));

export const SiteLogo = styled('img')(() => ({
    height: '165.04',
    width: '226px',
    position: 'absolute',
    right: '12.8rem',
    top: '0.4rem',
    zIndex: 1,
    justifySelf: 'flex-end',
}));
