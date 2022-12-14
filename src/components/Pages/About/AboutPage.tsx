import { Link, Paper, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useState } from 'react';
import MakeSectionLinkButton from '../../Buttons/MakeSectionLink';
import ExternalLink from '../../Links/ExternalLink';

import FAQ from './Sections/FAQ';
import OurTeam from './Sections/OurTeam';

const AboutPage = () => {
    const [text] = useState(() => {
        const randomChance = 1 + Math.floor(Math.random() * 100); // 1 to 100 (inclusive)
        if (randomChance === 1) return `Among`;
        return `About`;
    });

    return (
        <Container id="app" sx={{ mt: 2 }}>
            <Typography variant="h2">{text} Us</Typography>
            <Typography color="text.secondary" maxWidth="md">
                UoA Discords is a project to make Discord servers for the University of Auckland more accessible. By
                grouping and categorizing all these servers in one place, students can find, share, and promote their
                communities with ease.
            </Typography>
            <Typography variant="h4" id="faq" sx={{ pt: 4 }}>
                FAQ
                <MakeSectionLinkButton to="faq" />
            </Typography>
            <FAQ />
            <Typography variant="h4" id="our-team" sx={{ pt: 2 }}>
                Our Team
                <MakeSectionLinkButton to="our-team" />
            </Typography>
            <OurTeam />
            <Typography variant="h4" id="site-policy" sx={{ pt: 2 }}>
                Site Policy
                <MakeSectionLinkButton to="site-policy" />
            </Typography>
            <Paper sx={{ m: 1, p: 2 }} elevation={12}>
                Please behave responsibly while using UoA Discords by following the Discord{` `}
                <Link underline="hover" href="https://discord.com/guidelines" target="_blank" rel="noreferrer noopener">
                    community guidelines
                </Link>
                . Exploiting or otherwise abusing our services may lead to your IP being ratelimited, having
                functionality reduced, or being outright banned. These actions may be taken at our own discretion.
            </Paper>
            <Typography variant="h4" id="contact" sx={{ pt: 2 }}>
                Contact
                <MakeSectionLinkButton to="contact" />
            </Typography>
            <Paper sx={{ m: 1, p: 2 }} elevation={12}>
                You can contact us through our{` `}
                <ExternalLink href="https://discord.gg/XmdRWSCy2U">Discord server</ExternalLink>. We encourage you to do
                so if you have:
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
