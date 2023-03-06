import { notImplementedFunction } from '../defaultFillers';
import { GlobalErrors, GlobalErrorsControllers, IGlobalErrorsContext } from './Types';

export const defaultGlobalErrors: GlobalErrors = {};

export const defaultGlobalErrorsControllers: GlobalErrorsControllers = {
    handleError: notImplementedFunction,
    clear: notImplementedFunction,
};

export const defaultGlobalErrorsContext: IGlobalErrorsContext = {
    globalErrors: defaultGlobalErrors,
    globalErrorsControllers: defaultGlobalErrorsControllers,
};
