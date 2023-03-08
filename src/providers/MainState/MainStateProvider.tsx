import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { IMainStateContext, MainStateContext } from '../../contexts/MainState';
import { handleError } from './MainStateHelpers';

export const MainStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [latestError, internalSetLatestError] = useState<IMainStateContext['latestError']>(null);

    const [latestServerResponse, setLatestServerResponse] = useState<IMainStateContext['latestServerResponse']>(null);

    const [globalErrorDisplayType, setGlobalErrorDisplayType] =
        useState<IMainStateContext['globalErrorDisplayType']>('dialog');

    const setLatestError = useCallback<IMainStateContext['setLatestError']>((error) => {
        if (error === null) return internalSetLatestError(null);

        const fullError = handleError(error);

        console.error(fullError);

        internalSetLatestError(fullError);
    }, []);

    const finalValue = useMemo<IMainStateContext>(
        () => ({
            latestError,
            latestServerResponse,
            globalErrorDisplayType,
            setLatestError,
            setLatestServerResponse,
            setGlobalErrorDisplayType,
        }),
        [globalErrorDisplayType, latestError, latestServerResponse, setLatestError],
    );

    return <MainStateContext.Provider value={finalValue}>{children}</MainStateContext.Provider>;
};
