import CreateIcon from '@mui/icons-material/Create';
import { Button, Skeleton, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { InlineUser } from '../../components/InlineUser';
import { PermissionEditor } from '../../components/PermissionEditor';
import { PermissionList } from '../../components/PermissionList';
import { RelativeTimeString } from '../../components/RelativeTimeString';
import { useCanEdit } from '../../hooks/useCanEdit';
import { User } from '../../types/User';

export interface UserRowProps {
    user: User<'HideIP' | 'ShowIP'>;
    isRevealingIps: boolean;
    onUpdate: (updatedUser: User<'HideIP' | 'ShowIP'>) => void;
}

export const UserRowSkeleton: FC<Pick<UserRowProps, 'isRevealingIps'>> = ({ isRevealingIps }) => (
    <TableRow>
        <TableCell>
            <Stack direction="row" spacing={1}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" sx={{ flexGrow: 1 }} />
            </Stack>
        </TableCell>
        {isRevealingIps && (
            <TableCell>
                <Skeleton variant="text" />
            </TableCell>
        )}
        <TableCell>
            <Skeleton variant="text" />
        </TableCell>
        <TableCell>
            <Skeleton variant="text" />
        </TableCell>
        <TableCell>
            <Skeleton variant="text" />
        </TableCell>
    </TableRow>
);

export const UserRow: FC<UserRowProps> = ({ user, isRevealingIps, onUpdate }) => {
    const [isPermissionEditorOpen, setIsPermissionEditorOpen] = useState(false);

    const canEdit = useCanEdit(user);

    return (
        <TableRow hover>
            <TableCell>
                <InlineUser user={user} />
            </TableCell>
            {isRevealingIps && (
                <TableCell>
                    <Typography>{user.metaData.latestIp}</Typography>
                </TableCell>
            )}
            <TableCell>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <PermissionList permissions={user.permissions} showAll justifyContent="flex-start" />
                    {canEdit && (
                        <>
                            <PermissionEditor
                                targetUser={user}
                                onClose={() => setIsPermissionEditorOpen(false)}
                                isOpen={isPermissionEditorOpen}
                                onSuccess={onUpdate}
                            />
                            <Button
                                variant="outlined"
                                color="info"
                                startIcon={<CreateIcon />}
                                size="small"
                                onClick={() => setIsPermissionEditorOpen(true)}
                            >
                                Edit
                            </Button>
                        </>
                    )}
                </Stack>
            </TableCell>
            <TableCell>
                <Typography title={new Date(user.metaData.registered).toUTCString()}>
                    {new Date(user.metaData.registered).toLocaleDateString('en-NZ')}
                    <br />
                    <RelativeTimeString time={user.metaData.registered} color="gray" whiteSpace="nowrap" />
                </Typography>
            </TableCell>
            <TableCell>
                <Typography title={new Date(user.metaData.lastLoginOrRefresh).toUTCString()}>
                    {new Date(user.metaData.lastLoginOrRefresh).toLocaleDateString('en-NZ')}
                    <br />
                    <RelativeTimeString time={user.metaData.lastLoginOrRefresh} color="gray" whiteSpace="nowrap" />
                </Typography>
            </TableCell>
        </TableRow>
    );
};
