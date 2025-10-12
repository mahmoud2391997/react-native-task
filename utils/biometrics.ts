import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

export const isBiometricsAvailable = async (): Promise<boolean> => {
  if (Platform.OS === 'web') {
    return false;
  }

  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  return hasHardware && isEnrolled;
};

export const authenticateWithBiometrics = async (): Promise<boolean> => {
  if (Platform.OS === 'web') {
    return false;
  }

  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to unlock',
      fallbackLabel: 'Use Password',
      cancelLabel: 'Cancel',
    });

    return result.success;
  } catch (error) {
    console.error('Biometric authentication error:', error);
    return false;
  }
};
