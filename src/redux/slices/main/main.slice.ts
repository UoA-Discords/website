import { createSlice } from '@reduxjs/toolkit';
import { StoreState } from '../../store';

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

export interface State {
    rateLimit: null | RateLimitInfo;
}

export const initialState: State = {
    rateLimit: null,
};

const mainSlice = createSlice({
    name: `main`,
    initialState,
    reducers: {
        setRateLimit(state, action: { payload: Omit<RateLimitInfo, `startedAt`> }) {
            state.rateLimit = { ...action.payload, startedAt: Date.now() };
        },
        clearRateLimit(state) {
            state.rateLimit = null;
        },
    },
});

export const { setRateLimit, clearRateLimit } = mainSlice.actions;

export const getRateLimit = (state: StoreState) => state.main.rateLimit;

export default mainSlice.reducer;
