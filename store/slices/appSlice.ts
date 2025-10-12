import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  isLocked: boolean;
  isOnline: boolean;
  lastActivityTime: number;
}

const initialState: AppState = {
  isLocked: false,
  isOnline: true,
  lastActivityTime: Date.now(),
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLocked: (state, action: PayloadAction<boolean>) => {
      state.isLocked = action.payload;
    },
    setOnline: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    updateActivity: (state) => {
      state.lastActivityTime = Date.now();
    },
  },
});

export const { setLocked, setOnline, updateActivity } = appSlice.actions;
export default appSlice.reducer;
