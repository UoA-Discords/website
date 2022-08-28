import { Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import MuiLink from '@mui/material/Link';
import { ForceHashLink } from '../../Footer';
import { Link } from 'react-router-dom';
import './CSRF.css';

const CSRF = () => {
    const [waitingFor, setWaitingFor] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setWaitingFor(waitingFor + 1), 1000);

        return () => clearInterval(interval);
    }, [waitingFor]);

    return (
        <Stack alignItems="center" justifyContent="center" sx={{ height: `100%`, position: `relative` }} spacing={3}>
            <Typography variant="h3" color="red">
                CSRF
            </Typography>
            <Typography textAlign="center" variant="h5" sx={{ pb: 3 }}>
                A <span className="CSRF-acronym">C</span>ross <span className="CSRF-acronym">S</span>ite{` `}
                <span className="CSRF-acronym">R</span>equest <span className="CSRF-acronym">F</span>orgery may have
                taken place, meaning your request was intercepted.
            </Typography>
            <Typography textAlign="center" variant="h5" sx={{ pb: 3 }}>
                Please{` `}
                <MuiLink component="span">
                    <ForceHashLink to="/about" hash="contact" style={{ color: `inherit` }}>
                        contact us
                    </ForceHashLink>
                </MuiLink>
                {` `}immediately.
            </Typography>
            <Link to="/" style={{ textDecoration: `none`, color: `inherit` }}>
                <Button variant="outlined">Go Home</Button>
            </Link>
        </Stack>
    );
};

export default CSRF;
