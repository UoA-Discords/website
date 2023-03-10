import { useContext, useMemo } from 'react';
import { MainStateContext } from '../../contexts';

/**
 * A hook that extracts the raw data from an error object.
 *
 * This hook is not in the main hooks folder since it should only be used by the ErrorDisplayer-related  components.
 */
// TODO: custom error type handling for each of AnyExpectedErrors
export function useRawError(): string | null {
    const { latestError } = useContext(MainStateContext);

    const rawError = useMemo<string | null>(() => {
        if (latestError === null) return null;

        const { recognized, value } = latestError;

        if (recognized) {
            if (value.additionalData === undefined || value.additionalData === null) return null;
            return JSON.stringify(value.additionalData, undefined, 2).replaceAll(/Bearer.*"/g, 'Bearer [REDACTED]"');
        }

        if (value === 'Network error') return null;

        try {
            // this isn't strictly necessary, but the bearer token is also quite long
            // and so causes a lot of horizontal scrolling
            return JSON.stringify(value, undefined, 2)?.replaceAll(/Bearer.*"/g, 'Bearer [REDACTED]"');
        } catch (error) {
            // an error about the error, oh dear
            console.error(error);
            return 'Failed to parse additional data, see console for more details.';
        }
    }, [latestError]);

    return rawError;
}
