import Button, { ButtonProps } from '@mui/material/Button';
import { FC, useContext } from 'react';
import { SettingsContext } from '../../contexts';
import { DiscordIcon } from '../../images';
import { ExternalLink } from '../Links';

/** A button that externally links to the Discord login endpoint, this opens in the current window (`_self`). */
export const LoginButton: FC<ButtonProps> = (props) => {
    const {
        sessionData: { oAuthLink },
    } = useContext(SettingsContext);

    return (
        <ExternalLink href={oAuthLink} target="_self" title="Login with Discord">
            <Button variant="outlined" startIcon={<DiscordIcon fill="white" />} {...props}>
                Login
            </Button>
        </ExternalLink>
    );
};
