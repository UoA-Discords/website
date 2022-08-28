import { IconButton, Typography } from '@mui/material';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getSettings } from '../../../redux/slices/main';
import LightTooltip from '../../Tooltips/LightTooltip';

import SyncIcon from '@mui/icons-material/Sync';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { RootResponse } from '../../../types/RootResponse';

/**
 * Button that tests the configured Ratelimit Bypass Token when clicked.
 *
 * It tests it by trying to GET the root endpoint, e.g. `https://api.uoa-discords.com/`
 * and then looking at the headers received.
 */
const RateLimitTokenChecker = () => {
    const { rateLimitBypassToken, serverUrl } = useSelector(getSettings);

    // undefined means we haven't tested it yet
    const [validState, setValidState] = useState<undefined | `waiting` | boolean>(undefined);

    // reset to undefined if server url changes
    useEffect(() => {
        setValidState(undefined);
    }, [rateLimitBypassToken]);

    const testToken = useCallback(() => {
        if (rateLimitBypassToken === undefined) {
            setValidState(true);
            return;
        }
        setValidState(`waiting`);
        const controller = new AbortController();

        axios
            .request<RootResponse>({
                method: `get`,
                url: serverUrl,
                signal: controller.signal,
                headers: {
                    'RateLimit-Bypass-Token': rateLimitBypassToken,
                },
            })
            .then(({ headers }) => {
                const res = headers[`ratelimit-bypass-response`];
                setValidState(res === `Valid`);
            })
            .catch(() => {
                setValidState(false);
            });

        return () => {
            controller.abort();
            setValidState(undefined);
        };
    }, [rateLimitBypassToken, serverUrl]);

    const title = useMemo(() => {
        switch (validState) {
            case undefined:
                return `Click to Check Validity`;
            case `waiting`:
                return `Checking Validity...`;
            case true:
                return `Valid`;
            case false:
                return `Invalid`;
        }
    }, [validState]);

    return (
        <LightTooltip title={<Typography>{title}</Typography>} placement="top">
            <IconButton onClick={validState === undefined ? testToken : undefined}>
                {validState === `waiting` ? (
                    <SyncIcon className="spinning" />
                ) : validState === true ? (
                    <CheckIcon color="success" />
                ) : validState === false ? (
                    <CloseIcon color="error" />
                ) : (
                    <QuestionMarkIcon />
                )}
            </IconButton>
        </LightTooltip>
    );
};

export default RateLimitTokenChecker;
