import { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setLocked, updateActivity } from '../store/slices/appSlice';
import { AUTO_LOCK_TIMEOUT } from '../constants/config';

export const useAutoLock = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { lastActivityTime } = useAppSelector((state) => state.app);
  const lockTimerRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);

  const resetTimer = useCallback(() => {
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
    }
    lockTimerRef.current = setTimeout(() => {
      dispatch(setLocked(true));
    }, AUTO_LOCK_TIMEOUT) as unknown as NodeJS.Timeout;
  }, [dispatch]);

  const resetLockTimer = () => {
    dispatch(updateActivity());
    resetTimer();
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    resetTimer();

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
        dispatch(setLocked(true));
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
      }
    };
  }, [isAuthenticated, dispatch]);

  return { resetLockTimer };
};
