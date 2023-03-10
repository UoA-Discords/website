import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
    Button,
    Fade,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from '@mui/material';
import { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Page } from '../../Page.styled';
import { api } from '../../api';
import {
    LocationDataContext,
    MainStateContext,
    SettingsContext,
    UserDictionaryContext,
    UserSessionContext,
} from '../../contexts';
import { hasPermissions } from '../../helpers/hasPermissions';
import { WithPagination } from '../../types/Page';
import { GetAllUsersParams } from '../../types/Searching/GetAllUsersParams';
import { User } from '../../types/User';
import { UserPermissions } from '../../types/User/UserPermissions';
import { DiscordIdString } from '../../types/Utility';
import { MissingPermissionsPage, NotLoggedInPage } from '../Common';
import { UserRow, UserRowSkeleton } from './UserRow';

const TrueUsersPage: FC = () => {
    const { settings } = useContext(SettingsContext);
    const { setLatestError } = useContext(MainStateContext);
    const { loggedInUser } = useContext(UserSessionContext);
    const { addIdsToDictionary, addUsersToDictionary, updateUserInDictionary } = useContext(UserDictionaryContext);

    const [searchParams, setSearchParams] = useState<GetAllUsersParams>({ page: 0, perPage: 20 });
    const [latestFetchResult, setLatestFetchResult] = useState<WithPagination<User<'HideIP' | 'ShowIP'>>>();
    const [isRevealingIps, setIsRevealingIps] = useState(false);
    const [loading, setLoading] = useState(false);

    const canShowIps = useMemo(
        () => loggedInUser !== null && hasPermissions(loggedInUser.user.permissions, UserPermissions.Owner),
        [loggedInUser],
    );

    const handleUpdate = useCallback(
        (updatedUser: User<'HideIP' | 'ShowIP'>) => {
            if (latestFetchResult === undefined) return;

            const newUsers = [...latestFetchResult.items];
            newUsers[newUsers.findIndex((e) => e._id === updatedUser._id)] = updatedUser;

            setLatestFetchResult({ items: newUsers, totalItemCount: latestFetchResult.totalItemCount });
            updateUserInDictionary(updatedUser);
        },
        [latestFetchResult, updateUserInDictionary],
    );

    const paginationElement = useMemo(
        () => (
            <Fade in={latestFetchResult !== undefined}>
                <TablePagination
                    component="div"
                    sx={{ alignSelf: 'flex-start' }}
                    labelRowsPerPage="Users per page"
                    rowsPerPageOptions={[20, 50, 100]}
                    count={latestFetchResult?.totalItemCount ?? 0}
                    rowsPerPage={searchParams.perPage}
                    page={searchParams.page}
                    onPageChange={(_e, newPage) => setSearchParams({ ...searchParams, page: newPage })}
                    onRowsPerPageChange={(e) =>
                        setSearchParams({ ...searchParams, page: 0, perPage: parseInt(e.target.value) })
                    }
                />
            </Fade>
        ),
        [latestFetchResult, searchParams],
    );

    const fetchUsers = useCallback(
        (controller: AbortController) => {
            if (loggedInUser?.siteAuth === undefined) return;

            setLoading(true);

            api.searchUsers(
                {
                    baseURL: settings.serverUrl,
                    siteToken: loggedInUser.siteAuth,
                    controller,
                    rateLimitBypassToken: settings.rateLimitBypassToken,
                },
                searchParams,
            )
                .then(setLatestFetchResult)
                .catch(setLatestError)
                .finally(() => setLoading(false));
        },
        [loggedInUser?.siteAuth, searchParams, setLatestError, settings.rateLimitBypassToken, settings.serverUrl],
    );

    const controlElement = useMemo(
        () => (
            <Stack direction="row" alignSelf="flex-end" spacing={1}>
                <Button
                    variant="outlined"
                    onClick={() => fetchUsers(new AbortController())}
                    disabled={latestFetchResult === undefined}
                    startIcon={<RefreshIcon />}
                >
                    Refresh
                </Button>
                {canShowIps && (
                    <Fade in={latestFetchResult !== undefined}>
                        <Button
                            variant="outlined"
                            onClick={(e) => setIsRevealingIps(!isRevealingIps)}
                            startIcon={isRevealingIps ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        >
                            {isRevealingIps ? 'Hide' : 'Reveal'} IPs
                        </Button>
                    </Fade>
                )}
            </Stack>
        ),
        [canShowIps, fetchUsers, isRevealingIps, latestFetchResult],
    );

    useEffect(() => {
        if (latestFetchResult === undefined) return;

        addUsersToDictionary(latestFetchResult.items);
        addIdsToDictionary(
            latestFetchResult.items.reduce<DiscordIdString[]>(
                (acc, cur) => [...acc, ...cur.permissionsLog.map((e) => e.by)],
                [],
            ),
        );
    }, [addIdsToDictionary, addUsersToDictionary, latestFetchResult]);

    useEffect(() => {
        const controller = new AbortController();

        fetchUsers(controller);

        return () => {
            controller.abort();
        };
    }, [fetchUsers]);

    return (
        <Page>
            {controlElement}

            {paginationElement}

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            {isRevealingIps && <TableCell>IP</TableCell>}
                            <TableCell>Permissions</TableCell>
                            <TableCell>Registered</TableCell>
                            <TableCell>Last Seen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {latestFetchResult === undefined || loading ? (
                            new Array(searchParams.perPage)
                                .fill(0)
                                .map((_e, i) => <UserRowSkeleton key={i} isRevealingIps={isRevealingIps} />)
                        ) : (
                            <>
                                {latestFetchResult.items.map((e) => (
                                    <UserRow
                                        key={e._id}
                                        user={e}
                                        isRevealingIps={isRevealingIps}
                                        onUpdate={handleUpdate}
                                    />
                                ))}
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {paginationElement}
        </Page>
    );
};

export const UsersPage: FC = () => {
    const { loggedInUser } = useContext(UserSessionContext);
    const { setLocationData } = useContext(LocationDataContext);

    const canView = useMemo(
        () => loggedInUser !== null && hasPermissions(loggedInUser.user.permissions, UserPermissions.ManageUsers),
        [loggedInUser],
    );

    useEffect(() => {
        setLocationData('Users', [{ to: '/users', text: 'Users' }]);
    }, [setLocationData]);

    if (loggedInUser === null) return <NotLoggedInPage />;
    if (!canView) return <MissingPermissionsPage />;

    return <TrueUsersPage />;
};
