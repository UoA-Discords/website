import { useContext } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { SettingsContext } from '../../contexts';
import { ExternalLink } from '../Links';
import { DiscordIcon } from '../../images';

export const LoginButton: React.FC<ButtonProps> = (props) => {
    const { sessionData } = useContext(SettingsContext);

    return (
        <ExternalLink href={sessionData.oAuthLink} target="_self" title="Login with Discord">
            <Button variant="outlined" startIcon={<DiscordIcon fill="white" />} {...props}>
                Login
            </Button>
        </ExternalLink>
    );
};
