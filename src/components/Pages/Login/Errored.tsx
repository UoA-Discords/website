import { Button, Paper, Stack, Typography } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';

import tempLogo from '../../../images/tempLogo.png';
import tempLogoGlitched from '../../../images/tempLogoGlitched.png';
import { ForceHashLink } from '../../Footer';
import MuiLink from '@mui/material/Link';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Errored = ({ error }: { error: unknown }) => {
    const [msg, setMsg] = useState<ReactNode>(<></>);

    useEffect(() => {
        const logo = document.getElementById(`logo`) as HTMLImageElement | null;

        if (logo !== null) {
            logo.src = tempLogoGlitched;
        }

        return () => {
            if (logo !== null) {
                logo.src = tempLogo;
            }
        };
    }, []);

    useEffect(() => {
        if (axios.isAxiosError(error)) {
            if (error.response?.data !== undefined) {
                if (typeof error.response.data === `object` && error.response.data !== null) {
                    try {
                        const errShape = error.response.data as {
                            shortMessage: string | null;
                            longMessage: string | null;
                            fixMessage: string | null;
                        };
                        const shortMessage = errShape.shortMessage;
                        const longMessage = errShape.longMessage;
                        const fixMessage = errShape.fixMessage;

                        setMsg(
                            <>
                                <Typography variant="h5">
                                    {shortMessage ?? error.response.statusText}
                                    {` `}({error.response.status})
                                </Typography>
                                <Typography sx={{ whiteSpace: `pre-wrap` }} textAlign="center">
                                    {longMessage ?? ``}
                                    <br />
                                    Potential Fix:{` `}
                                    {fixMessage ?? `None`}
                                </Typography>
                            </>,
                        );
                    } catch (e) {
                        console.log(e);
                        setMsg(
                            <Typography textAlign="center">
                                Status Code {error.response.status} ({error.response.statusText})`
                            </Typography>,
                        );
                    }
                }
                console.log(error);
                return;
            }
        }

        if (error instanceof Error) {
            console.log(error);
            setMsg(
                <Typography sx={{ whiteSpace: `pre-wrap` }} textAlign="center">
                    {error.message}
                </Typography>,
            );
            return;
        }

        console.log(`%cPlease take a screenshot of the below message ↓`, `color: orange`);
        console.log(error);
        console.log(
            `%cThank you!!!%c
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣶⣿⣿⣷⣶⣄⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣾⣿⣿⡿⢿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⡟⠁⣰⣿⣿⣿⡿⠿⠻⠿⣿⣿⣿⣿⣧⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⠏⠀⣴⣿⣿⣿⠉⠀⠀⠀⠀⠀⠈⢻⣿⣿⣇⠀⠀⠀
            ⠀⠀⠀⠀⢀⣠⣼⣿⣿⡏⠀⢠⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⡀⠀⠀
            ⠀⠀⠀⣰⣿⣿⣿⣿⣿⡇⠀⢸⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⡇⠀⠀
            ⠀⠀⢰⣿⣿⡿⣿⣿⣿⡇⠀⠘⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⢀⣸⣿⣿⣿⠁⠀⠀
            ⠀⠀⣿⣿⣿⠁⣿⣿⣿⡇⠀⠀⠻⣿⣿⣿⣷⣶⣶⣶⣶⣶⣿⣿⣿⣿⠃⠀⠀⠀
            ⠀⢰⣿⣿⡇⠀⣿⣿⣿⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀
            ⠀⢸⣿⣿⡇⠀⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠉⠛⠛⠛⠉⢉⣿⣿⠀⠀⠀⠀⠀⠀
            ⠀⢸⣿⣿⣇⠀⣿⣿⣿⠀⠀⠀⠀⠀⢀⣤⣤⣤⡀⠀⠀⢸⣿⣿⣿⣷⣦⠀⠀⠀
            ⠀⠀⢻⣿⣿⣶⣿⣿⣿⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣦⡀⠀⠉⠉⠻⣿⣿⡇⠀⠀
            ⠀⠀⠀⠛⠿⣿⣿⣿⣿⣷⣤⡀⠀⠀⠀⠀⠈⠹⣿⣿⣇⣀⠀⣠⣾⣿⣿⡇⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣦⣤⣤⣤⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⢿⣿⣿⣿⣿⣿⣿⠿⠋⠉⠛⠋⠉⠉⠁⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠁`,
            `color: orange`,
            `color: reset`,
        );
        setMsg(
            <>
                <Typography textAlign="center">
                    This error hasn't been seen before (lucky you!)
                    <br />
                    We recommend you take a screenshot of the console (F12 on Windows) and{` `}
                    <MuiLink component="span">
                        <ForceHashLink to="/about" hash="contact" style={{ color: `inherit` }}>
                            send it to us.
                        </ForceHashLink>
                    </MuiLink>
                </Typography>
            </>,
        );
    }, [error]);

    return (
        <Stack alignItems="center" justifyContent="center" sx={{ height: `100%`, position: `relative` }} spacing={3}>
            <Typography variant="h3">Errored</Typography>
            <Typography textAlign="center" variant="h5" sx={{ pb: 3 }}>
                An error occurred while trying to log in.
            </Typography>
            <Paper elevation={2} sx={{ textAlign: `center`, p: 2 }}>
                {msg}
            </Paper>
            <Link to="/" style={{ textDecoration: `none`, color: `inherit` }}>
                <Button variant="outlined">Go Home</Button>
            </Link>
        </Stack>
    );
};

export default Errored;
