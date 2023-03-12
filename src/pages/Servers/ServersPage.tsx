import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import {
    TextField,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Collapse,
    MenuItem,
    Select,
} from '@mui/material';
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Page } from '../../Page.styled';
import { api } from '../../api';
import { RefreshButton } from '../../components/Buttons/RefreshButton';
import { StandardPagination } from '../../components/StandardPagination';
import { TagFilterer } from '../../components/TagFilterer';
import {
    UserSessionContext,
    LocationDataContext,
    MainStateContext,
    SettingsContext,
    UserDictionaryContext,
} from '../../contexts';
import { useCanManageServers } from '../../hooks/useCanManageServers';
import { WithPagination } from '../../types/Page';
import { GetAllServersParams } from '../../types/Searching/GetAllServersParams';
import { Server } from '../../types/Server';
import { ServerSortOptions } from '../../types/Server/ServerSortOptions';
import { ServerStatus } from '../../types/Server/ServerStatus';
import { DiscordIdString } from '../../types/Utility';
import { NotLoggedInPage, MissingPermissionsPage } from '../Common';
import { ServerRow, ServerRowSkeleton } from './ServerRow';

const HiddenSelectIcon: FC = () => <></>;

const allStatuses = Object.values(ServerStatus).filter((e): e is ServerStatus => typeof e === 'number');

const TrueServersPage: FC = () => {
    const { settings } = useContext(SettingsContext);
    const { setLatestError } = useContext(MainStateContext);
    const { loggedInUser } = useContext(UserSessionContext);
    const { addIdsToDictionary } = useContext(UserDictionaryContext);

    const containerRef = useRef(null);

    const [searchParams, setSearchParams] = useState<GetAllServersParams>({
        page: 0,
        perPage: 20,
        sortBy: ServerSortOptions.Status,
    });
    const [latestFetchResult, setLatestFetchResult] = useState<WithPagination<Server>>();
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [filterExpanded, setFilterExpanded] = useState(false);

    const handleUpdate = useCallback(
        (updatedServer: Server) => {
            if (latestFetchResult === undefined) return;

            const newServers = [...latestFetchResult.items];
            newServers[newServers.findIndex((e) => e._id === updatedServer._id)] = updatedServer;

            setLatestFetchResult({ items: newServers, totalItemCount: latestFetchResult.totalItemCount });
        },
        [latestFetchResult],
    );

    const fetchServers = useCallback(
        (controller: AbortController) => {
            if (loggedInUser?.siteAuth === undefined) return;

            setLoading(true);

            api.searchServers(
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
        (sortOption: ServerSortOptions) => {
            const isAlready =
                searchParams.sortBy === sortOption ||
                (searchParams.sortBy === undefined && sortOption === ServerSortOptions.Id);

            if (isAlready && (searchParams.sortDirection === 'asc' || searchParams.sortDirection === undefined)) {
                searchParams.sortDirection = 'desc';
            } else searchParams.sortDirection = 'asc';

            setSearchParams({ ...searchParams, sortBy: sortOption, page: 0 });
        },
        [searchParams],
    );

    useEffect(() => {
        if (latestFetchResult === undefined) return;
        addIdsToDictionary(
            latestFetchResult.items.reduce<DiscordIdString[]>(
                (acc, cur) => [...acc, cur.created.by, cur.inviteCreatedBy.id, ...cur.statusLog.map((e) => e.by)],
                [],
            ),
        );
    }, [addIdsToDictionary, latestFetchResult]);

    useEffect(() => {
        const controller = new AbortController();

        fetchServers(controller);

        return () => {
            controller.abort();
        };
    }, [fetchServers]);

    useEffect(() => {
        if (searchTerm === '' && searchParams.searchTerm !== undefined) {
            delete searchParams.searchTerm;
            setSearchParams({ ...searchParams, page: 0 });
        }
    }, [searchParams, searchTerm]);

    return (
        <Page>
            <Stack gap={2} sx={{ width: '100%', mt: 1 }} alignItems="center" ref={containerRef}>
                <RefreshButton
                    doneInitialFetch={!!latestFetchResult}
                    active={loading}
                    onClick={() => fetchServers(new AbortController())}
                    sx={{ alignSelf: 'flex-end' }}
                    containerRef={containerRef}
                />

                <Stack
                    direction="row-reverse"
                    justifyContent="flex-start"
                    alignItems="center"
                    sx={{ width: '100%', pl: 1 }}
                    flexWrap="wrap"
                >
                    <StandardPagination
                        page={searchParams.page}
                        perPage={searchParams.perPage}
                        totalItemCount={latestFetchResult?.totalItemCount}
                        onChange={(newPage) => setSearchParams({ ...searchParams, page: newPage })}
                    />

                    <Stack direction="row" alignItems="flex-end" gap={1} sx={{ flexGrow: 1 }}>
                        <TextField
                            variant="standard"
                            size="small"
                            placeholder="Search servers"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={() => setSearchParams({ ...searchParams, searchTerm, page: 0 })}
                                    >
                                        <SearchIcon htmlColor="gray" />
                                    </IconButton>
                                ),
                            }}
                        />

                        <IconButton
                            title={searchParams.withTags !== undefined ? 'Tag filtering active' : 'Filter by tags'}
                            onClick={() => setFilterExpanded(!filterExpanded)}
                        >
                            <FilterAltIcon color={searchParams.withTags !== undefined ? 'secondary' : 'disabled'} />
                        </IconButton>
                    </Stack>
                </Stack>

                <Collapse in={filterExpanded}>
                    <TagFilterer
                        onApply={(searchInfo) => {
                            setSearchParams({ ...searchParams, withTags: searchInfo, page: 0 });
                        }}
                        onUnapply={() => {
                            delete searchParams.withTags;
                            setSearchParams({ ...searchParams, page: 0 });
                        }}
                    />
                </Collapse>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={
                                            searchParams.sortBy === ServerSortOptions.Id ||
                                            searchParams.sortBy === undefined
                                        }
                                        direction={searchParams.sortDirection === 'desc' ? 'asc' : 'desc'}
                                        onClick={() => setSortOption(ServerSortOptions.Id)}
                                    >
                                        Server
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={searchParams.sortBy === ServerSortOptions.Status}
                                        direction={searchParams.sortDirection === 'desc' ? 'asc' : 'desc'}
                                        onClick={() => setSortOption(ServerSortOptions.Status)}
                                    >
                                        <Select
                                            onClick={(e) => e.stopPropagation()}
                                            variant="standard"
                                            size="small"
                                            value={searchParams.withStatus ?? 'none'}
                                            IconComponent={HiddenSelectIcon}
                                            sx={{ mb: -0.5, mr: -3 }}
                                            onChange={(e) => {
                                                if (e.target.value === '' || e.target.value === 'none') {
                                                    delete searchParams.withStatus;
                                                    setSearchParams({ ...searchParams, page: 0 });
                                                    return;
                                                }

                                                const finalValue =
                                                    typeof e.target.value === 'string' ? 'visible' : e.target.value;

                                                setSearchParams({ ...searchParams, withStatus: finalValue, page: 0 });
                                            }}
                                            renderValue={(status) => {
                                                if (status === 'none') return 'Status';
                                                if (status === 'visible') return 'Public/Featured';
                                                return ServerStatus[status];
                                            }}
                                            MenuProps={{ disableScrollLock: true }}
                                        >
                                            <MenuItem value="none">All</MenuItem>
                                            <MenuItem value="visible">Public/Featured</MenuItem>
                                            {allStatuses.map((e) => (
                                                <MenuItem key={e} value={e}>
                                                    {ServerStatus[e]}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={searchParams.sortBy === ServerSortOptions.CreatedAt}
                                        direction={searchParams.sortDirection === 'desc' ? 'asc' : 'desc'}
                                        onClick={() => setSortOption(ServerSortOptions.CreatedAt)}
                                    >
                                        Created At
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={searchParams.sortBy === ServerSortOptions.MemberCount}
                                        direction={searchParams.sortDirection === 'desc' ? 'asc' : 'desc'}
                                        onClick={() => setSortOption(ServerSortOptions.MemberCount)}
                                    >
                                        Size
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {latestFetchResult === undefined || loading ? (
                                new Array(searchParams.perPage).fill(0).map((_e, i) => <ServerRowSkeleton key={i} />)
                            ) : (
                                <>
                                    {latestFetchResult.items.map((e) => (
                                        <ServerRow key={e._id} server={e} onUpdate={handleUpdate} />
                                    ))}
                                </>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <StandardPagination
                    page={searchParams.page}
                    perPage={searchParams.perPage}
                    totalItemCount={latestFetchResult?.totalItemCount}
                    onChange={(newPage) => setSearchParams({ ...searchParams, page: newPage })}
                />
            </Stack>

            <div style={{ flexGrow: 1 }} />
        </Page>
    );
};

export const ServersPage: FC = () => {
    const { loggedInUser } = useContext(UserSessionContext);
    const { setLocationData } = useContext(LocationDataContext);

    const canView = useCanManageServers();

    useEffect(() => {
        setLocationData('Servers', [{ to: '/servers', text: 'Servers' }]);
    }, [setLocationData]);

    if (loggedInUser === null) return <NotLoggedInPage />;
    if (!canView) return <MissingPermissionsPage />;

    return <TrueServersPage />;
};
