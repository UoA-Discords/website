import React from 'react';
import { Paper, PaperProps, Typography, Stack } from '@mui/material';
import { BasicUserInfo, UserPermissionLevels } from '../../shared/Types/User';
import ProfilePicture from '../ProfilePicture';

/**
 * Card that displays information about a basic user, such as their:
 *
 * - Username
 * - Discriminator
 * - Permission Level
 * - Avatar
 */
const UserInfoCard = ({
    user,
    children,
    paperProps,
}: {
    /** The user who's data is being displayed. */
    user: BasicUserInfo;
    /** Additional elements to include in the card body. */
    children?: React.ReactNode;
    /** Additional props to pass in to the {@link Paper} element. */
    paperProps?: PaperProps;
}) => {
    return (
        <Paper variant="outlined" square {...paperProps} sx={{ p: 1, m: 1, ...paperProps?.[`sx`] }}>
            <Stack direction="row" spacing={1}>
                <ProfilePicture user={user} />
                <Stack>
                    <Typography sx={{ whiteSpace: `nowrap` }}>
                        {user.username}
                        <span style={{ color: `gray` }}>#{user.discriminator}</span>
                    </Typography>
                    {user.permissionLevel > UserPermissionLevels.Default && (
                        <Typography color="#7289da">{UserPermissionLevels[user.permissionLevel]!}</Typography>
                    )}
                    {children}
                </Stack>
            </Stack>
        </Paper>
    );
};

export default UserInfoCard;
