import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/slices/authSlice';
import { authApi, setAuthToken } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SUPERADMIN_USERNAME } from '../../constants/config';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(username.trim(), password.trim());

      setAuthToken(response.accessToken);

      const isSuperAdmin = response.username === SUPERADMIN_USERNAME;

      dispatch(
        setCredentials({
          user: {
            id: response.id,
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            gender: response.gender,
            image: response.image,
          },
          token: response.accessToken,
          isSuperAdmin,
        })
      );

      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Username"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setError('');
              }}
              placeholder="Enter your username"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
            />

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.button}
            />

            <View style={styles.hint}>
              <Text style={styles.hintText}>
                Tip: Use any DummyJSON credentials
              </Text>
              <Text style={styles.hintText}>
                Example: emilys / emilyspass
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: 8,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  hint: {
    marginTop: 24,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 4,
  },
});
