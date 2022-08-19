import { Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import zombieChina from '../../images/ZombieChina.webp';

const NotFound = () => {
    const [runTime, setRunTime] = useState(0);

    useEffect(() => {
        document.body.classList.add(`hiddenScroll`);

        let startedAt: number | null = null;
        let finishedAt: number | null = null;

        const handleScroll = () => {
            const scrollAmount = document.body.scrollTop;
            if (scrollAmount < 300) {
                startedAt = null;
                finishedAt = null;
                return;
            }

            // scrolling back up
            if (finishedAt !== null) return;

            if (startedAt === null) {
                startedAt = Date.now();
                return;
            }

            // reached end
            if (scrollAmount >= 5508) {
                finishedAt = Date.now();
                setRunTime(finishedAt - startedAt);
            }
        };

        document.body.addEventListener(`scroll`, handleScroll);

        return () => {
            document.body.classList.remove(`hiddenScroll`);
            document.body.removeEventListener(`scroll`, handleScroll);
        };
    }, []);

    return (
        <>
            <Container id="app" maxWidth="xl" sx={{ mt: 1 }}>
                <Typography variant="h2">Not Found</Typography>
                <Typography>
                    The page you were looking for does not exist, click{` `}
                    <Link style={{ color: `#7289da`, textDecoration: `none` }} to="/">
                        here
                    </Link>
                    {` `}to go back home.
                </Typography>

                <Typography>You reached zombie china!</Typography>
                {/* <img src={erinDog} alt="Aaron's dog" style={{ width: `50%` }} /> */}
                <div style={{ height: `500vh` }} />
            </Container>
            <img src={zombieChina} alt="Zombie China" style={{ width: `100vw`, transform: `scaleY(-1)` }} />
            <Typography textAlign="center" sx={{ p: 1, mb: `-16px` }}>
                You made it to Zombie China in{` `}
                <span style={{ color: `gold`, fontWeight: `bold` }}>{(runTime / 1000).toFixed(2)}</span>
                {` `}
                seconds!
            </Typography>
        </>
    );
};

export default NotFound;
