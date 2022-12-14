import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';
import { digestRateLimitResponse } from '../../../helpers/digestRateLimitResponse';
import { EntryStates, FullEntry } from '../../../shared/Types/Entries';
import { StoreState } from '../../store';
import { getSettings, setRateLimit } from '../main';

export interface State {
    /** Approved entries. */
    entries: Record<string, FullEntry<EntryStates.Approved | EntryStates.Featured>>;

    /** IDs of entries to show. */
    visibleEntries: string[];

    doneInitialLoad: boolean;
}

export const initialState: State = {
    entries: {},
    visibleEntries: [],
    doneInitialLoad: false,
};

const entryManagerSlice = createSlice({
    name: `entryManager`,
    initialState,
    reducers: {
        addEntries(state, action: { payload: FullEntry<EntryStates.Approved | EntryStates.Featured>[] }) {
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
        setDoneInitialLoad(state, action: { payload: boolean }) {
            state.doneInitialLoad = action.payload;
        },
    },
});

export const { addEntries, removeAllEntries, setLikedEntry, setVisibleEntries, setDoneInitialLoad } =
    entryManagerSlice.actions;

export const getAllEntries = (state: StoreState) => state.entryManager.entries;

export const getVisibleEntries = (state: StoreState) => state.entryManager.visibleEntries;

export const getDoneInitialLoad = (state: StoreState) => state.entryManager.doneInitialLoad;

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

        const entryQuery = await axios.request<{
            approved: FullEntry<EntryStates.Approved>[];
            featured: FullEntry<EntryStates.Featured>[];
        }>(requestObject);

        dispatch(removeAllEntries());
        dispatch(addEntries([...entryQuery.data.approved, ...entryQuery.data.featured]));
        dispatch(
            setVisibleEntries([
                ...entryQuery.data.approved.map((e) => e.id),
                ...entryQuery.data.featured.map((e) => e.id),
            ]),
        );
    } catch (error) {
        const r = digestRateLimitResponse(error);
        if (r !== null) {
            dispatch(setRateLimit(r));
        } else {
            console.error(error);
        }
    } finally {
        dispatch(setDoneInitialLoad(true));
    }
});

export default entryManagerSlice.reducer;
