import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/colors';
import ScreenLayout from '@/components/ScreenLayout';

export default function PersonalitySubmitPage() {
  const { scores } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    submitPersonalityData();
  }, []);

  const submitPersonalityData = async () => {
    try {
      setIsLoading(true);
      
      // Parse the scores from the URL params
      const personalityScores = JSON.parse(scores as string);
      
      // Mock API call - simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful response
      const mockSessionId = `session-${Date.now()}`;
      
      // Navigate to soulseed result page
      router.push({
        pathname: '/onboarding/soulseed-result',
        params: { 
          personalityScores: JSON.stringify(personalityScores),
          sessionId: mockSessionId
        }
      });
      
    } catch (err) {
      console.error('Error submitting personality data:', err);
      setError('Failed to submit your personality assessment. Please try again.');
      
      // Show error alert
      Alert.alert(
        'Submission Failed',
        'There was an error submitting your personality assessment. Would you like to try again?',
        [
          {
            text: 'Retry',
            onPress: () => {
              setError(null);
              submitPersonalityData();
            }
          },
          {
            text: 'Cancel',
            onPress: () => router.back(),
            style: 'cancel'
          }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <LinearGradient
        colors={Colors.gradientPrimary}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <ScreenLayout
      disableBottomSafeArea
    >
      <View style={styles.content}>
        {/* Loading Animation */}
        <View style={styles.loadingContainer}>
          <View style={styles.soulseedLoader}>
            <Text style={styles.soulseedEmoji}>🌱</Text>
          </View>
          <ActivityIndicator size="large" color="#FFFFFF" style={styles.spinner} />
        </View>

        {/* Status Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {isLoading ? 'Analyzing Your Personality...' : 'Processing Complete!'}
          </Text>
          <Text style={styles.subtitle}>
            {isLoading 
              ? 'We\'re carefully analyzing your responses to create your unique Soulseed'
              : 'Your Soulseed is ready!'
            }
          </Text>
        </View>

        {/* Progress Steps */}
        <View style={styles.stepsContainer}>
          <View style={[styles.step, styles.stepCompleted]}>
            <Text style={styles.stepText}>✓ Personality Assessment</Text>
          </View>
          <View style={[styles.step, isLoading ? styles.stepActive : styles.stepCompleted]}>
            <Text style={styles.stepText}>
              {isLoading ? '⟳ Processing Results' : '✓ Processing Results'}
            </Text>
          </View>
          <View style={[styles.step, !isLoading ? styles.stepNext : styles.stepPending]}>
            <Text style={styles.stepText}>⏳ Creating Your Soulseed</Text>
          </View>
        </View>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  soulseedLoader: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 20,
  },
  soulseedEmoji: {
    fontSize: 50,
  },
  spinner: {
    marginTop: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  stepsContainer: {
    width: '100%',
    maxWidth: 300,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepCompleted: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  stepActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  stepNext: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  stepPending: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  stepText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
