import { CardMedia, Skeleton, SxProps, Theme } from '@mui/material';
import { FC, useState } from 'react';
import TransparentBirdLogo from '../../images/TransparentBirdLogo.png';
import { Server } from '../../types/Server';
import { DiscordIdString } from '../../types/Utility';

export interface GuildIconProps {
    id: DiscordIdString;
    icon: Server['guildData']['icon'];
    sx?: SxProps<Theme>;
}

export const GuildIconSkeleton: FC = () => <Skeleton variant="circular" sx={{ width: 64, height: 64, p: 1 }} />;

export const GuildIcon: FC<GuildIconProps> = ({ id, icon, sx }) => {
    const [errored, setErrored] = useState(false);

    if (icon !== null && !errored) {
        return (
            <CardMedia
                component="img"
                image={`https://cdn.discordapp.com/icons/${id}/${icon}`}
                sx={{ width: 128, height: 128, p: 1, borderRadius: '50%', ...sx }}
                onError={() => setErrored(true)}
            />
        );
    }

    return (
        <CardMedia
            component="img"
            image={TransparentBirdLogo}
            sx={{ width: 128, height: 128, p: 1, borderRadius: '50%', ...sx }}
            onError={() => setErrored(true)}
        />
    );
};
