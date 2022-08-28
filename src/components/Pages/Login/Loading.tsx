import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';

const Loading = () => {
    useEffect(() => {
        const logo = document.getElementById(`logo`);

        logo?.classList.add(`spinning`);

        return () => {
            logo?.classList.remove(`spinning`);
        };
    }, []);

    const [waitingFor, setWaitingFor] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setWaitingFor(waitingFor + 1), 1000);

        return () => clearInterval(interval);
    }, [waitingFor]);

    return (
        <Stack alignItems="center" justifyContent="center" sx={{ height: `100%`, position: `relative` }}>
            <Typography variant="h3">Loading</Typography>
            <Typography textAlign="center">This shouldn't take too long.</Typography>
            <span style={{ position: `absolute`, bottom: 0, right: 0, color: `gray` }}>
                Waiting for: {waitingFor} seconds
            </span>
        </Stack>
    );
};

export default Loading;
