import React, { useContext } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { FooterItem } from './FooterItem';
import { SettingsContext, UserSessionContext } from '../../contexts';
import { ProfilePicture } from '../ProfilePicture';
import { DiscordIcon } from '../../images';

import GitHubIcon from '@mui/icons-material/GitHub';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import CodeIcon from '@mui/icons-material/Code';
import ArticleIcon from '@mui/icons-material/Article';

export const Footer: React.FC = () => {
    const { settings, sessionData } = useContext(SettingsContext);
    const { loggedInUser } = useContext(UserSessionContext);

    return (
        <Paper
            sx={{
                width: '100vw',
                p: 2,
                mt: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            square
        >
            <Grid container spacing={2} sx={{ pb: 2 }} justifyContent="space-around" alignItems="center">
                <FooterItem type="internal" href="/" icon={<HomeIcon color="disabled" />} label="Home" />
                <FooterItem type="internal" href="/info" icon={<ArticleIcon color="disabled" />} label="Info" />
                {loggedInUser !== null ? (
                    <FooterItem
                        type="internal"
                        href={`/users/${loggedInUser.user._id}`}
                        icon={
                            <ProfilePicture type="full" user={loggedInUser.user} size={24} style={{ color: 'gray' }} />
                        }
                        label="Profile"
                    />
                ) : (
                    <FooterItem
                        type="external"
                        href={sessionData.oAuthLink}
                        icon={<DiscordIcon fill="gray" width={24} height={24} />}
                        label="Login"
                        title="Login with Discord"
                        additionalLinkProps={{ target: '_self' }}
                    />
                )}
                <FooterItem
                    type="internal"
                    href="/settings"
                    icon={<SettingsIcon color="disabled" />}
                    label="Settings"
                />
                <FooterItem
                    href={`${settings.serverUrl}/api-docs`}
                    icon={<CodeIcon color="disabled" />}
                    label="API"
                    type="external"
                    title="View our registry API documentation"
                />

                <FooterItem
                    href="https://github.com/UoA-Discords/website"
                    icon={<GitHubIcon color="disabled" />}
                    label="Source"
                    type="external"
                    title="View the source code for this website"
                />
            </Grid>
            <Typography
                textAlign="center"
                color="gray"
                title="This doesn't mean anything, it just looks official"
                gutterBottom
            >
                UoA Discords {new Date().getFullYear()} © NachoToast
            </Typography>
            <Typography textAlign="center" color="gray" title="This does mean something">
                Not affiliated with Discord or the University of Auckland.
            </Typography>
        </Paper>
    );
};
