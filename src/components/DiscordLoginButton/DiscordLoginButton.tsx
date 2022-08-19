import React from 'react';
import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import './DiscordLoginButton.css';

import discordIcon from '../../images/discordIcon.svg';
import LightTooltip from '../LightTooltip';

const DiscordLoginButton = () => {
    const theme = useTheme();

    const shortenText = useMediaQuery(theme.breakpoints.down(`md`));

    return (
        <LightTooltip title={shortenText ? <Typography>Login with Discord</Typography> : ``}>
            <Button id="discordLoginButton" variant="outlined">
                <img src={discordIcon} alt="Discord logo" style={{ marginRight: `0.5rem` }} />
                <Typography>{shortenText ? `Login` : `Login with Discord`}</Typography>
            </Button>
        </LightTooltip>
    );
};

export default DiscordLoginButton;
