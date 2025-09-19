import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function IntroPage() {
  const handleStartJourney = () => {
    router.push('/onboarding/personality-test');
  };

  return (
    <LinearGradient
      colors={['#8B7BD8', '#6366F1', '#4F46E5']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        {/* Soulseed Placeholder */}
        <View style={styles.soulseedContainer}>
          <View style={styles.soulseedPlaceholder}>
            {/* <Text style={styles.soulseedEmoji}>🌱</Text> */}
            <Image 
              resizeMode='contain'
              source={require('../../assets/images/base_form.png')} style={styles.soulseedImage} />
          </View>
        </View>

        {/* Title and Description */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to Soulseed</Text>
          <Text style={styles.subtitle}>
            Discover your unique personality companion that grows and evolves with you
          </Text>
          <Text style={styles.description}>
            Take our personality assessment to create your very own Soulseed - a digital companion that reflects your inner self and grows as you do.
          </Text>
        </View>

        {/* Start Button */}
        <TouchableOpacity style={styles.startButton} onPress={handleStartJourney}>
          <LinearGradient
            colors={['#F5E6A3', '#D4AF37']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonText}>Start Your Journey</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
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
  soulseedContainer: {
    marginBottom: 60,
  },
  soulseedPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  soulseedEmoji: {
    fontSize: 80,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  soulseedImage: {
    flex: 1,
    width: "70%"
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  startButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A0B3D',
    textAlign: 'center',
  },
});
