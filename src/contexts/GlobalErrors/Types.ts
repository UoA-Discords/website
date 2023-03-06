import {
    AuthError,
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    RateLimitedError,
    SecondaryRequestError,
} from '../../types/Responses';
export interface GlobalErrors {
    lastBadRequest?: BadRequestError;
    lastAuth?: AuthError;
    lastForbidden?: ForbiddenError;
    lastNotFound?: NotFoundError;
    lastRateLimited?: RateLimitedError;
    lastSecondaryRequest?: SecondaryRequestError;
    lastUnknown?: unknown;
}

export interface GlobalErrorsControllers {
    /** Handles any errors given to it, adding them to their relevant global error object. */
    handleError(error: unknown): void;

    /** Remove the latest recorded instance of a global error. */
    clear<T extends keyof GlobalErrors>(key: T): void;
}

export interface IGlobalErrorsContext {
    /** A record of the latest received errors from the registry API. */
    globalErrors: GlobalErrors;

    /** Functions to manage the behaviour of global error handlers, and to clear errors. */
    globalErrorsControllers: GlobalErrorsControllers;
}
