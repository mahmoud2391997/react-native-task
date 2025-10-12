import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { store } from '../store';
import queryClient from '../utils/queryClient';
import { useAppSelector } from '../store/hooks';
import { setAuthToken } from '../services/api';
import { LockOverlay } from '../components/LockOverlay';
import { useAutoLock } from '../hooks/useAutoLock';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const { isLocked } = useAppSelector((state) => state.app);
  const [isMounted, setIsMounted] = useState(false);

  useAutoLock();
  useNetworkStatus();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  useEffect(() => {
    if (!isMounted) return;
    
    const inAuthGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && inAuthGroup) {
      router.replace('/login');
    } else if (isAuthenticated && !inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <LockOverlay />
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </QueryClientProvider>
    </Provider>
  );
}