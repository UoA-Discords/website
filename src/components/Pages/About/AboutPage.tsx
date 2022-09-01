import { Link, Paper, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import MakeLinkButton from '../../Buttons/MakeLink';

import FAQ from './Sections/FAQ';
import OurTeam from './Sections/OurTeam';

const AboutPage = () => {
    const [text] = useState(() => {
        const randomChance = 1 + Math.floor(Math.random() * 100); // 1 to 100 (inclusive)
        if (randomChance === 1) return `Among`;
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
        <Container maxWidth="xl" id="app" sx={{ mt: 2 }}>
            <Typography variant="h2">{text} Us</Typography>
            <Typography color="text.secondary" maxWidth="md">
                UoA Discords is a project to make Discord servers for the University of Auckland more accessible. By
                grouping and categorizing all these servers in one place, students can find, share, and promote their
                communities with ease.
            </Typography>
            <Typography variant="h4" id="faq" sx={{ pt: 4 }}>
                FAQ
                <MakeLinkButton to="faq" />
            </Typography>
            <FAQ />
            <Typography variant="h4" id="our-team" sx={{ pt: 2 }}>
                Our Team
                <MakeLinkButton to="our-team" />
            </Typography>
            <OurTeam />
            <Typography variant="h4" id="site-policy" sx={{ pt: 2 }}>
                Site Policy
                <MakeLinkButton to="site-policy" />
            </Typography>
            <Paper sx={{ m: 1, p: 2 }} elevation={12}>
                Please behave responsibly while using UoA Discords by following the Discord{` `}
                <Link underline="none" href="https://discord.com/guidelines" target="_blank" rel="noreferrer noopener">
                    community guidelines
                </Link>
                . Exploiting or otherwise abusing our services may lead to your IP being ratelimited, having
                functionality reduced, or being outright banned. These actions may be taken at our own discretion.
            </Paper>
            <Typography variant="h4" id="contact" sx={{ pt: 2 }}>
                Contact
                <MakeLinkButton to="contact" />
            </Typography>
            <Paper sx={{ m: 1, p: 2 }} elevation={12}>
                You can contact us through our{` `}
                <Link underline="none" href="https://discord.gg/XmdRWSCy2U" target="_blank" rel="noreferrer noopener">
                    Discord server
                </Link>
                . We encourage you to do so if you have:
                <ul>
                    <li>A bug or vulnerability to report</li>
                    <li>Feedback to give</li>
                    <li>Suggestions to make</li>
                    <li>Services to offer (we're always looking to expand our team!)</li>
                </ul>
            </Paper>
        </Container>
    );
};

export default AboutPage;
