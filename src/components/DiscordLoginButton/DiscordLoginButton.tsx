import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useCallback } from 'react';
import { useCookies } from 'react-cookie';
import discordIcon from '../../images/discordIcon.svg';
import LightTooltip from '../LightTooltip';
import { makeDiscordLoginLink } from '../../helpers/makeDiscordLoginLink';
import './DiscordLoginButton.css';

const DiscordLoginButton = () => {
    const [, setOAuthState] = useCookies<`oauth_state`, { oauth_state?: string }>([`oauth_state`]);

    const theme = useTheme();

    const shortenText = useMediaQuery(theme.breakpoints.down(`md`));

    const handleClick = useCallback(() => {
        const { link, state } = makeDiscordLoginLink();
        setOAuthState(`oauth_state`, state, { sameSite: `strict` });
        window.open(link, `_self`);
    }, [setOAuthState]);

    return (
        <LightTooltip title={shortenText ? <Typography>Login with Discord</Typography> : ``}>
            <Button id="discordLoginButton" variant="outlined" onClick={handleClick}>
                <img src={discordIcon} alt="Discord logo" style={{ marginRight: `0.5rem` }} />
                <Typography>{shortenText ? `Login` : `Login with Discord`}</Typography>
            </Button>
        </LightTooltip>
    );
};

export default DiscordLoginButton;
