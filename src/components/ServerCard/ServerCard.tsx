import { Card, CardActionArea, CardContent, Chip, Grid, Skeleton, Typography } from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { splitBitfield } from '../../helpers/splitBitfield';
import { Server } from '../../types/Server';
import { ServerStatus } from '../../types/Server/ServerStatus';
import { GuildIcon, GuildIconSkeleton } from '../GuildIcon';
import { ServerTag } from '../ServerTagSelector/ServerTag';
import './ServerCard.css';

export interface ServerCardProps {
    server: Server;
}

export const ServerCardSkeleton: FC = () => (
    <div style={{ height: '100%' }}>
        <Card sx={{ position: 'relative', height: '100%' }}>
            <CardActionArea sx={{ display: 'flex', justifyContent: 'flex-start', height: '100%' }} disabled>
                <GuildIconSkeleton />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5">
                        <Skeleton variant="text" />
                    </Typography>
                    <Typography color="text.secondary">
                        <Skeleton variant="text" />
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    </div>
);

export const ServerCard: FC<ServerCardProps> = ({ server }) => {
    const [, setOpen] = useState(false);

    const splitTags = useMemo(() => splitBitfield(server.serverTags), [server.serverTags]);

    return (
        <div
            className={server.status === ServerStatus.Featured ? 'featuredServerCard' : undefined}
            style={{ height: '100%' }}
        >
            {server.status === ServerStatus.Featured && (
                <>
                    <span className="orbiter orbiter1" />
                    <span className="orbiter orbiter2" />
                    <span className="orbiter orbiter3" />
                    <span className="orbiter orbiter4" />
                </>
            )}
            <Card sx={{ position: 'relative', height: '100%' }}>
                <CardActionArea
                    disableRipple
                    sx={{ display: 'flex', justifyContent: 'flex-start', height: '100%' }}
                    onClick={() => setOpen(true)}
                >
                    <GuildIcon icon={server.guildData.icon} id={server._id} />
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h5">{server.guildData.name}</Typography>
                        <Typography
                            color="text.secondary"
                            title={`Last updated ${new Date(server.size.lastUpdated).toLocaleDateString('en-NZ')}`}
                        >
                            {server.size.total} Members ({server.size.online} Online)
                        </Typography>
                        <Grid container spacing={0.5}>
                            {splitTags.slice(0, 3).map((e) => (
                                <Grid item key={e}>
                                    <ServerTag key={e} value={e} selected />
                                </Grid>
                            ))}
                            {splitTags.length > 3 && (
                                <Grid item>
                                    <Chip
                                        color="primary"
                                        variant="filled"
                                        label={`+${splitTags.length - 3}`}
                                        style={{
                                            backgroundColor: '#7289da',
                                            color: '#fff',
                                            borderRadius: 0.5,
                                        }}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
};
