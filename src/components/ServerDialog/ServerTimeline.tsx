import SubmittedIcon from '@mui/icons-material/AddBox';
import InviteCreatedIcon from '@mui/icons-material/Link';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Stepper, Step, StepLabel, Typography, Stack, Link } from '@mui/material';
import { FC, useEffect, useMemo, useState } from 'react';
import { Server } from '../../types/Server';
import { InlineUser } from '../InlineUser';
import { RelativeTimeString } from '../RelativeTimeString';
import { ServerTimelineItem } from './ServerTimelineItem';

/**
 * Lists event of an server, such as:
 *
 * - Invite code created.
 * - Submitted to site.
 * - Approved/denied/whatever it's latest state is.
 *
 * Will not show invite creation data if the user is the same as the one who submitted it to the site.
 */
export const ServerTimeline: FC<{ server: Server }> = ({ server }) => {
    const [expandAll, setExpandAll] = useState(server.statusLog.length < 3);

    const reversedLog = useMemo(() => [...server.statusLog].reverse(), [server.statusLog]);

    const lastLogItem = useMemo(() => reversedLog.at(-1), [reversedLog]);

    useEffect(() => setExpandAll(server.statusLog.length < 3), [server.statusLog.length]);

    return (
        <Stepper orientation="vertical" sx={{ maxHeight: '300px', overflow: 'auto' }}>
            <Step completed active>
                <StepLabel icon={<InviteCreatedIcon />}>
                    <Stack direction="row" gap={1}>
                        <Typography color="text.secondary">Invite created by</Typography>{' '}
                        <InlineUser user={server.inviteCreatedBy} />
                    </Stack>
                </StepLabel>
            </Step>

            <Step completed active>
                <StepLabel icon={<SubmittedIcon />}>
                    <Stack direction="row" gap={1}>
                        <Typography color="text.secondary">Submitted to the site by</Typography>{' '}
                        <InlineUser user={server.created.by} />
                    </Stack>
                    <span title={new Date(server.created.at).toUTCString()}>
                        <RelativeTimeString time={server.created.at} color="gray" />
                    </span>
                </StepLabel>
            </Step>
            {expandAll ? (
                <>
                    {reversedLog.map((logItem, i) => (
                        <ServerTimelineItem key={i} value={logItem} />
                    ))}
                </>
            ) : (
                lastLogItem !== undefined && (
                    <>
                        {server.statusLog.length > 2 && (
                            <Step completed active>
                                <StepLabel icon={<VisibilityOffIcon />}>
                                    <Typography color="text.secondary">
                                        {server.statusLog.length - 1} Collapsed Entries
                                    </Typography>{' '}
                                    <Link sx={{ cursor: 'pointer' }} onClick={() => setExpandAll(true)}>
                                        Click to reveal
                                    </Link>
                                    .
                                </StepLabel>
                            </Step>
                        )}
                        <ServerTimelineItem value={lastLogItem} />
                    </>
                )
            )}
        </Stepper>
    );
};
