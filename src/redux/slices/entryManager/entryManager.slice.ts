import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../../config';
import { digestRateLimitResponse } from '../../../helpers/digestRateLimitResponse';
import { ApprovedEntry } from '../../../shared/Types/Entries';
import { StoreState } from '../../store';
import { setRateLimit } from '../main';

export interface State {
    /** Approved entries. */
    entries: Record<string, ApprovedEntry>;
}

export const initialState: State = {
    entries: {},
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
    },
});

export const { addEntries, removeAllEntries, setLikedEntry } = entryManagerSlice.actions;

export const getAllEntries = (state: StoreState) => state.entryManager.entries;

export const loadAllEntries = createAsyncThunk(`entryManager/loadEntries`, async (_, { dispatch }) => {
    try {
        const entryQuery = await axios.request<ApprovedEntry[]>({
            method: `get`,
            url: `${config.serverUrl}/entries`,
        });

        dispatch(removeAllEntries());
        dispatch(addEntries(entryQuery.data));
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
