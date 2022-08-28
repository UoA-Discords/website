import { Box, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import MakeLinkButton from '../Buttons/MakeLink';

const AboutPage = () => {
    const [text] = useState(() => {
        const randomChance = Math.floor(Math.random() * 100); // 0 to 100 (exclusive)
        if (randomChance <= 1) return `Among`;
        return `About`;
    });

    useEffect(() => {
        const locationHash = window.location.hash;
        if (locationHash !== ``) {
            const element = document.getElementById(locationHash.slice(1));
            element?.scrollIntoView({ behavior: `smooth` });
        }
    }, []);

    return (
        <Box>
            <Typography variant="h2" gutterBottom>
                {text} Us
            </Typography>
            <Typography>
                UoA Discords is a project to make Discord servers for the University of Auckland more accessible.
            </Typography>
            <Typography variant="h4" id="faq">
                FAQ
                <MakeLinkButton to="faq" />
            </Typography>
            <Paper sx={{ height: `500px` }}></Paper>
            <Typography variant="h4" id="our-team">
                Our Team
                <MakeLinkButton to="our-team" />
            </Typography>
            <Paper sx={{ height: `500px` }}></Paper>
            <Typography variant="h4" id="site-policy">
                Site Policy
                <MakeLinkButton to="site-policy" />
            </Typography>
            <Paper sx={{ height: `500px` }}></Paper>
        </Box>
    );
};

export default AboutPage;
