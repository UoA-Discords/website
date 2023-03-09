import axios, { CanceledError } from 'axios';
import { IMainStateContext } from '../../contexts/MainState';
import { AnyExpectedError, SiteErrorObject } from '../../types/Responses';

export function handleError(error: unknown): IMainStateContext['latestError'] {
    if (error instanceof CanceledError) return null;

    if (!axios.isAxiosError(error)) return { recognized: false, value: error };

    if (error.response === undefined) {
        if (error.code === 'ERR_NETWORK') return { recognized: false, value: 'Network error' };
        return { recognized: false, value: error };
    }

    const baseError: Omit<SiteErrorObject<number>, 'statusCode' | 'additionalData'> = {
        title: error.response.data.title,
        description: error.response.data.description,
    };

    let fullError: AnyExpectedError;

    switch (error.response.status) {
        case 400: // Bad Request
            fullError = {
                ...baseError,
                statusCode: 400,
                additionalData: error.response.data.additionalData,
            };
            break;
        case 401: // Unauthorized
            fullError = {
                ...baseError,
                statusCode: 401,
                additionalData: error.response.data.additionalData,
            };
            break;
        case 403: // Forbidden
            fullError = {
                ...baseError,
                statusCode: 403,
                additionalData: error.response.data.additionalData,
            };

            break;
        case 404: // Not Found
            fullError = {
                ...baseError,
                statusCode: 404,
                additionalData: error.response.data.additionalData,
            };
            break;
        case 429: // Too Many Requests
            fullError = {
                ...baseError,
                statusCode: 429,
                additionalData: {
                    limit: Number(error.response.headers['ratelimit-limit']),
                    remaining: Number(error.response.headers['ratelimit-remaining']),
                    reset: Number(error.response.headers['ratelimit-reset']),
                    retryAfter: Number(error.response.headers['retry-after']),
                },
            };
            break;
        case 502: // Bad Gateway
            fullError = {
                ...baseError,
                statusCode: 502,
                additionalData: error.response.data.additionalData,
            };
            break;
        default:
            return { recognized: false, value: error };
    }

    return { recognized: true, value: fullError };
}
