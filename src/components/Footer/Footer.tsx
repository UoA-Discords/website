import ArticleIcon from '@mui/icons-material/Article';
import CodeIcon from '@mui/icons-material/Code';
import GitHubIcon from '@mui/icons-material/GitHub';
import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import { Grid, Typography } from '@mui/material';
import { FC, useContext, useMemo } from 'react';
import { SettingsContext, UserSessionContext } from '../../contexts';
import { hasPermissions } from '../../helpers/hasPermissions';
import { DiscordIcon } from '../../images';
import { UserPermissions } from '../../types/User/UserPermissions';
import { ProfilePicture } from '../ProfilePicture';
import { FooterContainer } from './Footer.styled';
import { FooterItem } from './FooterItem';

export const Footer: FC = () => {
    const { settings, sessionData } = useContext(SettingsContext);
    const { loggedInUser } = useContext(UserSessionContext);

    const canViewUsers = useMemo(
        () =>
            loggedInUser?.user.permissions !== undefined &&
            hasPermissions(loggedInUser.user.permissions, UserPermissions.ManageUsers),
        [loggedInUser?.user.permissions],
    );

    return (
        <FooterContainer square>
            <Grid container spacing={2} sx={{ pb: 2 }} justifyContent="space-around" alignItems="center">
                <FooterItem type="internal" href="/" icon={<HomeIcon color="disabled" />} label="Home" />
                <FooterItem type="internal" href="/info" icon={<ArticleIcon color="disabled" />} label="Info" />

                {canViewUsers && (
                    <FooterItem type="internal" href="/users" icon={<GroupsIcon color="disabled" />} label="Users" />
                )}

                {loggedInUser !== null ? (
                    <FooterItem
                        type="internal"
                        href={`/users/${loggedInUser.user._id}`}
                        icon={<ProfilePicture user={loggedInUser.user} size={24} style={{ color: 'gray' }} />}
                        label="Profile"
                    />
                ) : (
                    <FooterItem
                        type="external"
                        href={sessionData.oAuthLink}
                        icon={<DiscordIcon fill="gray" width={24} height={24} />}
                        label="Login"
                        additionalLinkProps={{ title: 'Login with Discord', target: '_self' }}
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
                    additionalLinkProps={{ title: 'View our registry API documentation' }}
                />

                <FooterItem
                    href="https://github.com/UoA-Discords/website"
                    icon={<GitHubIcon color="disabled" />}
                    label="Source"
                    type="external"
                    additionalLinkProps={{ title: 'View the source code for this website' }}
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
        </FooterContainer>
    );
};
