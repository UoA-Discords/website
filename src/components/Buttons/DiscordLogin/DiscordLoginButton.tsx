import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useCallback } from 'react';
import { useCookies } from 'react-cookie';
import discordIcon from '../../../images/discordIcon.svg';
import LightTooltip from '../../Tooltips/LightTooltip';
import { makeDiscordLoginLink } from '../../../helpers/makeDiscordLoginLink';
import './DiscordLoginButton.css';
import { useSelector } from 'react-redux';
import { getSettings } from '../../../redux/slices/main';

const DiscordLoginButton = () => {
    const [, setOAuthState] = useCookies<`oauth_state`, { oauth_state?: string }>([`oauth_state`]);

    const theme = useTheme();

    const shortenText = useMediaQuery(theme.breakpoints.down(`md`));

    const { discordClientId, redirectURI } = useSelector(getSettings);

    const handleClick = useCallback(() => {
        const { link, state } = makeDiscordLoginLink(discordClientId, redirectURI);
        setOAuthState(`oauth_state`, state, { sameSite: `strict` });
        window.open(link, `_self`);
    }, [discordClientId, redirectURI, setOAuthState]);

    return (
        <LightTooltip title={shortenText ? <Typography>Login with Discord</Typography> : ``}>
            <Button id="discordLoginButton" variant="outlined" onClick={handleClick}>
                <img src={discordIcon} alt="Discord logo" />
                <Typography>{shortenText ? `Login` : `Login with Discord`}</Typography>
            </Button>
        </LightTooltip>
    );
};

export default DiscordLoginButton;
