import axios from 'axios';
import { RateLimitInfo } from '../types/RateLimitInfo';

export function digestRateLimitResponse(res: unknown): Omit<RateLimitInfo, `startedAt`> | null {
    if (axios.isAxiosError(res) && res.response?.status === 429) {
        return {
            limit: Number(res.response.headers[`ratelimit-limit`]),
            remaining: Number(res.response.headers[`ratelimit-remaining`]),
            reset: Number(res.response.headers[`ratelimit-reset`]),
            retryAfter: Number(res.response.headers[`retry-after`]),
        };
    }
    return null;
}
