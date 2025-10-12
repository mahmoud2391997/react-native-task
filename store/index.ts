import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import appReducer from './slices/appSlice';
import { mmkvStorage } from '../utils/mmkv';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const loadState = () => {
  try {
    const serializedState = mmkvStorage.getItem('reduxState');
    if (serializedState === null) {
      return;
    }
    const state = JSON.parse(serializedState);
    if (state.auth) {
      store.dispatch({ type: 'auth/setCredentials', payload: state.auth });
    }
  } catch (err) {
    console.error('Error loading state:', err);
  }
};

const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify({
      auth: state.auth,
    });
    mmkvStorage.setItem('reduxState', serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

loadState();

store.subscribe(() => {
  saveState(store.getState());
});
