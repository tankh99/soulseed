import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {Image} from 'expo-image'
import ScreenLayout from '@/components/ScreenLayout';

export default function IndexPage() {
  useEffect(() => {
    // Check if user is already registered/logged in
    // For now, we'll always redirect to onboarding
    // In a real app, you'd check authentication state here
    
    const timer = setTimeout(() => {
      // Simulate checking authentication state
      const isAuthenticated = false; // This would come from your auth state
      
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding/intro');
      }
    }, 2000); // Show loading screen for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenLayout
      contentStyle={styles.container}
      showBackButton={false}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          {/* <Text style={styles.logoEmoji}>🌱</Text> */}
          <Image source={require('../assets/images/base_form.png')} 
            style={styles.logoImage} />
          <Text style={styles.logoText}>Soulseed</Text>
        </View>
        <ActivityIndicator size="large" color="#FFFFFF" style={styles.spinner} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
});
