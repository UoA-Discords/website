import { Grid, Link, Paper, Typography } from '@mui/material';
import React from 'react';
import { config } from '../../config';
import './Footer.css';

const Footer = () => {
    return (
        <Paper id="footer" elevation={0} square>
            <Typography
                textAlign="center"
                title="This doesn't mean anything, it just looks official."
                sx={{ pl: 1, pr: 1 }}
            >
                UoA Discords 2022 © NachoToast
            </Typography>
            <Grid container spacing={1} justifyContent="space-evenly" sx={{ pl: 1, pr: 1 }}>
                <Grid item>
                    <Link href="/">
                        <Typography variant="h6">Home</Typography>
                    </Link>
                </Grid>
                <Grid item>
                    <Link href="/about">
                        <Typography variant="h6">About</Typography>
                    </Link>
                </Grid>
                <Grid item>
                    <Link href="/about#faq">
                        <Typography variant="h6">FAQ</Typography>
                    </Link>
                </Grid>
                <Grid item>
                    <Link href={`${config.serverUrl}/api-docs`} target="_blank" rel="noreferrer noopener">
                        <Typography variant="h6">API</Typography>
                    </Link>
                </Grid>
                <Grid item>
                    <Link href="/about#our-team">
                        <Typography variant="h6">Our Team</Typography>
                    </Link>
                </Grid>
                <Grid item>
                    <Link href="/about#site-policy">
                        <Typography variant="h6">Site Policy</Typography>
                    </Link>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Footer;
