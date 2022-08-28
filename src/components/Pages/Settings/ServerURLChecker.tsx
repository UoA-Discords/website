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
 * Button that tests the configured server URL when clicked.
 *
 * It tests it by trying to GET the root endpoint, e.g. `https://api.uoa-discords.com/`.
 */
const ServerURLChecker = () => {
    const { serverUrl } = useSelector(getSettings);

    // undefined means we haven't tested it yet
    const [validState, setValidState] = useState<undefined | `waiting` | boolean>(undefined);

    // reset to undefined if server url changes
    useEffect(() => {
        setValidState(undefined);
    }, [serverUrl]);

    const testServerURL = useCallback(() => {
        setValidState(`waiting`);
        const controller = new AbortController();

        axios
            .request<RootResponse>({
                method: `get`,
                url: serverUrl,
                signal: controller.signal,
            })
            .then(({ data }) => {
                if (data.applyRequirements !== undefined) {
                    setValidState(true);
                } else setValidState(false);
            })
            .catch(() => {
                setValidState(false);
            });

        return () => {
            controller.abort();
            setValidState(undefined);
        };
    }, [serverUrl]);

    const title = useMemo(() => {
        switch (validState) {
            case undefined:
                return `Click to Check Validity`;
            case `waiting`:
                return `Checking Validity...`;
            case true:
                return `Valid`;
            case false:
                return `Not Found`;
        }
    }, [validState]);

    return (
        <LightTooltip title={<Typography>{title}</Typography>} placement="top">
            <IconButton onClick={validState === undefined ? testServerURL : undefined}>
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

export default ServerURLChecker;
