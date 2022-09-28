import { Paper, Tooltip, TooltipProps, Typography } from '@mui/material';
import { Stack, Link } from '@mui/material';
import { BasicUserInfo, UserPermissionLevels } from '../../shared/Types/User';
import ProfilePicture from '../ProfilePicture';

export interface UserInfoCardProps extends Omit<TooltipProps, `title` | `children`> {
    user: BasicUserInfo;
}

const UserInfoCard = (props: UserInfoCardProps) => {
    const { user } = props;
    return (
        <Tooltip
            enterDelay={0}
            TransitionProps={{ timeout: 0 }}
            components={{ Tooltip: Paper }}
            title={
                <Paper sx={{ p: 1, m: 1 }} variant="outlined" square>
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
                        </Stack>
                    </Stack>
                </Paper>
            }
            {...props}
        >
            <Link underline="none" sx={{ cursor: `help` }} component="span">
                <ProfilePicture user={user} height={20} width={20} style={{ marginBottom: `-4px` }} />
                &nbsp;
                {user.username}
            </Link>
        </Tooltip>
    );
};

export default UserInfoCard;
