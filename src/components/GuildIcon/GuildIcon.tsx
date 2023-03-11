import { CardMedia, Skeleton } from '@mui/material';
import { FC, useState } from 'react';
import TransparentBirdLogo from '../../images/TransparentBirdLogo.png';
import { Server } from '../../types/Server';
import { DiscordIdString } from '../../types/Utility';

export const GuildIconSkeleton: FC = () => (
    <div style={{ padding: '8px' }}>
        <Skeleton variant="circular" sx={{ width: 120, height: 120 }} />
    </div>
);

export const GuildIcon: FC<{ id: DiscordIdString; icon: Server['guildData']['icon'] }> = ({ id, icon }) => {
    const [errored, setErrored] = useState(false);

    if (icon !== null && !errored) {
        return (
            <CardMedia
                component="img"
                image={`https://cdn.discordapp.com/icons/${id}/${icon}`}
                sx={{ width: 128, height: 128, p: 1, borderRadius: '50%' }}
                onError={() => setErrored(true)}
            />
        );
    }

    return (
        <CardMedia
            component="img"
            image={TransparentBirdLogo}
            sx={{ width: 128, height: 128, p: 1, borderRadius: '50%' }}
            onError={() => setErrored(true)}
        />
    );
};
