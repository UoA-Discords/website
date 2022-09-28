import { useMemo } from 'react';
import { Box, Modal, Stack, SxProps, Typography, Button } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ExternalLink from '../Links/ExternalLink';

const style: SxProps = {
    position: `absolute`,
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
    width: `min(600px, 90%)`,
    bgcolor: `background.paper`,
    border: `2px solid #333`,
    boxShadow: 24,
    p: 4,
};

/** Modal displayed (originating from {@link ExternalLink}s) when leaving to another site. */
const ExitingSiteModal = ({ open, handleClose, href }: { open: boolean; handleClose: () => void; href: string }) => {
    const url = useMemo(() => new URL(href), [href]);

    return (
        <Modal open={open} onClose={handleClose} disableScrollLock>
            <Box sx={style}>
                <Stack direction="column" alignItems="center" spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <WarningAmberIcon color="warning" fontSize="large" />
                        <Typography variant="h5" textAlign="center">
                            Leaving UoA Discords
                        </Typography>
                    </Stack>
                    <Typography textAlign="center">
                        You are being redirected to{` `}
                        <ExternalLink href={url.origin} skipMask>
                            {url.hostname}
                        </ExternalLink>
                    </Typography>
                    {url.protocol !== `https:` && (
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <WarningAmberIcon color="error" fontSize="large" />
                            <Typography>
                                This site does not have <b>HTTPS</b>, and may be insecure.
                            </Typography>
                        </Stack>
                    )}
                    <Stack direction="row" justifyContent="space-evenly" sx={{ width: `100%`, pt: 2 }}>
                        <ExternalLink href={href} underline="none" skipMask>
                            <Button variant="outlined" color="success" onClick={handleClose}>
                                Continue
                            </Button>
                        </ExternalLink>
                        <Button variant="outlined" onClick={handleClose} color="error">
                            Cancel
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Modal>
    );
};

export default ExitingSiteModal;
