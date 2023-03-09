import { Stack, Divider, Grid, Typography } from '@mui/material';
import React from 'react';
import { hasPermissions } from '../../helpers/hasPermissions';
import { splitBitfield } from '../../helpers/splitBitfield';
import { User } from '../../types/User';
import { UserPermissions } from '../../types/User/UserPermissions';
import { InlineUser } from '../InlineUser';
import { Permission } from '../Permission/Permission';
import { RelativeTimeString } from '../RelativeTimeString';

export interface PermissionLogProps {
    latestPermissions: UserPermissions;
    log: User['permissionsLog'];
}

const _PermissionLog: React.FC<PermissionLogProps> = ({ latestPermissions, log }) => (
    <Stack divider={<Divider flexItem />} spacing={1} sx={{ maxHeight: '300px', overflowY: 'auto', pr: 1 }}>
        {log.map(({ at, by, oldUserPermissions, reason }, i) => {
            const newPermissions = log[i - 1]?.oldUserPermissions ?? latestPermissions;

            const added = splitBitfield(newPermissions).filter((e) => !hasPermissions(oldUserPermissions, e));
            const removed = splitBitfield(oldUserPermissions).filter((e) => !hasPermissions(newPermissions, e));

            return (
                <Grid container key={i}>
                    <Grid item xs={12}>
                        <Stack direction="row" flexWrap="wrap">
                            {added.map((e, i) => (
                                <Permission
                                    value={e}
                                    key={i}
                                    sx={{
                                        backgroundColor: 'rgba(144, 238, 144, 0.1)',
                                        p: 1,
                                        flexGrow: 'unset',
                                    }}
                                />
                            ))}
                            {removed.map((e, i) => (
                                <Permission
                                    value={e}
                                    key={i}
                                    sx={{
                                        backgroundColor: 'rgba(240, 128, 128, 0.1)',
                                        p: 1,
                                        flexGrow: 'unset',
                                    }}
                                />
                            ))}
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        {reason ? (
                            <Typography>{reason}</Typography>
                        ) : (
                            <Typography color="gray">
                                <i>No reason specified.</i>
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} textAlign="right">
                        <InlineUser user={by} />
                    </Grid>
                    <Grid item xs={12} container justifyContent="space-between">
                        {new Date(at).toLocaleDateString('en-NZ')}
                        <RelativeTimeString color="gray" time={at} inBrackets />
                    </Grid>
                </Grid>
            );
        })}
    </Stack>
);

export const PermissionsLog = React.memo(_PermissionLog);
