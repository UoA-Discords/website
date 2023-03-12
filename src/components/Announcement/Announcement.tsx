import { Button, Dialog, DialogContent, Paper, Stack, Typography } from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';
import { InlineUser } from '../InlineUser';
import { ExternalLinkStyled, InternalLinkStyled } from '../Links';

const LOCAL_STORAGE_KEY = 'UOA_DISCORDS.AnnouncementEndDate';

// Wednesday the 22nd of March (10 days)
const ANNOUNCEMENT_END_DATE = new Date('2023-03-15').toISOString();

function hasAnnouncementExpired(): boolean {
    if (Date.now() > new Date(ANNOUNCEMENT_END_DATE).getTime()) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return true;
    }
    return false;
}

function hasClosedPreviously(): boolean {
    const existingClosed = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (existingClosed === null) return false;

    if (existingClosed === ANNOUNCEMENT_END_DATE) return true;

    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return false;
}

export const Announcement: FC = () => {
    const [open, setOpen] = useState(hasAnnouncementExpired() ? false : !hasClosedPreviously());

    const [timeTillClose, setTimeTillClose] = useState(30);

    const handleClose = useCallback(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, ANNOUNCEMENT_END_DATE);
        setOpen(false);
    }, []);

    useEffect(() => {
        if (!open) return;

        if (timeTillClose <= 0) {
            handleClose();
            return;
        }

        const interval = setInterval(() => setTimeTillClose(timeTillClose - 1), 1_000);

        return () => clearInterval(interval);
    }, [handleClose, open, timeTillClose]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent sx={{ border: 'solid 3px rgb(236, 208, 140)', p: 0 }}>
                <Paper elevation={1} square sx={{ p: 1 }}>
                    <Stack gap={1}>
                        <Typography variant="h4" textAlign="center" gutterBottom>
                            Version 1.0.0 Released
                        </Typography>
                        <Typography>
                            Hey everyone! I'm excited to announce that the core functionality of UoA Discords is now
                            completed, and servers can start being uploaded to the site!
                        </Typography>
                        <Typography>
                            If you're interested in helping moderate the site, develop/design UoA Discords-related
                            services, or just want to give feedback, be sure to join our{' '}
                            <ExternalLinkStyled href="https://discord.gg/XmdRWSCy2U" title="discord.gg/XmdRWSCy2U">
                                Discord server
                            </ExternalLinkStyled>
                            .
                        </Typography>
                        <Typography>
                            For more information, see our <InternalLinkStyled to="/info#faq">FAQ</InternalLinkStyled>.
                        </Typography>
                        <Typography>Thank you for using UoA Discords,</Typography>
                        <Stack
                            direction="row"
                            sx={{ width: '100%' }}
                            justifyContent="flex-end"
                            alignItems="center"
                            gap={1}
                        >
                            <span>-</span>
                            <InlineUser user="240312568273436674" />
                        </Stack>
                        <Typography color="gray">
                            This announcement will automatically close in {timeTillClose} second
                            {timeTillClose !== 1 ? 's' : ''}.
                        </Typography>
                        <Button onClick={handleClose} variant="outlined" sx={{ alignSelf: 'flex-end' }} color="error">
                            Close
                        </Button>
                    </Stack>
                </Paper>
            </DialogContent>
        </Dialog>
    );
};

export const AnnouncementResetButton: FC = () => {
    const [previouslyClosed, setPreviouslyClosed] = useState(hasClosedPreviously());

    useEffect(() => {
        setPreviouslyClosed(hasClosedPreviously());
    }, []);

    if (!previouslyClosed) return <></>;

    return (
        <Button
            onClick={() => {
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                setPreviouslyClosed(false);
            }}
            variant="outlined"
            sx={{ textTransform: 'none' }}
        >
            Click to unhide the latest homepage announcement.
        </Button>
    );
};
