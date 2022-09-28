import { Container, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import zombieChina from '../../images/ZombieChina.webp';

const NotFoundPage = () => {
    useEffect(() => {
        document.body.classList.add(`hiddenScroll`);

        return () => {
            document.body.classList.remove(`hiddenScroll`);
        };
    }, []);

    return (
        <>
            <Container id="app" sx={{ mt: 1 }}>
                <Typography variant="h2">Not Found</Typography>
                <Typography>
                    The page you were looking for does not exist, click{` `}
                    <Link style={{ color: `#7289da`, textDecoration: `none` }} to="/">
                        here
                    </Link>
                    {` `}to go back home.
                </Typography>
                <div style={{ height: `500vh` }} />
            </Container>
            <Typography variant="h4" textAlign="center" sx={{ p: 1, transform: `translateY(100%)`, zIndex: 1 }}>
                You made it to Zombie China!
            </Typography>
            <img
                src={zombieChina}
                alt="Zombie China"
                style={{ width: `100vw`, transform: `scaleY(-1)`, marginBottom: `-16px` }}
            />
        </>
    );
};

export default NotFoundPage;
