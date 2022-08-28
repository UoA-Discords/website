import { Fade, Grow, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Header.css';

import tempLogo from '../../images/tempLogo.png';

import DiscordLoginButton from '../Buttons/DiscordLogin';
import { useSiteLogin } from '../../hooks/useSiteLogin';
import DiscordAccountButton from '../Buttons/DiscordAccount';

const Header = () => {
    const { loginResponse } = useSiteLogin();

    const theme = useTheme();

    const hideLogo = useMediaQuery(theme.breakpoints.down(`md`));
    const hideText = useMediaQuery(theme.breakpoints.down(`sm`));

    const [logoHover, setLogoHover] = useState(false);

    return (
        <Paper id="header" elevation={0} square>
            <Stack direction="row" alignItems="center" spacing={3} sx={{ ml: `1rem`, mr: `1rem` }}>
                <Link to="/" id="siteName">
                    <Typography>UOA</Typography>
                    <Typography>DISCORDS</Typography>
                    <Typography>.COM</Typography>
                </Link>
                <div style={{ flexGrow: loginResponse ? `unset` : 1 }}>
                    {!hideText && (
                        <Link to="/" style={{ textDecoration: `none`, color: `inherit` }}>
                            <Typography variant="h3" id="siteTitle">
                                UoA Discords
                            </Typography>
                        </Link>
                    )}
                    {!hideText && (
                        <Fade in timeout={{ enter: theme.transitions.duration.enteringScreen * 4 }}>
                            <Typography sx={{ color: `gray` }}>
                                Your catalogue for the University of Auckland's Discord servers.
                            </Typography>
                        </Fade>
                    )}
                </div>
                {loginResponse ? <DiscordAccountButton loginResponse={loginResponse} /> : <DiscordLoginButton />}
            </Stack>
            {!hideLogo && (
                <Grow in={!logoHover}>
                    <img
                        id="logo"
                        src={tempLogo}
                        alt="Site logo"
                        onMouseOver={() => setLogoHover(true)}
                        onMouseLeave={() => setLogoHover(false)}
                    />
                </Grow>
            )}
        </Paper>
    );
};

export default Header;
