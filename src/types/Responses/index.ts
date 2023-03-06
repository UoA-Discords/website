import { AxiosError } from 'axios';

export interface SiteErrorObject<TStatusCode extends number, TAdditionalData = undefined> {
    title: string;
    description: string;
    additionalData: TAdditionalData;
    statusCode: TStatusCode;
}

export type BadRequestError = SiteErrorObject<400, { path: string; message: string; error_code?: string }[]>;

export type AuthError = SiteErrorObject<401>;

export type ForbiddenError = SiteErrorObject<403, string[]>;

export type NotFoundError = SiteErrorObject<404>;

export type RateLimitedError = SiteErrorObject<
    429,
    { limit: number; remaining: number; reset: number; retryAfter: number }
>;

export type SecondaryRequestError = SiteErrorObject<502, number | null>;

export type AnyExpectedError =
    | BadRequestError
    | AuthError
    | ForbiddenError
    | NotFoundError
    | RateLimitedError
    | SecondaryRequestError;

export type AnyExpectedErrorCodes = AnyExpectedError['statusCode'];

export interface ErrorHandlers {
    onBadRequest: (payload: BadRequestError) => void;
    onAuth: (payload: AuthError) => void;
    onForbidden: (payload: ForbiddenError) => void;
    onNotFound: (payload: NotFoundError) => void;
    onRateLimited: (payload: RateLimitedError) => void;
    onSecondaryRequest: (payload: SecondaryRequestError) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HandleableError<T = unknown, D = any> = AxiosError<T, D> & {
    response: AxiosError<T, D>['response'] & { data: T };
};
