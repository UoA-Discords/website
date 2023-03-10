import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import {
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../../api';
import { MainStateContext, SettingsContext, UserSessionContext } from '../../contexts';
import { badgeIconMap } from '../../helpers/badgeIconMap';
import { hasPermissions } from '../../helpers/hasPermissions';
import { User } from '../../types/User';
import { UserPermissions } from '../../types/User/UserPermissions';
import { Permission } from '../Permission';

export interface PermissionEditorProps {
    targetUser: User<'HideIP' | 'ShowIP'>;
    onClose: () => void;
    isOpen: boolean;
    onSuccess: (updatedUser: User<'HideIP' | 'ShowIP'>) => void;
}

const allPermissions = Object.values(UserPermissions).filter((e): e is UserPermissions => typeof e === 'number');

export const PermissionEditor: FC<PermissionEditorProps> = (props) => {
    const { targetUser, onClose, isOpen, onSuccess } = props;

    const { settings } = useContext(SettingsContext);
    const { loggedInUser } = useContext(UserSessionContext);
    const { setLatestError } = useContext(MainStateContext);

    const [newPermissions, setNewPermissions] = useState(targetUser.permissions);

    const [reason, setReason] = useState('');

    const [isSaving, setIsSaving] = useState(false);

    const hasChanged = useMemo(
        () => targetUser.permissions !== newPermissions,
        [newPermissions, targetUser.permissions],
    );

    const handleCheck = useCallback(
        (permission: UserPermissions) => {
            return (e: React.ChangeEvent<HTMLInputElement>) => {
                if (isSaving) return;

                if (e.target.checked) setNewPermissions(newPermissions | permission);
                else setNewPermissions(newPermissions ^ permission);
            };
        },
        [isSaving, newPermissions],
    );

    const handleSave = useCallback(() => {
        if (loggedInUser?.siteAuth === undefined) return;
        if (newPermissions === targetUser.permissions) return;
        if (reason === '') return;

        setIsSaving(true);

        api.patchUserById(
            {
                baseURL: settings.serverUrl,
                siteToken: loggedInUser.siteAuth,
                rateLimitBypassToken: settings.rateLimitBypassToken,
            },
            targetUser._id,
            newPermissions,
            reason,
        )
            .then((res) => {
                onSuccess(res);
                setIsSaving(false);
            })
            .catch(setLatestError)
            .finally(() => {
                setIsSaving(false);
            });
    }, [
        loggedInUser?.siteAuth,
        newPermissions,
        onSuccess,
        reason,
        setLatestError,
        settings.rateLimitBypassToken,
        settings.serverUrl,
        targetUser._id,
        targetUser.permissions,
    ]);

    useEffect(() => {
        setNewPermissions(targetUser.permissions);
        setReason('');
    }, [targetUser.permissions]);

    return (
        <Dialog maxWidth="md" open={isSaving || isOpen} onClose={onClose}>
            <DialogTitle textAlign="center">{targetUser.discord.username}'s Permissions</DialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    {allPermissions.map((permission) => (
                        <Grid item xs={12} sm={6} key={permission}>
                            <FormControl>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={hasPermissions(newPermissions, permission)}
                                            onChange={handleCheck(permission)}
                                        />
                                    }
                                    componentsProps={{ typography: { width: '100%' } }}
                                    label={<Permission value={permission} />}
                                />
                                <FormLabel>
                                    <Typography color="text.secondary">{badgeIconMap[permission].title}</Typography>
                                </FormLabel>
                            </FormControl>
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <TextField
                            sx={{ mt: 1 }}
                            required
                            variant="standard"
                            label="Reason"
                            name="reason"
                            placeholder="Just a short sentence."
                            fullWidth
                            value={reason}
                            onChange={(e) => setReason(e.target.value.slice(0, 100))}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid container spacing={1} justifyContent="flex-end">
                    <Grid item xs={12} sm="auto">
                        <Button
                            variant="outlined"
                            startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                            disabled={!hasChanged || isSaving || reason === ''}
                            onClick={handleSave}
                            sx={{ width: '100%' }}
                        >
                            Save
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm="auto">
                        <Button
                            variant="outlined"
                            startIcon={<RestartAltIcon />}
                            disabled={!hasChanged || isSaving}
                            onClick={(e) => {
                                e.preventDefault();
                                setNewPermissions(targetUser.permissions);
                                setReason('');
                            }}
                            sx={{ width: '100%' }}
                        >
                            Reset
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm="auto">
                        <Button
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            disabled={isSaving}
                            onClick={(e) => {
                                e.preventDefault();
                                onClose();
                            }}
                            sx={{ width: '100%' }}
                        >
                            Close
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};
