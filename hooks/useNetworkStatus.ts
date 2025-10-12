import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useAppDispatch } from '../store/hooks';
import { setOnline } from '../store/slices/appSlice';

export const useNetworkStatus = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      dispatch(setOnline(state.isConnected ?? true));
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);
};
