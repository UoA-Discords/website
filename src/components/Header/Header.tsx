import { Fade, Grow, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import './Header.css';

import tempLogo from '../../images/tempLogo.png';

import DiscordLoginButton from '../DiscordLoginButton';

const Header = () => {
    const theme = useTheme();

    const hideLogo = useMediaQuery(theme.breakpoints.down(`md`));
    const hideText = useMediaQuery(theme.breakpoints.down(`sm`));

    return (
        <Paper id="header" elevation={0} square>
            <Stack direction="row" alignItems="center" spacing={3} sx={{ ml: `1rem`, mr: `1rem` }}>
                <div id="siteName">
                    <Typography>UOA</Typography>
                    <Typography>DISCORDS</Typography>
                    <Typography>.COM</Typography>
                </div>
                <div style={{ flexGrow: 1 }}>
                    {!hideText && <Typography variant="h3">UoA Discords</Typography>}
                    {!hideText && (
                        <Fade in timeout={{ enter: theme.transitions.duration.enteringScreen * 4 }}>
                            <Typography sx={{ color: `gray` }}>
                                Your catalogue for the University of Auckland's Discord servers.
                            </Typography>
                        </Fade>
                    )}
                </div>
                <DiscordLoginButton />
            </Stack>
            {!hideLogo && (
                <Grow in>
                    <img id="logo" src={tempLogo} alt="Site logo" />
                </Grow>
            )}
        </Paper>
    );
};

export default Header;
