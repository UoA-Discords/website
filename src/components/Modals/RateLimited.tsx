import { Button, Modal, Stack, SxProps, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearRateLimit, getRateLimit } from '../../redux/slices/main';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DarkTooltip from '../Tooltips/DarkTooltip';

const style: SxProps = {
    position: `absolute`,
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
    width: 400,
    bgcolor: `background.paper`,
    border: `2px solid #333`,
    boxShadow: 24,
    p: 4,
};

const RateLimitedModal = () => {
    const dispatch = useDispatch();
    const rateLimit = useSelector(getRateLimit);

    const [secondsTillClose, setSecondsTillClose] = useState<number | null>(null);

    useEffect(() => {
        if (rateLimit !== null) {
            if (secondsTillClose === null) {
                setSecondsTillClose(rateLimit.reset);
                return;
            }

            const interval = setInterval(() => {
                setSecondsTillClose(secondsTillClose - 1);
                if (secondsTillClose <= 0) {
                    dispatch(clearRateLimit());
                }
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [dispatch, rateLimit, secondsTillClose]);

    if (rateLimit === null) return <></>;

    return (
        <Modal open>
            <Box sx={style}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <WarningAmberIcon color="warning" fontSize="large" />
                    <Typography variant="h4" textAlign="center">
                        Ratelimited
                    </Typography>
                </Stack>
                <Typography sx={{ mt: 2 }}>
                    You are being ratelimited by the server after sending too many requests.
                </Typography>
                <Typography sx={{ mt: 2 }} color="orange">
                    Limit: {rateLimit.limit} Requests per{` `}
                    {rateLimit.retryAfter} Seconds
                </Typography>
                <Typography color="gray" sx={{ mt: 2 }}>
                    This modal will automatically close once you are no longer ratelimited (in {secondsTillClose}
                    {` `}
                    seconds).
                </Typography>
                <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                    <DarkTooltip
                        title={<Typography>You will still be ratelimited for {secondsTillClose} seconds.</Typography>}
                    >
                        <Button variant="outlined" onClick={() => dispatch(clearRateLimit())}>
                            Close
                        </Button>
                    </DarkTooltip>
                </Stack>
            </Box>
        </Modal>
    );
};

export default RateLimitedModal;
