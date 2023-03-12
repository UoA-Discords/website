import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import { Collapse, Grid, IconButton, Pagination, Stack, TextField, Typography } from '@mui/material';
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { Page } from '../../Page.styled';
import { api } from '../../api';
import { ServerCard, ServerCardSkeleton } from '../../components/ServerCard';
import { TagFilterer } from '../../components/TagFilterer';
import { MainStateContext, SettingsContext, UserSessionContext } from '../../contexts';
import { LocationDataContext } from '../../contexts/LocationData';
import { WithPagination } from '../../types/Page';
import { GetAllServersParams } from '../../types/Searching/GetAllServersParams';
import { Server } from '../../types/Server';
import { ServerStatus } from '../../types/Server/ServerStatus';

export const HomePage: FC = () => {
    const { latestServerResponse, setLatestError } = useContext(MainStateContext);
    const { setLocationData } = useContext(LocationDataContext);
    const { settings } = useContext(SettingsContext);
    const { loggedInUser } = useContext(UserSessionContext);

    const [isFetching, setIsFetching] = useState(false);
    const [searchParams, setSearchParams] = useState<GetAllServersParams>({
        page: 0,
        perPage: 20,
        withStatus: 'visible',
    });
    const [serverList, setServerList] = useState<WithPagination<Server>>();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterExpanded, setFilterExpanded] = useState(false);

    const sortedServerList = useMemo(() => {
        if (serverList === undefined) return [];

        if (searchParams.searchTerm !== undefined) return serverList.items;

        if (searchParams.withTags !== undefined) return serverList.items;

        return serverList.items.sort((a, b) => {
            if (a.status === ServerStatus.Featured && b.status !== ServerStatus.Featured) {
                return -1;
            }
            if (a.status !== ServerStatus.Featured && b.status === ServerStatus.Featured) {
                return 1;
            }

            return a._id.localeCompare(b._id);
        });
    }, [searchParams.searchTerm, searchParams.withTags, serverList]);
    useEffect(() => {
        const controller = new AbortController();

        setIsFetching(true);

        api.searchServers(
            {
                baseURL: settings.serverUrl,
                siteToken: loggedInUser?.siteAuth,
                controller,
                rateLimitBypassToken: settings.rateLimitBypassToken,
            },
            searchParams,
        )
            .then(setServerList)
            .catch(setLatestError)
            .finally(() => setIsFetching(false));
    }, [loggedInUser?.siteAuth, searchParams, setLatestError, settings.rateLimitBypassToken, settings.serverUrl]);

    // updating header text
    useEffect(() => {
        if (latestServerResponse) {
            const { numServers, numUsers } = latestServerResponse;
            setLocationData(
                'UoA Discords',
                `Cataloguing ${numServers.toLocaleString(
                    'en-NZ',
                )} University of Auckland Discord servers (and ${numUsers.toLocaleString('en-NZ')} users).`,
            );
        } else {
            setLocationData('UoA Discords', 'Your catalogue for the various University of Auckland Discord servers.');
        }
    }, [latestServerResponse, setLocationData]);

    useEffect(() => {
        if (searchTerm === '' && searchParams.searchTerm !== undefined) {
            delete searchParams.searchTerm;
            setSearchParams({ ...searchParams });
        }
    }, [searchParams, searchTerm]);

    return (
        <Page maxWidth="xl">
            <Stack gap={2} alignItems="center" sx={{ mt: 1 }}>
                <Stack direction="row" gap={3} sx={{ width: '100%' }} justifyContent="space-between" flexWrap="wrap">
                    <Stack direction="row" alignItems="flex-end" gap={1}>
                        <TextField
                            variant="standard"
                            size="medium"
                            placeholder="Search servers"
                            sx={{ minWidth: '250px' }}
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

                        <IconButton
                            title={searchParams.withTags !== undefined ? 'Tag filtering active' : 'Filter by tags'}
                            onClick={() => setFilterExpanded(!filterExpanded)}
                        >
                            <FilterAltIcon color={searchParams.withTags !== undefined ? 'secondary' : 'disabled'} />
                        </IconButton>
                    </Stack>

                    <Pagination
                        variant="outlined"
                        shape="rounded"
                        size="large"
                        count={Math.ceil((serverList?.totalItemCount ?? 0) / searchParams.perPage)}
                        page={searchParams.page + 1}
                        onChange={(_e, page) => setSearchParams({ ...searchParams, page: page - 1 })}
                    />
                </Stack>

                <Collapse in={filterExpanded}>
                    <TagFilterer
                        onApply={(searchInfo) => {
                            setSearchParams({ ...searchParams, withTags: searchInfo });
                        }}
                        onUnapply={() => {
                            delete searchParams.withTags;
                            setSearchParams({ ...searchParams });
                        }}
                    />
                </Collapse>

                <Grid container spacing={2}>
                    {isFetching
                        ? new Array(searchParams.perPage).fill(0).map((_e, i) => (
                              <Grid item key={i} xs={12} md={6} lg={4} sx={{ zIndex: 1 }}>
                                  <ServerCardSkeleton />
                              </Grid>
                          ))
                        : sortedServerList.map((e, i) => (
                              <Grid item key={i} xs={12} md={6} lg={4} sx={{ zIndex: 1 }}>
                                  <ServerCard server={e} />
                              </Grid>
                          ))}
                    {!isFetching && sortedServerList.length === 0 && (
                        <Grid item xs={12} sx={{ minHeight: '300px' }}>
                            <Page style={{ height: '100%' }}>
                                <Typography variant="h6">No servers found</Typography>
                            </Page>
                        </Grid>
                    )}
                </Grid>

                <Pagination
                    variant="outlined"
                    shape="rounded"
                    size="large"
                    count={Math.ceil((serverList?.totalItemCount ?? 0) / searchParams.perPage)}
                    page={searchParams.page + 1}
                    onChange={(_e, page) => setSearchParams({ ...searchParams, page: page - 1 })}
                />
            </Stack>
        </Page>
    );
};
