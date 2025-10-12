import { Tabs } from 'expo-router';
import { Package, Laptop, LogOut } from 'lucide-react-native';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { setAuthToken } from '../../services/api';
import { mmkvStorage } from '../../utils/mmkv';

export default function TabLayout() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          dispatch(logout());
          setAuthToken(null);
          mmkvStorage.removeItem('reduxState');
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Products',
          tabBarIcon: ({ size, color }) => <Package size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          title: 'Laptops',
          tabBarIcon: ({ size, color }) => <Laptop size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: 'Sign Out',
          tabBarIcon: ({ size, color }) => <LogOut size={size} color={color} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
      />
    </Tabs>
  );
}
