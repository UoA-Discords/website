import { Box, Modal, SxProps, Typography, Button, Stack } from '@mui/material';
import { useState } from 'react';
import InternalLink from '../../Links/InternalLink';

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

const ServerNotFoundModal = ({ id }: { id: string }) => {
    const [open, setOpen] = useState(true);

    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={style}>
                <Stack direction="column" alignItems="center" spacing={3}>
                    <Typography variant="h4" textAlign="center">
                        Oops!
                    </Typography>
                    <Typography textAlign="center">
                        The server you are looking for doesn't exist on our website.
                    </Typography>
                    <Typography textAlign="center">
                        If you think this is a mistake, please{` `}
                        <InternalLink href="/about#contact">contact us</InternalLink> and give us the ID of the server
                        you're looking for: <span style={{ color: `gold` }}>{id}</span>.
                    </Typography>
                    <Button variant="outlined" size="large" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default ServerNotFoundModal;
