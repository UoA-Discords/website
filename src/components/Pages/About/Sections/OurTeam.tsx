import { Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllStaff, loadAllStaff } from '../../../../redux/slices/userManager';
import { AppDispatch } from '../../../../redux/store';
import TimestampTooltip from '../../../Tooltips/TimestampTooltip';
import UserInfoCard from '../../../UserInfoCard';
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
            <Grid container spacing={1}>
                {staff.map((e, i) => (
                    <Grid item key={i} sx={{ m: 0, p: 0 }}>
                        <UserInfoCard user={e} paperProps={{ square: false, sx: { m: 0 } }}>
                            <span>
                                <TimestampTooltip
                                    theme="light"
                                    tooltipProps={{ placement: `bottom` }}
                                    timestamp={e.lastLogin}
                                    prefixString="Last seen "
                                />
                            </span>
                        </UserInfoCard>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default OurTeam;
