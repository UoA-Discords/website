import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import PublishIcon from '@mui/icons-material/Publish';
import { Button, CircularProgress, Divider, Link, Paper, Stack, Typography } from '@mui/material';
import { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '../../Page.styled';
import { api } from '../../api';
import { HomeButton } from '../../components/Buttons';
import { ErrorDisplayer } from '../../components/ErrorDisplayer';
import { PermissionEditor } from '../../components/PermissionEditor';
import { PermissionList } from '../../components/PermissionList';
import { PermissionsLog } from '../../components/PermissionLog';
import { ProfilePicture } from '../../components/ProfilePicture';
import { RelativeTimeString } from '../../components/RelativeTimeString';
import { ServerUploader } from '../../components/ServerUploader/ServerUploader';
import {
    LocationDataContext,
    MainStateContext,
    SettingsContext,
    UserDictionaryContext,
    UserSessionContext,
} from '../../contexts';
import { useCanEdit } from '../../hooks/useCanEdit';
import { useCanUpload } from '../../hooks/useCanUpload';
import { ServerStatus } from '../../types/Server/ServerStatus';
import { ServerStatusAction } from '../../types/Server/ServerStatusAction';
import { User } from '../../types/User';
import { ProfileAccordion, ProfileAccordionDetails, ProfileAccordionSummary } from './ProfilePage.styled';

const TrueProfilePage: FC<{
    user: User<'HideIP' | 'ShowIP'>;
    onUpdate: (newUser: User<'HideIP' | 'ShowIP'>) => void;
}> = ({ user, onUpdate }) => {
    const {
        discord: { username, discriminator },
    } = user;

    const { settings } = useContext(SettingsContext);
    const { loggedInUser, requestLogout } = useContext(UserSessionContext);
    const { setLatestError } = useContext(MainStateContext);

    const [isIpVisible, setIsIpVisible] = useState(false);

    const [isPermissionEditorOpen, setIsPermissionEditorOpen] = useState(false);
    const [isServerUploaderOpen, setIsServerUploaderOpen] = useState(false);

    const isSelf = useMemo(() => loggedInUser?.user._id === user._id, [loggedInUser?.user._id, user._id]);

    const totalNumSubmissions = useMemo(
        () => Object.values(user.submissions).reduce((a, b) => a + b, 0),
        [user.submissions],
    );

    const totalNumActions = useMemo(() => Object.values(user.actions).reduce((a, b) => a + b, 0), [user.actions]);

    const canEdit = useCanEdit(user);
    const canUpload = useCanUpload();

    const handleLogout = useCallback(() => {
        requestLogout().catch((error) => {
            setLatestError(error);
        });
    }, [requestLogout, setLatestError]);

    return (
        <Page maxWidth="xs">
            <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                    <ProfilePicture user={user} />
                    <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {username}#{discriminator}
                        <br />
                        <span style={{ color: 'gray' }}>{user._id}</span>
                    </Typography>
                </Stack>
                <Stack direction="column">
                    <Typography title={new Date(user.metaData.registered).toUTCString()} textAlign="center">
                        Registered {new Date(user.metaData.registered).toLocaleDateString('en-NZ')}{' '}
                        <RelativeTimeString color="gray" time={user.metaData.registered} inBrackets />
                    </Typography>

                    <Typography title={new Date(user.metaData.lastLoginOrRefresh).toUTCString()} textAlign="center">
                        Last Seen {new Date(user.metaData.lastLoginOrRefresh).toLocaleDateString('en-NZ')}{' '}
                        <RelativeTimeString color="gray" time={user.metaData.lastLoginOrRefresh} inBrackets />
                    </Typography>

                    {user.metaData.latestIp !== null && (
                        <Typography textAlign="center">
                            Latest IP{' '}
                            {isIpVisible ? (
                                user.metaData.latestIp
                            ) : (
                                <Link
                                    component="span"
                                    underline="hover"
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => setIsIpVisible(true)}
                                >
                                    click to reveal
                                </Link>
                            )}
                        </Typography>
                    )}
                </Stack>

                <Paper>
                    <PermissionList
                        sx={{ p: 1 }}
                        permissions={user.permissions}
                        showAll={settings.showAllPermissions}
                    />
                </Paper>

                {totalNumSubmissions + totalNumActions > 0 && (
                    <ProfileAccordion>
                        <ProfileAccordionSummary>
                            <Typography>View Stats ({totalNumSubmissions + totalNumActions})</Typography>
                        </ProfileAccordionSummary>
                        <ProfileAccordionDetails>
                            <Stack direction="row" spacing={1} alignItems="flex-start">
                                <table style={{ flexGrow: 1 }}>
                                    <thead>
                                        <tr>
                                            <th colSpan={3}>Submissions ({totalNumSubmissions})</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(user.submissions).map((e) => {
                                            const status: ServerStatus = Number(e);
                                            return (
                                                <tr key={e}>
                                                    <td>{ServerStatus[status]}</td>
                                                    <td>{user.submissions[status]}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <Divider flexItem orientation="vertical" />
                                <table style={{ flexGrow: 1 }}>
                                    <thead>
                                        <tr>
                                            <th colSpan={2}>Actions ({totalNumActions})</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(user.actions).map((e) => {
                                            const status: ServerStatusAction = Number(e);
                                            return (
                                                <tr key={e}>
                                                    <td>{ServerStatusAction[status]}</td>
                                                    <td>{user.actions[status]}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </Stack>
                        </ProfileAccordionDetails>
                    </ProfileAccordion>
                )}

                {user.permissionsLog.length > 0 && (
                    <ProfileAccordion>
                        <ProfileAccordionSummary>
                            <Typography>View Log ({user.permissionsLog.length})</Typography>
                        </ProfileAccordionSummary>
                        <ProfileAccordionDetails>
                            <PermissionsLog log={user.permissionsLog} latestPermissions={user.permissions} />
                        </ProfileAccordionDetails>
                    </ProfileAccordion>
                )}

                {canUpload && isSelf && (
                    <>
                        <ServerUploader onClose={() => setIsServerUploaderOpen(false)} open={isServerUploaderOpen} />
                        <Button
                            variant="outlined"
                            color="success"
                            startIcon={<PublishIcon />}
                            onClick={() => setIsServerUploaderOpen(true)}
                        >
                            Upload Server
                        </Button>
                    </>
                )}

                {canEdit && (
                    <>
                        <PermissionEditor
                            targetUser={user}
                            onClose={() => setIsPermissionEditorOpen(false)}
                            isOpen={isPermissionEditorOpen}
                            onSuccess={onUpdate}
                        />
                        <Button
                            variant="outlined"
                            color="info"
                            startIcon={<EditIcon />}
                            onClick={() => setIsPermissionEditorOpen(true)}
                        >
                            Edit Permissions
                        </Button>
                    </>
                )}

                {isSelf && (
                    <Button variant="outlined" color="warning" startIcon={<LogoutIcon />} onClick={handleLogout}>
                        Logout
                    </Button>
                )}
            </Stack>
        </Page>
    );
};

export const ProfilePage: FC = () => {
    const { settings } = useContext(SettingsContext);
    const { loggedInUser, updateUser } = useContext(UserSessionContext);
    const { latestError, setLatestError, setGlobalErrorDisplayType } = useContext(MainStateContext);
    const { addIdsToDictionary, updateUserInDictionary } = useContext(UserDictionaryContext);
    const { setLocationData } = useContext(LocationDataContext);

    const { id } = useParams();

    const [resolvedUser, setResolvedUser] = useState<User<'HideIP' | 'ShowIP'> | null>(null);

    const handleUpdate = useCallback(
        (updatedUser: User<'HideIP' | 'ShowIP'>) => {
            if (updatedUser._id === loggedInUser?.user._id) {
                updateUser(updatedUser);
            }
            setResolvedUser(updatedUser);
            updateUserInDictionary(updatedUser);
        },
        [loggedInUser?.user._id, updateUser, updateUserInDictionary],
    );

    useEffect(() => {
        if (loggedInUser?.user._id !== undefined && loggedInUser.user._id === id) {
            return setLocationData('Your Profile', [
                { to: '/users', text: 'Users' },
                { to: `/users/${id}`, text: loggedInUser.user.discord.username },
            ]);
        }

        setLocationData(
            resolvedUser?.discord.username ? `${resolvedUser.discord.username}'s Profile` : 'User Profile',
            [
                { to: '/users', text: 'Users' },
                { to: `/users/${id ?? '???'}`, text: resolvedUser?.discord.username ?? id ?? '???' },
            ],
        );
    }, [
        id,
        loggedInUser?.user._id,
        loggedInUser?.user.discord.username,
        resolvedUser?.discord.username,
        setLocationData,
    ]);

    useEffect(() => {
        setGlobalErrorDisplayType(resolvedUser !== null ? 'dialog' : 'inline');

        return () => {
            setGlobalErrorDisplayType('dialog');
            setLatestError(null);
        };
    }, [resolvedUser, setGlobalErrorDisplayType, setLatestError]);

    // user resolving
    useEffect(() => {
        // don't try fetching a user if no ID is specified
        if (id === undefined) return;

        // don't try fetching a user if we've already fetched them
        if (resolvedUser?._id === id) return;

        // make the resolved user the logged in user if their IDs match
        if (id === loggedInUser?.user._id) {
            setResolvedUser(loggedInUser.user);
            return;
        }

        const controller = new AbortController();

        api.getUserById(
            {
                baseURL: settings.serverUrl,
                siteToken: loggedInUser?.siteAuth,
                controller,
                rateLimitBypassToken: settings.rateLimitBypassToken,
            },
            id,
        )
            .then((res) => {
                setResolvedUser(res);
            })
            .catch((error) => {
                setLatestError(error);
            });

        return () => {
            setLatestError(null);
            controller.abort();
        };
    }, [
        id,
        loggedInUser?.siteAuth,
        loggedInUser?.user,
        resolvedUser?._id,
        setLatestError,
        settings.rateLimitBypassToken,
        settings.serverUrl,
    ]);

    // relevant user fetching
    useEffect(() => {
        if (resolvedUser === null) return;

        try {
            addIdsToDictionary(resolvedUser.permissionsLog.map((e) => e.by));
        } catch (error) {
            setLatestError(error);
        }
    }, [addIdsToDictionary, resolvedUser, setLatestError]);

    if (id === undefined) {
        return (
            <Page>
                <Typography variant="h2">Error</Typography>
                <Typography color="lightcoral" gutterBottom>
                    The URL seems to be invalid.
                </Typography>
                <Typography variant="subtitle2" color="gray">
                    How did you get here?
                </Typography>
                <HomeButton sx={{ mt: 2 }} size="large" />
            </Page>
        );
    }

    if (latestError !== null && resolvedUser === null) {
        return (
            <Page maxWidth="sm">
                <ErrorDisplayer inline />
            </Page>
        );
    }

    if (resolvedUser === null) {
        return (
            <Page>
                <Typography variant="h2">Loading</Typography>
                <Typography variant="subtitle2" color="gray">
                    Fetching profile data...
                </Typography>
                <CircularProgress size={60} sx={{ mt: 3 }} />
            </Page>
        );
    }

    return <TrueProfilePage user={resolvedUser} onUpdate={handleUpdate} />;
};
