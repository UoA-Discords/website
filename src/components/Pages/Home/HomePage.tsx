import { Container, Grid, LinearProgress, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { getAllEntries, getDoneInitialLoad, getVisibleEntriesByLikes } from '../../../redux/slices/entryManager';
import SearchBar from '../../SearchBar';
import ServerCard from './ServerCard';

const HomePage = () => {
    const allEntries = useSelector(getAllEntries);
    const entryKeys = useSelector(getVisibleEntriesByLikes);
    const doneInitialLoad = useSelector(getDoneInitialLoad);

    return (
        <>
            <SearchBar />
            <Container id="app" sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    {entryKeys.length ? (
                        entryKeys.map((e, i) => {
                            const entry = allEntries[e]!;
                            return (
                                <Grid item key={entry.id} xs={12} md={6} lg={4}>
                                    <ServerCard server={entry} index={i} />
                                </Grid>
                            );
                        })
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
