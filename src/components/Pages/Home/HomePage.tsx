import { Container, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { getAllEntries, getVisibleEntriesByLikes } from '../../../redux/slices/entryManager';
import SearchBar from '../../SearchBar';
import ServerCard from './ServerCard';

const HomePage = () => {
    const allEntries = useSelector(getAllEntries);
    const entryKeys = useSelector(getVisibleEntriesByLikes);

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
                            No items found, try expanding your search.
                        </Grid>
                    )}
                </Grid>
            </Container>
        </>
    );
};

export default HomePage;
