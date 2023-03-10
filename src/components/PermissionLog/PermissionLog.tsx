import { Stack, Divider, Grid, Typography } from '@mui/material';
import { FC, memo } from 'react';
import { hasPermissions } from '../../helpers/hasPermissions';
import { splitBitfield } from '../../helpers/splitBitfield';
import { User } from '../../types/User';
import { UserPermissions } from '../../types/User/UserPermissions';
import { InlineUser } from '../InlineUser';
import { RelativeTimeString } from '../RelativeTimeString';
import { PermissionAdded, PermissionLogStack, PermissionRemoved } from './PermissionLog.styled';

export interface PermissionLogProps {
    latestPermissions: UserPermissions;
    log: User['permissionsLog'];
}

const _PermissionLog: FC<PermissionLogProps> = ({ latestPermissions, log }) => (
    <PermissionLogStack divider={<Divider flexItem />} spacing={1}>
        {log.map(({ at, by, oldUserPermissions, reason }, i) => {
            const newPermissions = log[i - 1]?.oldUserPermissions ?? latestPermissions;

            const added = splitBitfield(newPermissions).filter((e) => !hasPermissions(oldUserPermissions, e));

            const removed = splitBitfield(oldUserPermissions).filter((e) => !hasPermissions(newPermissions, e));

            return (
                <Grid container key={i}>
                    <Grid item xs={12} sx={{ mb: 1 }}>
                        <Stack direction="row" flexWrap="wrap">
                            {added.map((e, i) => (
                                <PermissionAdded value={e} key={i} />
                            ))}
                            {removed.map((e, i) => (
                                <PermissionRemoved value={e} key={i} />
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
    </PermissionLogStack>
);

export const PermissionsLog = memo(_PermissionLog);
