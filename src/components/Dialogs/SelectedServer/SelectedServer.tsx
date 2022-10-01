import React, { useCallback, useEffect, useState } from 'react';
import { Typography, Button, Stack, Grid, Paper, Dialog, useTheme, useMediaQuery } from '@mui/material';
import { EntryStates, FullEntry } from '../../../shared/Types/Entries';
import ServerGraph from './ServerGraph';

// local components
import GuildIcon from '../../GuildIcon';
import ExternalLink from '../../Links/ExternalLink';
import { FacultyTag } from '../../TagSelector';

// icons
import ShareIcon from '@mui/icons-material/Share';
import discordIcon from '../../../images/discordIcon.svg';

// tooltips
import DarkTooltip from '../../Tooltips/DarkTooltip';
import ServerTimeline from './ServerTimeline';

/** Modal for a approved/featured server that is currently selected. */
const SelectedServerDialog = ({
    entry,
    open,
    onClose,
}: {
    entry: FullEntry<EntryStates.Approved | EntryStates.Featured>;
    open: boolean;
    onClose: () => void;
}) => {
    const theme = useTheme();

    const handleClose = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onClose();
        },
        [onClose],
    );

    const [copySuccess, setCopySuccess] = useState<boolean | null>(null);

    const copyLink = useCallback(async () => {
        const res = await navigator.permissions.query({ name: `clipboard-write` as PermissionName });
        if (res.state === `granted` || res.state === `prompt`) {
            await navigator.clipboard.writeText(`${window.location.origin}/?server=${entry.id}`);
            setCopySuccess(true);
        } else {
            setCopySuccess(false);
        }
    }, [entry.id]);

    useEffect(() => {
        if (copySuccess === true) {
            const myTimeout = setTimeout(() => setCopySuccess(null), 3_000);

            return () => clearTimeout(myTimeout);
        }
    }, [copySuccess]);

    const smallOrAbove = useMediaQuery(theme.breakpoints.up(`sm`));

    return (
        <Dialog open={open} onClose={handleClose} disableScrollLock maxWidth="lg">
            <Paper variant="outlined" sx={{ border: `solid 2px gray`, p: 4 }}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={6} md={3} sx={{ height: `fit-content` }}>
                        <div style={{ display: `flex`, justifyContent: `center`, alignItems: `center` }}>
                            <GuildIcon server={entry} sx={{ p: 0 }} />
                        </div>
                    </Grid>
                    <Grid item container xs={12} sm={6} md={9} justifyContent="center">
                        <Typography variant="h3" gutterBottom textAlign="center">
                            {entry.guildData.name}
                        </Typography>
                        <Grid item container spacing={1} alignItems="center">
                            <Grid item container xs={12} md={6} justifyContent="center">
                                <ExternalLink href={`https://discord.gg/${entry.inviteCode}`} underline="none">
                                    <Button
                                        sx={{ textTransform: `none` }}
                                        variant="outlined"
                                        size="large"
                                        color="secondary"
                                        startIcon={
                                            <img src={discordIcon} alt="Discord logo" style={{ width: `25px` }} />
                                        }
                                    >
                                        {entry.inviteCode}
                                    </Button>
                                </ExternalLink>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography color="gray" textAlign="center">
                                    {entry.memberCountHistory.at(-1)?.[1] ?? `0`} Members (
                                    <span style={{ color: `lightgreen` }}>
                                        {entry.memberCountHistory.at(-1)?.[0] ?? `0`}
                                    </span>
                                    {` `}
                                    Online)
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    {entry.guildData.description !== null && (
                        <Grid item container xs={12} justifyContent="center" sx={{ mt: 1 }}>
                            <Paper sx={{ p: 2 }} variant="outlined">
                                {entry.guildData.description}
                            </Paper>
                        </Grid>
                    )}
                    <Grid item container xs={12} md={6} justifyContent="center" spacing={1}>
                        {entry.facultyTags.length > 0 && (
                            <Grid item xs={12}>
                                <Typography color="gray">Tags ({entry.facultyTags.length})</Typography>
                                <Stack direction="row" gap={1} mt={0.5}>
                                    {entry.facultyTags.map((tag, i) => (
                                        <FacultyTag tag={tag} key={i} />
                                    ))}
                                </Stack>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <ServerTimeline entry={entry} />
                        </Grid>
                    </Grid>
                    {smallOrAbove && entry.memberCountHistory.length > 1 && (
                        <Grid item xs={12} md={6}>
                            <ServerGraph historyData={entry.memberCountHistory} />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <div>
                            Verification Level:{` `}
                            {[`None`, `Low`, `Medium`, `High`, `Very High`][entry.guildData.verificationLevel]}
                        </div>
                        <div>Likes: {entry.likes}</div>
                        <div>ID: {entry.id}</div>
                        <DarkTooltip
                            title={
                                <Typography>
                                    {copySuccess === null
                                        ? `Copy link to this server`
                                        : copySuccess
                                        ? `Copied!`
                                        : `Unable to copy`}
                                </Typography>
                            }
                        >
                            <Button
                                variant="outlined"
                                color={copySuccess === null ? `primary` : copySuccess ? `success` : `error`}
                                sx={{ m: 1 }}
                                size="large"
                                onClick={copyLink}
                            >
                                <ShareIcon />
                            </Button>
                        </DarkTooltip>
                    </Grid>
                </Grid>
                <Stack direction="column" alignItems="center" spacing={3} sx={{ mt: 3 }}>
                    <Button variant="outlined" size="large" onClick={handleClose}>
                        Close
                    </Button>
                </Stack>
            </Paper>
        </Dialog>
    );
};

export default SelectedServerDialog;
