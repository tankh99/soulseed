// app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { registerForPushNotificationsAsync, scheduleWelcomeNotification } from '@/lib/notifications';
import Api from '@/services/api';

const DISABLE_PUSH =
  process.env.EXPO_PUBLIC_DISABLE_PUSH === '1' ||
  __DEV__ ||                       // disable in dev by default
  Platform.OS === 'web';           // disable on web

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    const setupNotifications = async () => {
      if (DISABLE_PUSH) return;
      try {
        await registerForPushNotificationsAsync();   // implement safely in your lib (see note below)
        await scheduleWelcomeNotification();
      } catch (err) {
        console.warn('Push setup failed:', err);
      }
    };
    setupNotifications();
  }, []);

  // (Optional) dev-only AI quick ping
  useEffect(() => {
    if (!__DEV__) return;
    (async () => {
      try {
        await Api.AI.ping();
        if (process.env.EXPO_PUBLIC_AI_BASE_URL) {
          await Api.AI.getGuidance({
            text: 'Hello from RootLayout health check.',
          });
        }
      } catch (err) {
        console.warn('AI health check failed:', err);
      }
    })();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
