import { Skeleton, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { GuildIcon, GuildIconSkeleton } from '../../components/GuildIcon';
import { InlineUser } from '../../components/InlineUser';
import { RelativeTimeString } from '../../components/RelativeTimeString';
import { ServerDialog } from '../../components/ServerDialog';
import { Server } from '../../types/Server';
import { ServerStatus } from '../../types/Server/ServerStatus';

export interface ServerRowProps {
    server: Server;
    onUpdate: (updatedUser: Server) => void;
}

export const ServerRowSkeleton: FC = () => (
    <TableRow>
        <TableCell colSpan={5}>
            <Stack direction="row" spacing={1} alignItems="center">
                <GuildIconSkeleton />
                <div style={{ width: '100%' }}>
                    <Skeleton />
                    <Skeleton />
                </div>
            </Stack>
        </TableCell>
    </TableRow>
);

export const ServerRow: FC<ServerRowProps> = ({ server, onUpdate }) => {
    const [open, setOpen] = useState(false);

    return (
        <TableRow hover>
            <ServerDialog open={open} onClose={() => setOpen(false)} server={server} onChange={onUpdate} />
            <TableCell sx={{ cursor: 'pointer' }} onClick={() => setOpen(true)}>
                <Stack direction="row" alignItems="center">
                    <GuildIcon icon={server.guildData.icon} id={server._id} sx={{ height: 64, width: 64 }} />
                    {server.guildData.name}
                </Stack>
            </TableCell>
            <TableCell>{ServerStatus[server.status]}</TableCell>
            <TableCell>
                <Typography title={new Date(server.created.at).toUTCString()}>
                    {new Date(server.created.at).toLocaleDateString('en-NZ')}
                    <br />
                    <RelativeTimeString time={server.created.at} color="gray" whiteSpace="nowrap" />
                </Typography>
            </TableCell>
            <TableCell>
                <InlineUser onClick={(e) => e.stopPropagation()} user={server.created.by} />
            </TableCell>
            <TableCell>{server.size.total}</TableCell>
        </TableRow>
    );
};
