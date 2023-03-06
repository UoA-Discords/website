import axios, { CanceledError } from 'axios';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { GlobalErrors, GlobalErrorsContext, GlobalErrorsControllers, IGlobalErrorsContext } from '../../contexts';
import { SiteErrorObject } from '../../types/Responses';

export const GlobalErrorsContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [globalErrors, setGlobalErrors] = useState<GlobalErrors>({});

    const handleError = useCallback<GlobalErrorsControllers['handleError']>(
        (error) => {
            if (error instanceof CanceledError) {
                console.log('A request was aborted');
                return;
            }

            console.error(error);

            if (!axios.isAxiosError(error) || error.response === undefined) {
                setGlobalErrors({ ...globalErrors, lastUnknown: error });
                return;
            }

            const newError: Omit<SiteErrorObject<number>, 'statusCode' | 'additionalData'> = {
                title: error.response.data.title,
                description: error.response.data.description,
            };

            switch (error.response.status) {
                case 400: // Bad Request
                    setGlobalErrors({
                        ...globalErrors,
                        lastBadRequest: {
                            ...newError,
                            statusCode: 400,
                            additionalData: error.response.data.additionalData,
                        },
                    });
                    break;
                case 401: // Unauthorized
                    setGlobalErrors({
                        ...globalErrors,
                        lastAuth: {
                            ...newError,
                            statusCode: 401,
                            additionalData: error.response.data.additionalData,
                        },
                    });
                    break;
                case 403: // Forbidden
                    setGlobalErrors({
                        ...globalErrors,
                        lastForbidden: {
                            ...newError,
                            statusCode: 403,
                            additionalData: error.response.data.additionalData,
                        },
                    });
                    break;
                case 404: // Not Found
                    setGlobalErrors({
                        ...globalErrors,
                        lastNotFound: {
                            ...newError,
                            statusCode: 404,
                            additionalData: error.response.data.additionalData,
                        },
                    });
                    break;
                case 429: // Too Many Requests
                    setGlobalErrors({
                        ...globalErrors,
                        lastRateLimited: {
                            ...newError,
                            statusCode: 429,
                            additionalData: {
                                limit: Number(error.response.headers['ratelimit-limit']),
                                remaining: Number(error.response.headers['ratelimit-remaining']),
                                reset: Number(error.response.headers['ratelimit-reset']),
                                retryAfter: Number(error.response.headers['retry-after']),
                            },
                        },
                    });
                    break;
                case 502: // Bad Gateway
                    setGlobalErrors({
                        ...globalErrors,
                        lastSecondaryRequest: {
                            ...newError,
                            statusCode: 502,
                            additionalData: error.response.data.additionalData,
                        },
                    });
                    break;
                default:
                    setGlobalErrors({ ...globalErrors, lastUnknown: error });
                    break;
            }
        },
        [globalErrors],
    );

    const clear = useCallback<GlobalErrorsControllers['clear']>(
        (key) => {
            setGlobalErrors({ ...globalErrors, [key]: undefined });
        },
        [globalErrors],
    );

    const finalValue = useMemo<IGlobalErrorsContext>(
        () => ({ globalErrors, globalErrorsControllers: { handleError, clear } }),
        [clear, globalErrors, handleError],
    );

    return <GlobalErrorsContext.Provider value={finalValue}>{children}</GlobalErrorsContext.Provider>;
};
