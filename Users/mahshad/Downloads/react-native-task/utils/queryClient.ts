import { QueryClient } from '@tanstack/react-query';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});


export default queryClient;
