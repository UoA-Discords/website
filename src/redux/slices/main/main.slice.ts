import { createSlice } from '@reduxjs/toolkit';
import { defaultSettings, getLocalSettings, saveLocalSettings } from '../../../helpers/settingsHelper';
import { RateLimitInfo } from '../../../types/RateLimitInfo';
import { Settings } from '../../../types/Settings';
import { StoreState } from '../../store';

export interface State {
    rateLimit: null | RateLimitInfo;
    settings: Settings;
}

export const initialState: State = {
    rateLimit: null,
    settings: getLocalSettings(),
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
        setSettings(state, action: { payload: Settings }) {
            state.settings = action.payload;
            saveLocalSettings(action.payload);
        },
        resetSettings(state, action: { payload: keyof Settings }) {
            const keyToReset = action.payload;
            const newSettings = { ...state.settings, [keyToReset]: defaultSettings()[keyToReset] };
            state.settings = newSettings;
            saveLocalSettings(newSettings);
        },
    },
});

export const { setRateLimit, clearRateLimit, setSettings, resetSettings } = mainSlice.actions;

export const getRateLimit = (state: StoreState) => state.main.rateLimit;

export const getSettings = (state: StoreState) => state.main.settings;

export default mainSlice.reducer;
