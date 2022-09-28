import { Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllStaff, loadAllStaff } from '../../../../redux/slices/userManager';
import { AppDispatch } from '../../../../redux/store';
import { SiteUser, UserPermissionLevels } from '../../../../shared/Types/User';
import ProfilePicture from '../../../ProfilePicture';

const UserProfile = ({ user }: { user: SiteUser }) => {
    return (
        <Paper sx={{ p: 1 }}>
            <Stack direction="row" spacing={1}>
                <ProfilePicture user={user} />
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
    );
};

const OurTeam = () => {
    const dispatch = useDispatch<AppDispatch>();

    const staff = useSelector(getAllStaff);

    useEffect(() => {
        if (staff === null) {
            dispatch(loadAllStaff());
        }
    }, [dispatch, staff]);

    if (staff === null) {
        return (
            <Paper sx={{ m: 1, p: 2 }} elevation={12}>
                <Stack direction="column" alignItems="center" spacing={2}>
                    <Typography color="text.secondary">Loading...</Typography>
                    <LinearProgress variant="indeterminate" sx={{ width: `100px` }} />
                </Stack>
            </Paper>
        );
    }

    return (
        <Paper sx={{ m: 1, p: 2 }} elevation={12}>
            <Grid container>
                {staff.map((e) => (
                    <Grid item key={e.id}>
                        <UserProfile user={e} />
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default OurTeam;
