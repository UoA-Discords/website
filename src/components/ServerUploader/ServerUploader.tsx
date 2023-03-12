import CloseIcon from '@mui/icons-material/Close';
import PublishIcon from '@mui/icons-material/Publish';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import { FC, useCallback, useContext, useState } from 'react';
import { api } from '../../api';
import { MainStateContext, SettingsContext, UserSessionContext } from '../../contexts';
import {
    ProfileAccordion,
    ProfileAccordionDetails,
    ProfileAccordionSummary,
} from '../../pages/Profile/ProfilePage.styled';
import { Server } from '../../types/Server';
import { ServerTags } from '../../types/Server/ServerTags';
import { InternalLinkStyled } from '../Links';
import { ServerTagSelector } from '../ServerTagSelector';

export interface ServerUploaderProps {
    onClose: () => void;
    open: boolean;
}

export const ServerUploader: FC<ServerUploaderProps> = ({ onClose, open }) => {
    const { settings } = useContext(SettingsContext);
    const { loggedInUser } = useContext(UserSessionContext);
    const { setLatestError } = useContext(MainStateContext);

    const [tags, setTags] = useState<ServerTags>(0);

    const [inviteCode, setInviteCode] = useState('');

    const [isSaving, setIsSaving] = useState(false);

    const [, setLatestResponse] = useState<Server>();

    const handleReset = useCallback(() => {
        setInviteCode('');
        setTags(0);
    }, []);

    const handleClose = useCallback(() => {
        handleReset();
        onClose();
    }, [handleReset, onClose]);

    const handleSubmit = useCallback(() => {
        if (loggedInUser?.siteAuth === undefined) return;
        if (inviteCode === '') return;

        setIsSaving(true);

        api.putServers(
            {
                baseURL: settings.serverUrl,
                siteToken: loggedInUser.siteAuth,
                rateLimitBypassToken: settings.rateLimitBypassToken,
            },
            inviteCode,
            tags,
        )
            .then((res) => {
                setLatestResponse(res);
                handleReset();
                window.alert(`Successfully submitted server ${res.guildData.name}!`);
            })
            .catch(setLatestError)
            .finally(() => setIsSaving(false));
    }, [
        handleReset,
        inviteCode,
        loggedInUser?.siteAuth,
        setLatestError,
        settings.rateLimitBypassToken,
        settings.serverUrl,
        tags,
    ]);

    return (
        <Dialog maxWidth="md" open={isSaving || open} onClose={handleClose}>
            <DialogTitle textAlign="center">New Submission</DialogTitle>
            <DialogContent>
                <Typography textAlign="center" color="gray" gutterBottom>
                    Be sure to check our <InternalLinkStyled to="/info#faq">submission criteria</InternalLinkStyled>{' '}
                    before submitting.
                </Typography>
                <ProfileAccordion defaultExpanded>
                    <ProfileAccordionSummary>Invite Code</ProfileAccordionSummary>
                    <ProfileAccordionDetails>
                        <TextField
                            variant="standard"
                            label="Invite Code"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            value={inviteCode}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) =>
                                setInviteCode(
                                    e.target.value
                                        .trim()
                                        .replaceAll(/(https?:\/\/)?discord\.(gg|com)\/(invite)?\/?/g, ''),
                                )
                            }
                        />

                        <Typography color="gray">
                            Without the <span style={{ color: 'lightgray' }}>discord.gg/</span> prefix.
                        </Typography>
                    </ProfileAccordionDetails>
                </ProfileAccordion>
                <ProfileAccordion defaultExpanded>
                    <ProfileAccordionSummary>Edit Tags</ProfileAccordionSummary>
                    <ProfileAccordionDetails sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <ServerTagSelector onTagsChange={setTags} tags={tags} />
                    </ProfileAccordionDetails>
                </ProfileAccordion>
            </DialogContent>
            <DialogActions>
                <Grid container spacing={1} justifyContent="flex-end">
                    <Grid item xs={12} sm="auto">
                        <Button
                            variant="outlined"
                            startIcon={isSaving ? <CircularProgress size={20} /> : <PublishIcon />}
                            disabled={isSaving}
                            onClick={handleSubmit}
                            color="success"
                            sx={{ width: '100%' }}
                        >
                            Submit
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm="auto">
                        <Button
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            disabled={isSaving}
                            color="error"
                            onClick={handleClose}
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
