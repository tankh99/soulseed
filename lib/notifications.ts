import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  console.log("registering")
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log("permissions", existingStatus)
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    try {
      const projectId = Constants.expoConfig?.extra?.eas.projectId;
      if (!projectId) {
        throw new Error('Could not find Expo project ID');
      }
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export async function scheduleWelcomeNotification() {
    console.log("setting notification")
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "How're you feeling today?",
      body: 'Is judging stressful?',
      data: { data: 'goes here' },
    },
    trigger: { 
        seconds: 60 * 15, // 10 minutes later
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    },
  });
}