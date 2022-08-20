import { Container, Grid } from '@mui/material';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getAllEntries } from '../../redux/slices/entryManager';
import SearchBar from '../SearchBar';
import ServerCard from './ServerCard';

const Home = () => {
    const allEntries = useSelector(getAllEntries);

    const entryKeys = useMemo<string[]>(() => Object.keys(allEntries), [allEntries]);

    return (
        <>
            <SearchBar />
            <Container maxWidth="xl" id="app" sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    {entryKeys.map((e, i) => {
                        const entry = allEntries[e]!;
                        return (
                            <Grid item key={entry.id} xs={12} md={6} lg={4}>
                                <ServerCard server={entry} index={i} />
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </>
    );
};

export default Home;
