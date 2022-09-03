import { Grid, Paper, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getSettings } from '../../redux/slices/main';
import './Footer.css';

export const ForceHashLink = ({
    to,
    hash,
    children,
    style,
}: {
    to: string;
    hash: string;
    children: ReactNode;
    style?: React.CSSProperties;
}) => {
    return (
        <Link
            style={{ textDecoration: `inherit`, ...style }}
            to={`${to}#${hash}`}
            onClick={() => window.location.replace(`#${hash}`)}
        >
            {children}
        </Link>
    );
};

const Footer = () => {
    const { serverUrl } = useSelector(getSettings);

    return (
        <Paper id="footer" elevation={0} square>
            <Grid container spacing={2} justifyContent="space-evenly" sx={{ pl: 1, pr: 1, pb: 3 }}>
                <Grid item xs={12}>
                    <Typography textAlign="center" sx={{ pl: 1, pr: 1, pt: 3 }} >
                        <span title="This doesn't mean anything, it just looks official.">
                            UoA Discords {new Date().getFullYear()} © NachoToast
                        </span>
                    </Typography>
                    <Typography textAlign="center" sx={{ pl: 1, pr: 1, pb:2 }} >
                        <span title="This does mean something.">
                            Not affiliated with Discord or the University of Auckland.
                        </span>
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
                    <a href={`${serverUrl}/api-docs`} target="_blank" rel="noreferrer noopener">
                        <Typography variant="h6">API</Typography>
                    </a>
                </Grid>
                <Grid item>
                    <ForceHashLink to="/about" hash="site-policy">
                        <Typography variant="h6">Site Policy</Typography>
                    </ForceHashLink>
                </Grid>
                <Grid item>
                    <ForceHashLink to="/about" hash="contact">
                        <Typography variant="h6">Contact</Typography>
                    </ForceHashLink>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Footer;
