import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
    Button,
    Fade,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
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
import { UserSortOptions } from '../../types/User/UserSortOptions';
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
    const [searchTerm, setSearchTerm] = useState('');
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

    const searchElement = useMemo(
        () => (
            <TextField
                variant="standard"
                size="small"
                placeholder="Search users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <IconButton onClick={() => setSearchParams({ ...searchParams, searchTerm })}>
                            <SearchIcon htmlColor="gray" />
                        </IconButton>
                    ),
                }}
            />
        ),
        [searchParams, searchTerm],
    );

    const paginationElement = useMemo(
        () => (
            <TablePagination
                component="div"
                sx={{ alignSelf: 'flex-start', flexGrow: 1 }}
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

    const setSortOption = useCallback(
        (sortOption: UserSortOptions) => {
            const isAlready =
                searchParams.sortBy === sortOption ||
                (searchParams.sortBy === undefined && sortOption === UserSortOptions.Id);

            if (isAlready && (searchParams.sortDirection === 'asc' || searchParams.sortDirection === undefined)) {
                searchParams.sortDirection = 'desc';
            } else searchParams.sortDirection = 'asc';

            setSearchParams({ ...searchParams, sortBy: sortOption });
        },
        [searchParams],
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

    useEffect(() => {
        if (searchTerm === '' && searchParams.searchTerm !== undefined) {
            delete searchParams.searchTerm;
            setSearchParams({ ...searchParams });
        }
    }, [searchParams, searchTerm]);

    return (
        <Page>
            {controlElement}

            <Stack
                direction="row-reverse"
                justifyContent="flex-start"
                alignItems="center"
                sx={{ width: '100%', pl: 1 }}
            >
                {paginationElement}
                {searchElement}
            </Stack>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={
                                        searchParams.sortBy === UserSortOptions.Id || searchParams.sortBy === undefined
                                    }
                                    direction={searchParams.sortDirection === 'desc' ? 'asc' : 'desc'}
                                    onClick={() => setSortOption(UserSortOptions.Id)}
                                >
                                    User
                                </TableSortLabel>
                            </TableCell>
                            {isRevealingIps && <TableCell>IP</TableCell>}
                            <TableCell>Permissions</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={searchParams.sortBy === UserSortOptions.Registered}
                                    direction={searchParams.sortDirection === 'desc' ? 'asc' : 'desc'}
                                    onClick={() => setSortOption(UserSortOptions.Registered)}
                                >
                                    Registered
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={searchParams.sortBy === UserSortOptions.LastLoginOrRefresh}
                                    direction={searchParams.sortDirection === 'desc' ? 'asc' : 'desc'}
                                    onClick={() => setSortOption(UserSortOptions.LastLoginOrRefresh)}
                                >
                                    Last Seen
                                </TableSortLabel>
                            </TableCell>
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
