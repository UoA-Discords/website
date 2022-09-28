import { useState } from 'react';
import tempLogo from '../../images/tempLogo.png';
import { EntryStates, FullEntry } from '../../shared/Types/Entries';
import { CardMedia } from '@mui/material';

const GuildIcon = ({ server }: { server: FullEntry<EntryStates.Approved | EntryStates.Featured> }) => {
    const [errored, setErrored] = useState(false);

    if (!errored) {
        return (
            <CardMedia
                component="img"
                image={`https://cdn.discordapp.com/icons/${server.id}/${server.guildData.icon}`}
                sx={{ width: 128, p: 1, borderRadius: `50%` }}
                onError={() => setErrored(true)}
            />
        );
    }

    return <CardMedia component="img" image={tempLogo} sx={{ width: 128, p: 2 }} />;
};

export default GuildIcon;
