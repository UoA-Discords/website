import ClearIcon from '@mui/icons-material/Clear';
import CreateIcon from '@mui/icons-material/Create';
import SaveIcon from '@mui/icons-material/Save';
import {
    Button,
    CircularProgress,
    Dialog,
    Fade,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { FC, useCallback, useContext, useMemo, useState } from 'react';
import { api } from '../../api';
import { SettingsContext, UserSessionContext, MainStateContext } from '../../contexts';
import { splitBitfield } from '../../helpers/splitBitfield';
import { useCanFeatureServers } from '../../hooks/useCanFeatureServers';
import { useCanManageServers } from '../../hooks/useCanManageServers';
import Question from '../../images/Question.png';
import { Server } from '../../types/Server';
import { ServerStatus } from '../../types/Server/ServerStatus';
import { GuildIcon } from '../GuildIcon';
import { ExternalLinkStyled, InternalLinkStyled } from '../Links';
import { RelativeTimeString } from '../RelativeTimeString';
import { ServerTagSelector } from '../ServerTagSelector';
import { ServerTimeline } from './ServerTimeline';

export interface ServerDialogProps {
    open: boolean;
    onClose: () => void;
    server: Server;
    onChange: (updatedServer: Server) => void;
}

const allStatuses = Object.values(ServerStatus).filter((e): e is ServerStatus => typeof e === 'number');

export const ServerDialog: FC<ServerDialogProps> = ({ open, onClose, server, onChange }) => {
    const { settings } = useContext(SettingsContext);
    const { loggedInUser } = useContext(UserSessionContext);
    const { setLatestError } = useContext(MainStateContext);

    const theme = useTheme();
    const small = useMediaQuery(theme.breakpoints.down('sm'));
    const canEdit = useCanManageServers();
    const canFeature = useCanFeatureServers();

    const [newTags, setNewTags] = useState(server.serverTags);
    const [editingTags, setEditingTags] = useState(false);

    const [submittingStatusUpdate, setSubmittingStatusUpdate] = useState(false);
    const [submittingTagUpdate, setSubmittingTagUpdate] = useState(false);

    const splitTags = useMemo(() => splitBitfield(server.serverTags), [server.serverTags]);

    const dirtiedTags = useMemo(() => newTags !== server.serverTags, [newTags, server.serverTags]);

    const serverLink = useMemo(() => `https://discord.gg/${server.inviteCode}`, [server.inviteCode]);

    const changeableStatuses = useMemo<ServerStatus[]>(() => {
        if (!canEdit) return [];
        if (!canFeature) return allStatuses.filter((e) => e !== ServerStatus.Featured);
        return allStatuses;
    }, [canEdit, canFeature]);

    const handleClose = useCallback(() => {
        if (submittingStatusUpdate || submittingTagUpdate) return;
        setNewTags(server.serverTags);
        setEditingTags(false);
        onClose();
    }, [onClose, server.serverTags, submittingStatusUpdate, submittingTagUpdate]);

    const handleTagUpdate = useCallback(() => {
        if (loggedInUser?.siteAuth === undefined) return;

        setSubmittingTagUpdate(true);

        api.patchServerTagsById(
            {
                baseURL: settings.serverUrl,
                siteToken: loggedInUser.siteAuth,
                rateLimitBypassToken: settings.rateLimitBypassToken,
            },
            server._id,
            newTags,
        )
            .then(onChange)
            .catch(setLatestError)
            .finally(() => {
                setSubmittingTagUpdate(false);
                setEditingTags(false);
            });
    }, [
        loggedInUser?.siteAuth,
        newTags,
        onChange,
        server._id,
        setLatestError,
        settings.rateLimitBypassToken,
        settings.serverUrl,
    ]);

    const handleStatusUpdate = useCallback(
        (newStatus: ServerStatus) => {
            if (loggedInUser?.siteAuth === undefined) return;

            const reason = prompt('Enter a reason for the status change (or leave blank):');

            if (reason === null) return;

            setSubmittingStatusUpdate(true);

            api.patchServerStatusById(
                {
                    baseURL: settings.serverUrl,
                    siteToken: loggedInUser.siteAuth,
                    rateLimitBypassToken: settings.rateLimitBypassToken,
                },
                server._id,
                newStatus,
                reason || null,
            )
                .then(onChange)
                .catch(setLatestError)
                .finally(() => {
                    setSubmittingStatusUpdate(false);
                });
        },
        [
            loggedInUser?.siteAuth,
            onChange,
            server._id,
            setLatestError,
            settings.rateLimitBypassToken,
            settings.serverUrl,
        ],
    );

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md">
            <Paper variant="outlined" sx={{ border: 'solid 2px gray', p: 4 }}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={6} md={3} sx={{ height: 'fit-content' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <GuildIcon icon={server.guildData.icon} id={server._id} sx={{ p: 0 }} />
                        </div>
                    </Grid>
                    <Grid item container xs={12} sm={6} md={9} justifyContent="center">
                        <Typography variant="h3" gutterBottom textAlign="center">
                            {server.guildData.name}
                        </Typography>
                        <Grid item container spacing={1} justifyContent="center" alignItems="center">
                            <Grid item xs={12} md={6} textAlign="center">
                                <ExternalLinkStyled href={serverLink} title="Discord server link">
                                    {small ? `discord.gg/${server.inviteCode}` : serverLink}
                                </ExternalLinkStyled>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography color="gray" textAlign="center">
                                    {server.size.total} Members (
                                    <span style={{ color: 'lightgreen' }}>{server.size.online}</span> Online)
                                    <br />
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    {server.guildData.description !== null && (
                        <Grid item xs={12} container justifyContent="center" sx={{ mt: 1 }}>
                            <Paper sx={{ p: 2 }} variant="outlined">
                                {server.guildData.description}
                            </Paper>
                        </Grid>
                    )}
                    {server._id === '965524576119447553' && (
                        <Grid item xs={12} container justifyContent="center" sx={{ mt: 1 }}>
                            <img
                                src={Question}
                                alt="A silly question"
                                style={{ maxHeight: '100%', maxWidth: '100%' }}
                            />
                        </Grid>
                    )}
                    <Grid item container xs={12} md={6} justifyContent="center" spacing={1}>
                        {(splitTags.length > 0 || canEdit) && (
                            <Grid item container xs={12} spacing={0.5}>
                                <Grid item xs={12}>
                                    <Stack direction="row" gap={1} alignItems="center">
                                        <Typography color="gray">
                                            Tag{splitTags.length !== 1 ? 's' : ''} ({splitTags.length})
                                        </Typography>
                                        {canEdit && (
                                            <>
                                                <Fade in={!editingTags}>
                                                    <IconButton
                                                        title="Edit tags"
                                                        size="small"
                                                        onClick={() => setEditingTags(true)}
                                                    >
                                                        <CreateIcon color="info" />
                                                    </IconButton>
                                                </Fade>
                                                <Fade in={editingTags}>
                                                    <IconButton
                                                        title="Save"
                                                        size="small"
                                                        color="success"
                                                        onClick={handleTagUpdate}
                                                        disabled={!dirtiedTags || submittingTagUpdate}
                                                    >
                                                        <SaveIcon />
                                                    </IconButton>
                                                </Fade>
                                                <Fade in={editingTags}>
                                                    <IconButton
                                                        title="Cancel"
                                                        size="small"
                                                        color="error"
                                                        onClick={() => {
                                                            setEditingTags(false);
                                                            setNewTags(server.serverTags);
                                                        }}
                                                        disabled={submittingTagUpdate}
                                                    >
                                                        <ClearIcon />
                                                    </IconButton>
                                                </Fade>
                                                <Fade in={submittingTagUpdate}>
                                                    <CircularProgress size={20} />
                                                </Fade>
                                            </>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <ServerTagSelector
                                        tags={newTags}
                                        onTagsChange={editingTags ? (newTags) => setNewTags(newTags) : undefined}
                                    />
                                </Grid>
                            </Grid>
                        )}
                        {!small && (
                            <Grid item container xs={12}>
                                <Grid item xs={12}>
                                    <Typography color="gray">Timeline ({server.statusLog.length + 2})</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <ServerTimeline server={server} />
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <div>ID: {server._id}</div>
                        {canEdit ? (
                            <div>
                                Status:{' '}
                                <Select
                                    variant="standard"
                                    size="small"
                                    value={server.status}
                                    onChange={(e) => {
                                        if (typeof e.target.value === 'string') return;
                                        handleStatusUpdate(e.target.value);
                                    }}
                                >
                                    {changeableStatuses.map((e) => (
                                        <MenuItem key={e} value={e}>
                                            {ServerStatus[e]}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                        ) : (
                            <div>Status: {ServerStatus[server.status]}</div>
                        )}
                        <div title={new Date(server.size.lastUpdated).toUTCString()}>
                            Last Updated: <RelativeTimeString time={server.size.lastUpdated} />
                        </div>
                        <Typography color="gray">
                            Notice something strange with this server?{' '}
                            <InternalLinkStyled to="/info#contact">Contact us</InternalLinkStyled>.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm="auto">
                        <Button
                            variant="outlined"
                            size="large"
                            disabled={submittingStatusUpdate || submittingTagUpdate}
                            onClick={handleClose}
                            sx={{ width: '100%' }}
                        >
                            Close
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Dialog>
    );
};
