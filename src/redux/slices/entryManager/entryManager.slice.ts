import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';
import { digestRateLimitResponse } from '../../../helpers/digestRateLimitResponse';
import { ApprovedEntry } from '../../../shared/Types/Entries';
import { StoreState } from '../../store';
import { getSettings, setRateLimit } from '../main';

export interface State {
    /** Approved entries. */
    entries: Record<string, ApprovedEntry>;

    /** IDs of entries to show. */
    visibleEntries: string[];
}

export const initialState: State = {
    entries: {},
    visibleEntries: [],
};

const entryManagerSlice = createSlice({
    name: `entryManager`,
    initialState,
    reducers: {
        addEntries(state, action: { payload: ApprovedEntry[] }) {
            action.payload.forEach((entry) => {
                state.entries[entry.id] = entry;
            });
        },
        removeAllEntries(state) {
            state.entries = {};
        },
        setLikedEntry(state, action: { payload: { id: string; like: boolean } }) {
            const entry = state.entries[action.payload.id];
            if (entry !== undefined) {
                entry.likes += action.payload.like ? 1 : -1;
            }
        },
        setVisibleEntries(state, action: { payload: string[] }) {
            state.visibleEntries = action.payload;
        },
    },
});

export const { addEntries, removeAllEntries, setLikedEntry, setVisibleEntries } = entryManagerSlice.actions;

export const getAllEntries = (state: StoreState) => state.entryManager.entries;

export const getVisibleEntries = (state: StoreState) => state.entryManager.visibleEntries;

export const loadAllEntries = createAsyncThunk(`entryManager/loadEntries`, async (_, { dispatch, getState }) => {
    try {
        const settings = getSettings(getState() as StoreState);
        const requestObject: AxiosRequestConfig = {
            method: `get`,
            baseURL: settings.serverUrl,
            url: `/entries`,
            headers: {},
        };

        if (settings.rateLimitBypassToken !== undefined) {
            requestObject.headers![`RateLimit-Bypass-Token`] = settings.rateLimitBypassToken;
        }

        const entryQuery = await axios.request<ApprovedEntry[]>(requestObject);

        dispatch(removeAllEntries());
        dispatch(addEntries(entryQuery.data));
        dispatch(setVisibleEntries(entryQuery.data.map((e) => e.id)));
    } catch (error) {
        const r = digestRateLimitResponse(error);
        if (r !== null) {
            dispatch(setRateLimit(r));
        } else {
            console.error(error);
        }
    }
});

export default entryManagerSlice.reducer;
