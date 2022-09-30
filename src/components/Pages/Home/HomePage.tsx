import { Container, Grid, LinearProgress, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getAllEntries, getDoneInitialLoad, getVisibleEntries } from '../../../redux/slices/entryManager';
import { EntryStates } from '../../../shared/Types/Entries';
import SearchBar from '../../SearchBar';
import ServerCard from './ServerCard';

const HomePage = () => {
    const allEntries = useSelector(getAllEntries);
    const entryKeys = useSelector(getVisibleEntries);
    const doneInitialLoad = useSelector(getDoneInitialLoad);

    const sortedEntries = useMemo(
        () =>
            entryKeys
                .map((e) => allEntries[e])
                .sort((a, b) => {
                    if (a.state === EntryStates.Featured && b.state !== EntryStates.Featured) {
                        return -1;
                    }
                    if (a.state !== EntryStates.Featured && b.state === EntryStates.Featured) {
                        return 1;
                    }

                    return b.likes - a.likes;
                }),
        [allEntries, entryKeys],
    );

    return (
        <>
            <SearchBar />
            <Container id="app" sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    {sortedEntries.length ? (
                        sortedEntries.map((e, i) => (
                            <Grid item key={e.id} xs={12} md={6} lg={4}>
                                <ServerCard server={e} index={i} />
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            {doneInitialLoad ? (
                                <Typography variant="h4" gutterBottom textAlign="center">
                                    No items found, try expanding your search.
                                </Typography>
                            ) : (
                                <>
                                    <Typography variant="h3" gutterBottom textAlign="center">
                                        Loading Servers...
                                    </Typography>
                                    <LinearProgress />
                                </>
                            )}
                        </Grid>
                    )}
                </Grid>
            </Container>
        </>
    );
};

export default HomePage;
