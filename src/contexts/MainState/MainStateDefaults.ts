import { notImplementedFunction } from '../defaultFillers';
import { IMainStateContext } from './MainStateTypes';

export const defaultMainStateContext: IMainStateContext = {
    latestError: null,
    latestServerResponse: null,
    globalErrorDisplayType: 'dialog',
    setLatestError: notImplementedFunction,
    setLatestServerResponse: notImplementedFunction,
    setGlobalErrorDisplayType: notImplementedFunction,
};
