import { useSyncExternalStore } from 'react';
import { subscribe, getState } from './store.js';
// Select a primitive (or stable) slice of the store.
export const useStore = (sel = (s) => s) => useSyncExternalStore(subscribe, () => sel(getState()), () => sel(getState()));
