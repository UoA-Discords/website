import { Button, Fade, Link } from '@mui/material';
import React from 'react';
import './GoHomeButton.css';
import HomeIcon from '@mui/icons-material/Home';

const GoHomeButton = () => {
    return (
        <Fade in>
            <Link href="/">
                <Button id="goHomeButton">
                    <HomeIcon />
                </Button>
            </Link>
        </Fade>
    );
};

export default GoHomeButton;
