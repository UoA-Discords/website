import { FC, ReactNode, useCallback, useMemo, useState } from 'react';
import { IMainStateContext, MainStateContext } from '../../contexts/MainState';
import { handleError } from './MainStateHelpers';

export const MainStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [latestError, internalSetLatestError] = useState<IMainStateContext['latestError']>(null);

    const [latestServerResponse, setLatestServerResponse] = useState<IMainStateContext['latestServerResponse']>(null);

    const [globalErrorDisplayType, setGlobalErrorDisplayType] =
        useState<IMainStateContext['globalErrorDisplayType']>('dialog');

    const setLatestError = useCallback<IMainStateContext['setLatestError']>((error) => {
        if (error === null) {
            internalSetLatestError(null);
            return false;
        }

        const fullError = handleError(error);

        if (fullError === null) {
            internalSetLatestError(null);
            return false;
        }

        console.error(fullError);

        internalSetLatestError(fullError);
        setLatestServerResponse(null);
        return true;
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
