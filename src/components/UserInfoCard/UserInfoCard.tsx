import { Paper, Tooltip, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { ReactElement } from 'react';
import { getProfilePicture } from '../../helpers/getProfilePicture';
import { BasicUserInfo, UserPermissionLevels } from '../../shared/Types/User';

const UserInfoCard = ({ user, children }: { user: BasicUserInfo; children: ReactElement }) => {
    const { alt, src } = getProfilePicture(user);

    return (
        <Tooltip
            children={children}
            enterDelay={0}
            TransitionProps={{ timeout: 0 }}
            components={{ Tooltip: Paper }}
            title={
                <Paper sx={{ p: 1, mt: 1 }} variant="outlined" square>
                    <Stack direction="row" spacing={1}>
                        <img width="64" height="64" src={src} alt={alt} className="discordProfilePicture" />
                        <Stack>
                            <Typography sx={{ whiteSpace: `nowrap` }}>
                                {user.username}#<span style={{ color: `gray` }}>{user.discriminator}</span>
                            </Typography>
                            {user.permissionLevel > UserPermissionLevels.Default && (
                                <Typography color="#7289da">{UserPermissionLevels[user.permissionLevel]!}</Typography>
                            )}
                        </Stack>
                    </Stack>
                </Paper>
            }
        />
    );
};

export default UserInfoCard;
