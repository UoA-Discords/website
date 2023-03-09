import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Link,
    Stack,
    Typography,
} from '@mui/material';
import { MainStateContext, SettingsContext } from '../../contexts';
import { ExternalLink, InternalLink } from '../Links';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const ErrorDisplayer: React.FC<{ inline?: boolean }> = ({ inline = false }) => {
    const { settings } = useContext(SettingsContext);
    const { latestError, globalErrorDisplayType } = useContext(MainStateContext);

    const [open, setOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (latestError === null || (globalErrorDisplayType === 'inline' && !inline)) {
            setOpen(false);
            setIsExpanded(false);
        } else setOpen(true);
    }, [globalErrorDisplayType, inline, latestError]);

    const finalCode = useMemo(() => {
        if (latestError === null) return null;

        const { recognized, value } = latestError;

        return recognized
            ? value.statusCode
            : (value as { response?: { status?: number } })?.response?.status ??
                  (value as { status?: number })?.status ??
                  null;
    }, [latestError]);

    const rawError = useMemo(() => {
        if (latestError === null) return null;

        const { recognized, value } = latestError;

        if (recognized) {
            if (value.additionalData === undefined || value.additionalData === null) return null;
            return JSON.stringify(value.additionalData, undefined, 2).replaceAll(/Bearer.*"/g, 'Bearer [REDACTED]"');
        }

        if (value === 'Network error') return null;

        try {
            return JSON.stringify(value, undefined, 2)?.replaceAll(/Bearer.*"/g, 'Bearer [REDACTED]"');
        } catch (error) {
            return 'Failed to parse additional data, see console for more details.';
        }
    }, [latestError]);

    const titleElement = useMemo(
        () => (
            <Typography textAlign="center" variant="h4" color="orange" gutterBottom>
                {latestError?.value === 'Network error'
                    ? 'Network Error'
                    : finalCode !== null
                    ? `Error ${finalCode}${latestError?.recognized ? ` - ${latestError.value.title}` : ''}`
                    : 'Unknown Error'}
            </Typography>
        ),

        [finalCode, latestError],
    );

    const bodyElement = useMemo(() => {
        if (latestError === null) return <></>;

        const { recognized, value } = latestError;

        return (
            <Stack gap={2}>
                {recognized ? (
                    <>
                        <Typography>{value.description}</Typography>
                        <Typography color="gray">
                            If you think this error is a mistake, we encourage you to{' '}
                            <InternalLink to="/info#contact" onClick={() => setOpen(false)}>
                                <Link component="span" underline="hover">
                                    contact us
                                </Link>
                            </InternalLink>
                            .
                        </Typography>
                    </>
                ) : (
                    <Typography>
                        {latestError.value === 'Network error' ? (
                            <>
                                Failed to make a request, either your internet is down, or our server is down. If you're
                                100% certain of the latter, please{' '}
                                <InternalLink to="/info#contact" onClick={() => setOpen(false)}>
                                    <Link component="span" underline="hover">
                                        contact us
                                    </Link>
                                </InternalLink>
                                .<br />
                                <br />
                                <span style={{ color: 'lightgray' }}>
                                    The configured server URL is{' '}
                                    <ExternalLink href={settings.serverUrl} title="Configured server endpoint">
                                        <Link component="span" underline="hover">
                                            {settings.serverUrl}
                                        </Link>
                                    </ExternalLink>
                                </span>
                            </>
                        ) : (
                            <>
                                An unknown error occurred while making a request to our API. We try to plan for all
                                possible errors, so you should definitely{' '}
                                <InternalLink to="/info#contact" onClick={() => setOpen(false)}>
                                    <Link component="span" underline="hover">
                                        contact us
                                    </Link>
                                </InternalLink>
                                .
                            </>
                        )}
                    </Typography>
                )}
                {rawError !== null && (
                    <Accordion expanded={isExpanded} onChange={() => setIsExpanded(!isExpanded)} disableGutters>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            {isExpanded ? 'Hide More Info' : 'Show More Info'}
                        </AccordionSummary>
                        <AccordionDetails sx={{ overflow: 'auto', maxHeight: '300px' }}>
                            <pre>{rawError}</pre>
                        </AccordionDetails>
                    </Accordion>
                )}
            </Stack>
        );
    }, [isExpanded, latestError, rawError, settings.serverUrl]);

    if (latestError === null) return <></>;

    if (inline) {
        return (
            <div>
                {titleElement}
                {bodyElement}
            </div>
        );
    }

    return (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm">
            <DialogTitle
                component="div"
                sx={{
                    bgcolor: 'background.paper',
                    border: '2px solid #333',
                    borderBottom: 'none',
                }}
                textAlign="center"
            >
                {titleElement}
            </DialogTitle>
            <DialogContent
                sx={{
                    bgcolor: 'background.paper',
                    border: '2px solid #333',
                    borderTop: 'none',
                    borderBottom: 'none',
                }}
            >
                {bodyElement}
            </DialogContent>
            <DialogActions
                sx={{
                    bgcolor: 'background.paper',
                    border: '2px solid #333',
                    borderTop: 'none',
                }}
            >
                <Button variant="outlined" sx={{ minWidth: '100px' }} onClick={() => setOpen(false)}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};
