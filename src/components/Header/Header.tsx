import { Fade, Grow, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import './Header.css';

import tempLogo from '../../images/uoadiscbirdopacity.png';

import DiscordLoginButton from '../Buttons/DiscordLogin';
import { useSiteLogin } from '../../hooks/useSiteLogin';
import DiscordAccountButton from '../Buttons/DiscordAccount';
import { useSelector } from 'react-redux';
import { getAllEntries, getDoneInitialLoad, getVisibleEntries } from '../../redux/slices/entryManager';

const Header = () => {
    const allEntries = useSelector(getAllEntries);
    const visibleEntryNames = useSelector(getVisibleEntries);
    const doneInitialLoad = useSelector(getDoneInitialLoad);

    const { loginResponse } = useSiteLogin();

    const theme = useTheme();

    const hideLogo = useMediaQuery(theme.breakpoints.down(1100));
    const hideText = useMediaQuery(theme.breakpoints.down(`sm`));

    const [logoHover, setLogoHover] = useState(false);

    const text = useMemo(() => {
        const numAllEntries = Object.keys(allEntries).length;
        const numVisibleEntries = visibleEntryNames.length;

        if (!doneInitialLoad) {
            return `Your catalogue for the University of Auckland's Discord servers.`;
        }

        if (Object.keys(allEntries).length === visibleEntryNames.length) {
            return `Your catalogue for the ${numAllEntries} University of Auckland's Discord servers.`;
        }

        return `Displaying ${numVisibleEntries} of ${numAllEntries} servers.`;
    }, [allEntries, doneInitialLoad, visibleEntryNames.length]);

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
                            <Typography sx={{ color: `gray` }}>{text}</Typography>
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
