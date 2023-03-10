import { useTheme, useMediaQuery, Typography, Link, Grow, Breadcrumbs } from '@mui/material';
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../../api';
import { MainStateContext, SettingsContext, UserSessionContext } from '../../contexts';
import { LocationDataContext } from '../../contexts/LocationData';
import TransparentBirdLogo from '../../images/TransparentBirdLogo.png';
import { LoginButton } from '../Buttons';
import { InternalLink } from '../Links';
import { ProfilePicture } from '../ProfilePicture';
import './Header.css';
import { HeaderContainer, HeaderItemList, SiteLogo } from './Header.styled';

export const Header: FC = () => {
    const { loggedInUser } = useContext(UserSessionContext);
    const { title, description } = useContext(LocationDataContext);
    const { latestError, setLatestError, setLatestServerResponse } = useContext(MainStateContext);
    const { settings } = useContext(SettingsContext);

    const theme = useTheme();

    const [logoHovered, setLogoHovered] = useState(false);

    const siteNameHidden = useMediaQuery(theme.breakpoints.down('sm'));

    const buttonHidden = useMediaQuery(theme.breakpoints.down('xs'));

    const logoInitiallyHidden = useMediaQuery(theme.breakpoints.down(1100));

    const logoHidden = useMemo(() => logoHovered || logoInitiallyHidden, [logoHovered, logoInitiallyHidden]);

    useEffect(() => {
        if (latestError !== null) return;

        const controller = new AbortController();

        api.postRoot({
            baseURL: settings.serverUrl,
            siteToken: undefined,
            controller,
            rateLimitBypassToken: settings.rateLimitBypassToken,
        })
            .then(setLatestServerResponse)
            .catch(setLatestError);
    }, [latestError, setLatestError, setLatestServerResponse, settings.rateLimitBypassToken, settings.serverUrl]);

    return (
        <HeaderContainer square>
            <HeaderItemList direction="row" alignItems="center" spacing={3}>
                {!siteNameHidden && (
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
                {!buttonHidden &&
                    (loggedInUser !== null ? (
                        <InternalLink to={`/users/${loggedInUser.user._id}`} title="Go to your profile page">
                            <ProfilePicture user={loggedInUser.user} />
                        </InternalLink>
                    ) : (
                        <LoginButton />
                    ))}
            </HeaderItemList>
            {!logoInitiallyHidden && (
                <Grow in={!logoHidden} style={{ justifySelf: 'flex-end' }}>
                    <SiteLogo src={TransparentBirdLogo} alt="Site logo" onMouseOver={() => setLogoHovered(true)} />
                </Grow>
            )}
        </HeaderContainer>
    );
};
