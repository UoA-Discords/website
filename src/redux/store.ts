import { configureStore } from '@reduxjs/toolkit';
import entryManagerSlice, { State as EntryManagerState } from './slices/entryManager/entryManager.slice';
import mainSlice, { State as MainState } from './slices/main/main.slice';

export interface StoreState {
    main: MainState;
    entryManager: EntryManagerState;
}

const store = configureStore({
    reducer: {
        main: mainSlice,
        entryManager: entryManagerSlice,
    },
});

export default store;

export type AppDispatch = typeof store.dispatch;
