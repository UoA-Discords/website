import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';
import { digestRateLimitResponse } from '../../../helpers/digestRateLimitResponse';
import { SiteUser } from '../../../shared/Types/User';
import { StoreState } from '../../store';
import { getSettings, setRateLimit } from '../main';

export interface State {
    staff: SiteUser[] | null;
}

export const initialState: State = {
    staff: null,
};

const userManagerSlice = createSlice({
    name: `userManager`,
    initialState,
    reducers: {
        setStaff(state, action: { payload: SiteUser[] }) {
            state.staff = action.payload;
        },
    },
});

export const { setStaff } = userManagerSlice.actions;

export const getAllStaff = (state: StoreState) => state.userManager.staff;

export const loadAllStaff = createAsyncThunk(`userManager/loadAllStaff`, async (_, { dispatch, getState }) => {
    try {
        const settings = getSettings(getState() as StoreState);
        const requestObject: AxiosRequestConfig = {
            method: `get`,
            baseURL: settings.serverUrl,
            url: `/staff`,
            headers: {},
        };

        if (settings.rateLimitBypassToken !== undefined) {
            requestObject.headers![`RateLimit-Bypass-Token`] = settings.rateLimitBypassToken;
        }

        const staffQuery = await axios.request<{ owners: SiteUser[]; moderators: SiteUser[]; admins: SiteUser[] }>(
            requestObject,
        );

        dispatch(setStaff([...staffQuery.data.owners, ...staffQuery.data.admins, ...staffQuery.data.moderators]));
    } catch (error) {
        const r = digestRateLimitResponse(error);
        if (r !== null) {
            dispatch(setRateLimit(r));
        } else {
            console.error(error);
        }
    }
});

export default userManagerSlice.reducer;
