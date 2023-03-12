import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ApprovedIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import HideSourceIcon from '@mui/icons-material/HideSource';
import { Step, StepLabel, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { ServerChangeRecord } from '../../types/Server/ServerChangeRecord';
import { ServerStatusAction } from '../../types/Server/ServerStatusAction';
import { InlineUser } from '../InlineUser';
import { RelativeTimeString } from '../RelativeTimeString';

const serverStatusActionVerbMap: Record<ServerStatusAction, string> = {
    [ServerStatusAction.Accept]: 'Accepted',
    [ServerStatusAction.Reject]: 'Rejected',
    [ServerStatusAction.Withdraw]: 'Withdrawn',
    [ServerStatusAction.Delete]: 'Deleted',
    [ServerStatusAction.Reinstate]: 'Reinstated',
    [ServerStatusAction.Reconsider]: 'Reconsidered',
    [ServerStatusAction.Feature]: 'Featured',
    [ServerStatusAction.Unfeature]: 'Unfeatured',
};

const serverStatusActionIconMap: Record<ServerStatusAction, JSX.Element> = {
    [ServerStatusAction.Accept]: <ApprovedIcon />,
    [ServerStatusAction.Reject]: <DeleteIcon />,
    [ServerStatusAction.Withdraw]: <HideSourceIcon />,
    [ServerStatusAction.Delete]: <DeleteIcon />,
    [ServerStatusAction.Reinstate]: <ApprovedIcon />,
    [ServerStatusAction.Reconsider]: <ApprovedIcon />,
    [ServerStatusAction.Feature]: <AutoAwesomeIcon />,
    [ServerStatusAction.Unfeature]: <AutoAwesomeIcon />,
};

export const ServerTimelineItem: FC<{ value: ServerChangeRecord }> = ({ value }) => (
    <Step completed active>
        <StepLabel icon={serverStatusActionIconMap[value.verb]}>
            <Stack direction="row" gap={1}>
                <Typography color="text.secondary">{serverStatusActionVerbMap[value.verb]} by</Typography>{' '}
                <InlineUser user={value.by} />
                {value.reason !== null && (
                    <sup style={{ color: 'gray', cursor: 'help' }} title={`Reason: ${value.reason}`}>
                        ?
                    </sup>
                )}
            </Stack>
            <span title={new Date(value.at).toUTCString()}>
                <RelativeTimeString time={value.at} color="gray" />
            </span>
        </StepLabel>
    </Step>
);
