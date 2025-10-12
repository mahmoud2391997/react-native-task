import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Lock } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setLocked } from '../store/slices/appSlice';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { authenticateWithBiometrics, isBiometricsAvailable } from '../utils/biometrics';

export const LockOverlay: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLocked } = useAppSelector((state) => state.app);
  const [password, setPassword] = useState('');
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  useEffect(() => {
    checkBiometrics();
  }, []);

  useEffect(() => {
    if (isLocked && !showPasswordInput) {
      attemptBiometricUnlock();
    }
  }, [isLocked]);

  const checkBiometrics = async () => {
    const available = await isBiometricsAvailable();
    setBiometricsAvailable(available);
    if (!available) {
      setShowPasswordInput(true);
    }
  };

  const attemptBiometricUnlock = async () => {
    if (Platform.OS === 'web' || !biometricsAvailable) {
      setShowPasswordInput(true);
      return;
    }

    const success = await authenticateWithBiometrics();
    if (success) {
      dispatch(setLocked(false));
      setPassword('');
      setShowPasswordInput(false);
    } else {
      setShowPasswordInput(true);
    }
  };

  const handlePasswordUnlock = () => {
    if (password.trim()) {
      dispatch(setLocked(false));
      setPassword('');
      setShowPasswordInput(false);
    } else {
      Alert.alert('Error', 'Please enter a password');
    }
  };

  const handleTryBiometrics = () => {
    setShowPasswordInput(false);
    attemptBiometricUnlock();
  };

  if (!isLocked) {
    return null;
  }

  return (
    <Modal visible={isLocked} animationType="fade" transparent>
      <BlurView intensity={100} style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Lock size={48} color="#2563eb" />
            </View>

            <Text style={styles.title}>App Locked</Text>
            <Text style={styles.subtitle}>
              {showPasswordInput
                ? 'Enter password to unlock'
                : 'Authenticating...'}
            </Text>

            {showPasswordInput && (
              <View style={styles.form}>
                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  secureTextEntry
                  autoCapitalize="none"
                  autoFocus
                />

                <Button
                  title="Unlock"
                  onPress={handlePasswordUnlock}
                  style={styles.button}
                />

                {biometricsAvailable && Platform.OS !== 'web' && (
                  <Button
                    title="Use Biometrics"
                    onPress={handleTryBiometrics}
                    variant="secondary"
                    style={styles.button}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: 12,
  },
});
