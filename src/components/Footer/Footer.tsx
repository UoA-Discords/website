import { Grid, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { getSettings } from '../../redux/slices/main';
import ExternalLink from '../Links/ExternalLink';
import InternalLink from '../Links/InternalLink';
import './Footer.css';

const Footer = () => {
    const { serverUrl } = useSelector(getSettings);

    return (
        <Paper id="footer" elevation={0} square>
            <Grid container spacing={2} justifyContent="space-evenly" sx={{ pl: 1, pr: 1, pb: 3 }}>
                <Grid item xs={12}>
                    <Typography textAlign="center" sx={{ pl: 1, pr: 1, pt: 3 }}>
                        <span title="This doesn't mean anything, it just looks official.">
                            UoA Discords {new Date().getFullYear()} © NachoToast
                        </span>
                    </Typography>
                    <Typography textAlign="center" sx={{ pl: 1, pr: 1, pb: 2 }}>
                        <span title="This does mean something.">
                            Not affiliated with Discord or the University of Auckland.
                        </span>
                    </Typography>
                </Grid>
                <Grid item>
                    <InternalLink href="/" underline="none">
                        <Typography variant="h6">Home</Typography>
                    </InternalLink>
                </Grid>
                <Grid item>
                    <InternalLink href="/about" underline="none">
                        <Typography variant="h6">About</Typography>
                    </InternalLink>
                </Grid>
                <Grid item>
                    <InternalLink href="/about#faq">
                        <Typography variant="h6">FAQ</Typography>
                    </InternalLink>
                </Grid>
                <Grid item>
                    <ExternalLink href={`${serverUrl}/api-docs`} underline="none">
                        <Typography variant="h6">API</Typography>
                    </ExternalLink>
                </Grid>
                <Grid item>
                    <InternalLink href="/about#site-policy" underline="none">
                        <Typography variant="h6">Site Policy</Typography>
                    </InternalLink>
                </Grid>
                <Grid item>
                    <InternalLink href="/about#contact" underline="none">
                        <Typography variant="h6">Contact</Typography>
                    </InternalLink>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Footer;
