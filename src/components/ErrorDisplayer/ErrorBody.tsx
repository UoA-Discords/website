import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Stack, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { FC, useContext } from 'react';
import { MainStateContext, SettingsContext } from '../../contexts';
import { ExternalLinkStyled, InternalLinkStyled } from '../Links';
import { useRawError } from './useRawError';

export const ErrorBody: FC<{ onClose: () => void }> = ({ onClose }) => {
    const { settings } = useContext(SettingsContext);
    const { latestError } = useContext(MainStateContext);

    const rawError = useRawError();

    if (latestError === null) return <></>;

    const { recognized, value } = latestError;

    return (
        <Stack gap={2}>
            {recognized ? (
                <>
                    <Typography>{value.description}</Typography>
                    <Typography color="gray">
                        If you think this error is a mistake, we encourage you to{' '}
                        <InternalLinkStyled to="/info#contact" onClick={onClose}>
                            contact us
                        </InternalLinkStyled>
                        .
                    </Typography>
                </>
            ) : (
                <Typography>
                    {latestError.value === 'Network error' ? (
                        <>
                            Failed to make a request, either your internet is down, or our server is down. If you're
                            100% certain of the latter, please{' '}
                            <InternalLinkStyled to="/info#contact" onClick={onClose}>
                                contact us
                            </InternalLinkStyled>
                            .<br />
                            <br />
                            <span style={{ color: 'lightgray' }}>
                                The configured server URL is{' '}
                                <ExternalLinkStyled href={settings.serverUrl} title="Configured server endpoint">
                                    {settings.serverUrl}
                                </ExternalLinkStyled>
                            </span>
                        </>
                    ) : (
                        <>
                            An unknown error occurred while making a request to our API. We try to plan for all possible
                            errors, so you should definitely{' '}
                            <InternalLinkStyled to="/info#contact" onClick={onClose}>
                                contact us
                            </InternalLinkStyled>
                            .
                        </>
                    )}
                </Typography>
            )}
            {rawError !== null && (
                <Accordion disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>Show More Info</AccordionSummary>
                    <AccordionDetails sx={{ overflow: 'auto', maxHeight: '300px' }}>
                        <pre>{rawError}</pre>
                    </AccordionDetails>
                </Accordion>
            )}
        </Stack>
    );
};
