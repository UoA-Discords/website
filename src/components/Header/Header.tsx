import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTheme, useMediaQuery, Paper, Stack, Typography, Link, Grow, Breadcrumbs } from '@mui/material';
import { InternalLink } from '../Links';
import { MainStateContext, SettingsContext, UserSessionContext } from '../../contexts';
import { LoginButton } from '../Buttons';
import { ProfilePicture } from '../ProfilePicture';
import { LocationDataContext } from '../../contexts/LocationData';
import './Header.css';

import TransparentBirdLogo from '../../images/TransparentBirdLogo.png';
import { api } from '../../api';

export const Header: React.FC = () => {
    const { loggedInUser } = useContext(UserSessionContext);
    const { title, description } = useContext(LocationDataContext);
    const { setLatestError, setLatestServerResponse } = useContext(MainStateContext);
    const { settings } = useContext(SettingsContext);

    const theme = useTheme();

    const [hasHoveredOverLogo, setHasHoveredOverLogo] = useState(false);

    const shouldHideTextLogo = useMediaQuery(theme.breakpoints.down('sm'));
    const shouldHideLoginOrProfileIcon = useMediaQuery(theme.breakpoints.down('xs'));

    const shouldInitiallyHideLogo = useMediaQuery(theme.breakpoints.down(1100));

    const hideLogo = useMemo(
        () => hasHoveredOverLogo || shouldInitiallyHideLogo,
        [hasHoveredOverLogo, shouldInitiallyHideLogo],
    );

    useEffect(() => {
        const controller = new AbortController();

        api.postRoot({
            baseURL: settings.serverUrl,
            siteToken: undefined,
            controller,
            rateLimitBypassToken: settings.rateLimitBypassToken,
        })
            .then((res) => {
                setLatestServerResponse(res);
            })
            .catch((error) => {
                setLatestError(error);
            });
    }, [setLatestError, setLatestServerResponse, settings.rateLimitBypassToken, settings.serverUrl]);

    return (
        <Paper sx={{ width: '100vw', m: 0, p: '0.5em 0' }} square>
            <Stack direction="row" alignItems="center" spacing={3} sx={{ ml: '1rem', mr: '1rem', overflowX: 'auto' }}>
                {!shouldHideTextLogo && (
                    <InternalLink to="/" id="siteName">
                        <Typography>UOA</Typography>
                        <Typography>DISCORDS</Typography>
                        <Typography>.COM</Typography>
                    </InternalLink>
                )}
                <div style={{ flexGrow: 1 }}>
                    <Typography variant="h3">{title}</Typography>
                    {typeof description === 'string' ? (
                        <Typography color="gray">{description}</Typography>
                    ) : (
                        <Breadcrumbs aria-label="breadcrumb">
                            {description.map(({ to, text }) => (
                                <InternalLink key={text} to={to}>
                                    <Link underline="hover" color="inherit" component="span">
                                        {text}
                                    </Link>
                                </InternalLink>
                            ))}
                        </Breadcrumbs>
                    )}
                </div>
                {!shouldHideLoginOrProfileIcon &&
                    (loggedInUser !== null ? (
                        <InternalLink to={`/users/${loggedInUser.user._id}`} title="Go to your profile page">
                            <ProfilePicture user={loggedInUser.user} />
                        </InternalLink>
                    ) : (
                        <LoginButton />
                    ))}
            </Stack>
            {!shouldInitiallyHideLogo && (
                <Grow in={!hideLogo} style={{ justifySelf: 'flex-end' }}>
                    <img
                        style={{
                            height: '165.04',
                            width: '226px',
                            position: 'absolute',
                            right: '12.8rem',
                            top: '0.4rem',
                            zIndex: 1,
                            justifySelf: 'flex-end',
                        }}
                        src={TransparentBirdLogo}
                        alt="Site logo"
                        onMouseOver={() => setHasHoveredOverLogo(true)}
                    />
                </Grow>
            )}
        </Paper>
    );
};
