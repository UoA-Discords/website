import { Grid, Paper, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { config } from '../../config';
import './Footer.css';

const ForceHashLink = ({ to, hash, children }: { to: string; hash: string; children: ReactNode }) => {
    return (
        <Link to={`${to}#${hash}`} onClick={() => window.location.replace(`#${hash}`)}>
            {children}
        </Link>
    );
};

const Footer = () => {
    return (
        <Paper id="footer" elevation={0} square>
            <Grid container spacing={2} justifyContent="space-evenly" sx={{ pl: 1, pr: 1 }}>
                <Grid item xs={12}>
                    <Typography
                        textAlign="center"
                        title="This doesn't mean anything, it just looks official."
                        sx={{ pl: 1, pr: 1 }}
                    >
                        UoA Discords {new Date().getFullYear()} © NachoToast
                    </Typography>
                </Grid>
                <Grid item>
                    <Link to="/">
                        <Typography variant="h6">Home</Typography>
                    </Link>
                </Grid>
                <Grid item>
                    <Link to="/about">
                        <Typography variant="h6">About</Typography>
                    </Link>
                </Grid>
                <Grid item>
                    <ForceHashLink to="/about" hash="faq">
                        <Typography variant="h6">FAQ</Typography>
                    </ForceHashLink>
                </Grid>
                <Grid item>
                    <a href={`${config.serverUrl}/api-docs`} target="_blank" rel="noreferrer noopener">
                        <Typography variant="h6">API</Typography>
                    </a>
                </Grid>
                <Grid item>
                    <ForceHashLink to="/about" hash="our-team">
                        <Typography variant="h6">Our Team</Typography>
                    </ForceHashLink>
                </Grid>
                <Grid item>
                    <ForceHashLink to="/about" hash="site-policy">
                        <Typography variant="h6">Site Policy</Typography>
                    </ForceHashLink>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Footer;
