import { Box, Modal, SxProps, Typography, Button, Stack, Grid, Stepper, Step, StepLabel, Paper } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { EntryStates, FullEntry } from '../../../shared/Types/Entries';
import GuildIcon from '../../GuildIcon';
import ExternalLink from '../../Links/ExternalLink';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import DarkTooltip from '../../Tooltips/DarkTooltip';

import InviteCreatedIcon from '@mui/icons-material/Link';
import SubmittedIcon from '@mui/icons-material/AddBox';
import ApprovedIcon from '@mui/icons-material/Check';
import ShareIcon from '@mui/icons-material/Share';

import discordIcon from '../../../images/discordIcon.svg';
import { FacultyTag } from '../../TagSelector';
import UserInfoCard from '../../UserInfoCard';

dayjs.extend(relativeTime);

const style: SxProps = {
    position: `absolute`,
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
    width: `min(1024px, 90%)`,
    bgcolor: `background.paper`,
    border: `2px solid gray`,
    boxShadow: 24,
    p: 4,
};

const ServerFoundModal = ({
    entry,
    open,
    onClose,
}: {
    entry: FullEntry<EntryStates.Approved | EntryStates.Featured>;
    open: boolean;
    onClose: () => void;
}) => {
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

    return (
        <Modal open={open} onClose={handleClose} disableScrollLock>
            <Box sx={style}>
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
                                    {entry.memberCountHistory.at(-1)?.[0] ?? `0`} Members (
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
                            {/* <Typography sx={{ p: 1, border: `solid 1px #333` }}> */}
                            {/* </Typography> */}
                            <Paper sx={{ p: 2 }} variant="outlined">
                                {entry.guildData.description}
                            </Paper>
                        </Grid>
                    )}
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
                    <Grid item xs={12} md={6}>
                        <Stepper orientation="vertical">
                            {entry.inviteCreatedBy !== null && entry.inviteCreatedBy.id !== entry.createdBy.id && (
                                <Step completed active>
                                    <StepLabel icon={<InviteCreatedIcon />}>
                                        <Typography>
                                            Invite by{` `}
                                            <UserInfoCard placement="left" user={entry.inviteCreatedBy} />
                                        </Typography>
                                    </StepLabel>
                                </Step>
                            )}
                            <Step completed active>
                                <StepLabel icon={<SubmittedIcon />}>
                                    <Typography>
                                        Submitted by{` `}
                                        <UserInfoCard placement="left" user={entry.createdBy} />
                                        &nbsp;
                                        <DarkTooltip
                                            title={
                                                <Typography>
                                                    {new Date(entry.createdAt).toLocaleString(`en-NZ`, {
                                                        dateStyle: `medium`,
                                                        timeStyle: `short`,
                                                    })}
                                                </Typography>
                                            }
                                            placement="right"
                                        >
                                            <span style={{ cursor: `help`, color: `gray` }}>
                                                {dayjs(entry.createdAt).fromNow()}
                                            </span>
                                        </DarkTooltip>
                                    </Typography>
                                </StepLabel>
                            </Step>
                            <Step completed active>
                                <StepLabel icon={<ApprovedIcon />}>
                                    <Typography>
                                        {EntryStates[entry.state]} by{` `}
                                        <UserInfoCard placement="left" user={entry.stateActionDoneBy} />
                                        &nbsp;
                                        <DarkTooltip
                                            title={
                                                <Typography>
                                                    {` `}
                                                    {new Date(entry.stateActionDoneAt).toLocaleString(`en-NZ`, {
                                                        dateStyle: `medium`,
                                                        timeStyle: `short`,
                                                    })}
                                                </Typography>
                                            }
                                            placement="right"
                                        >
                                            <span style={{ cursor: `help`, color: `gray` }}>
                                                after {dayjs(entry.stateActionDoneAt).from(entry.createdAt, true)}
                                            </span>
                                        </DarkTooltip>
                                    </Typography>
                                </StepLabel>
                            </Step>
                        </Stepper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div>
                            Verification Level:{` `}
                            {[`None`, `Low`, `Medium`, `High`, `Very High`][entry.guildData.verificationLevel]}
                        </div>
                        <div>Likes: {entry.likes}</div>
                        <div>ID: {entry.id}</div>
                        <div>History Length: {entry.memberCountHistory.length} Days</div>
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
            </Box>
        </Modal>
    );
};

export default ServerFoundModal;
