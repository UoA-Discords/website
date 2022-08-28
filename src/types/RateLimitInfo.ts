export interface RateLimitInfo {
    /** Maximum number of requests per time window. */
    limit: number;
    /** Number of requests remaining in this time window. */
    remaining: number;
    /** Number of seconds until this time window ends. */
    reset: number;
    /** Length of time window in seconds. */
    retryAfter: number;

    /** Timestamp of last ratelimited response. */
    startedAt: number;
}
