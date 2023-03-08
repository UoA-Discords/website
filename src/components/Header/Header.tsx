import React, { useContext, useMemo, useState } from 'react';
import { useTheme, useMediaQuery, Paper, Stack, Typography, Link, Grow, Breadcrumbs } from '@mui/material';
import { InternalLink } from '../Links';
import { UserSessionContext } from '../../contexts';
import { LoginButton } from '../Buttons';
import { ProfilePicture } from '../ProfilePicture';
import { LocationDataContext } from '../../contexts/LocationData';
import './Header.css';

import TransparentBirdLogo from '../../images/TransparentBirdLogo.png';

export const Header: React.FC = () => {
    const { loggedInUser } = useContext(UserSessionContext);
    const { title, description } = useContext(LocationDataContext);

    const theme = useTheme();

    const [hasHoveredOverLogo, setHasHoveredOverLogo] = useState(false);

    const shouldInitiallyHideLogo = useMediaQuery(theme.breakpoints.down(1100));

    const hideLogo = useMemo(
        () => hasHoveredOverLogo || shouldInitiallyHideLogo,
        [hasHoveredOverLogo, shouldInitiallyHideLogo],
    );

    return (
        <Paper sx={{ width: '100vw', m: 0, p: '0.5em 0' }} square>
            <Stack
                direction="row"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="space-between"
                spacing={3}
                sx={{ ml: '1rem', mr: '1rem' }}
            >
                <InternalLink to="/" id="siteName">
                    <Typography>UOA</Typography>
                    <Typography>DISCORDS</Typography>
                    <Typography>.COM</Typography>
                </InternalLink>
                <div>
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
                <div style={{ flexGrow: 1 }} />
                {loggedInUser !== null ? (
                    <InternalLink to={`/users/${loggedInUser.user._id}`} title="Go to your profile page">
                        <ProfilePicture type="full" user={loggedInUser.user} />
                    </InternalLink>
                ) : (
                    <LoginButton />
                )}
            </Stack>
            {!shouldInitiallyHideLogo && (
                <Grow in={!hideLogo}>
                    <img
                        style={{
                            height: '165.04',
                            width: '226px',
                            position: 'absolute',
                            right: '12.8rem',
                            top: '0.4rem',
                            zIndex: 1,
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
