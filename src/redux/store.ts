import { configureStore } from '@reduxjs/toolkit';
import entryManagerSlice, { State as EntryManagerState } from './slices/entryManager/entryManager.slice';
import userManagerSlice, { State as UserManagerState } from './slices/userManager/userManager.slice';
import mainSlice, { State as MainState } from './slices/main/main.slice';

export interface StoreState {
    main: MainState;
    entryManager: EntryManagerState;
    userManager: UserManagerState;
}

const store = configureStore({
    reducer: {
        main: mainSlice,
        entryManager: entryManagerSlice,
        userManager: userManagerSlice,
    },
});

export default store;

export type AppDispatch = typeof store.dispatch;
