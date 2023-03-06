export interface BaseRequestProps<RateLimitApplicable extends boolean, AuthApplicable extends boolean | 'optional'> {
    baseURL: string;
    controller?: AbortController;
    rateLimitBypassToken?: RateLimitApplicable extends true ? string : never;
    siteToken: AuthApplicable extends true
        ? string
        : AuthApplicable extends 'optional'
        ? string | undefined
        : undefined;
}
