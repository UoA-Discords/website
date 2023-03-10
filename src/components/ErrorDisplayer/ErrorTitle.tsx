import { Typography } from '@mui/material';
import { FC, useContext, useMemo } from 'react';
import { MainStateContext } from '../../contexts';

export const ErrorTitle: FC = () => {
    const { latestError } = useContext(MainStateContext);

    const finalCode = useMemo(() => {
        if (latestError === null) return null;

        const { recognized, value } = latestError;

        return recognized
            ? value.statusCode
            : (value as { response?: { status?: number } })?.response?.status ??
                  (value as { status?: number })?.status ??
                  null;
    }, [latestError]);

    return (
        <Typography textAlign="center" variant="h4" color="orange" gutterBottom>
            {latestError?.value === 'Network error'
                ? 'Network Error'
                : finalCode !== null
                ? `Error ${finalCode}${latestError?.recognized ? ` - ${latestError.value.title}` : ''}`
                : 'Unknown Error'}
        </Typography>
    );
};
