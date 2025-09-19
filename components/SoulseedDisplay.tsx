import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image, TouchableOpacity, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AudioPlayer, useAudioPlayer } from 'expo-audio';

const { width } = Dimensions.get('window');

interface SoulseedDisplayProps {
  level: number;
  personality: {
    openness: number;
    conscientiousness: number;
    extroversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  size?: 'small' | 'medium' | 'large';
}

export function SoulseedDisplay({ level, personality, size = 'large' }: SoulseedDisplayProps) {
  const [sparkleAnim] = useState(new Animated.Value(0));
  const [glowAnim] = useState(new Animated.Value(0));
  const [isPetted, setIsPetted] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  
  // Audio players for the two petted sounds
  const player1 = useAudioPlayer(require('../assets/sounds/petted_1.m4a'));
  const player2 = useAudioPlayer(require('../assets/sounds/petted_2.m4a'));
  
  const sizeConfig = {
    small: { width: 80, height: 80 },
    medium: { width: 120, height: 120 },
    large: { width: 160, height: 160 },
  };

  const currentSize = sizeConfig[size];

  const playRandomSound = () => {
    const randomPlayer = Math.random() < 0.5 ? player1 : player2;
    randomPlayer.seekTo(0);
    randomPlayer.play();
    
    // Set playing state and reset after sound duration (assuming ~2 seconds)
    setIsPlayingSound(true);
    setTimeout(() => {
      setIsPlayingSound(false);
    }, 2500); // Slightly longer than the visual petting effect
  };

  const handlePetSoulseed = () => {
    // Prevent interaction if sound is currently playing
    if (isPlayingSound) {
      return;
    }
    
    setIsPetted(true);
    // Return to base image after 2 seconds
    playRandomSound();
    setTimeout(() => {
      setIsPetted(false);
    }, 2000);
  };

  useEffect(() => {
    // Sparkle animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const getSoulseedImage = () => {
    // Base form for level 1
    if (level === 1) {
      return 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=300'; // Placeholder for base form
    }
    
    // Evolved forms based on dominant personality traits
    const dominantTrait = Object.entries(personality).reduce((a, b) => 
      personality[a[0] as keyof typeof personality] > personality[b[0] as keyof typeof personality] ? a : b
    );

    
    switch (dominantTrait[0]) {
      case 'openness':
        return 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=300'; // Starry/cosmic
      case 'conscientiousness':
        return 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=300'; // Structured/geometric
      case 'extroversion':
        return 'https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg?auto=compress&cs=tinysrgb&w=300'; // Bright/energetic
      case 'agreeableness':
        return 'https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg?auto=compress&cs=tinysrgb&w=300'; // Warm/nurturing
      default:
        return 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=300'; // Default cosmic
    }
  };

  const getAuraColor = (): [string, string] => {
    const { openness, extroversion, agreeableness } = personality;
    
    if (openness > 0.7) return ['rgba(139, 123, 216, 0.6)', 'rgba(139, 123, 216, 0.1)'];
    if (extroversion > 0.7) return ['rgba(255, 215, 0, 0.6)', 'rgba(255, 215, 0, 0.1)'];
    if (agreeableness > 0.8) return ['rgba(236, 72, 153, 0.6)', 'rgba(236, 72, 153, 0.1)'];
    
    return ['rgba(139, 123, 216, 0.6)', 'rgba(139, 123, 216, 0.1)'];
  };

  return (
    <View style={[styles.container, currentSize]}>
      {/* Glow Effect */}
      <Animated.View
        style={[
          styles.glowContainer,
          {
            opacity: glowAnim,
            width: currentSize.width + 40,
            height: currentSize.height + 40,
          },
        ]}
      >
        <LinearGradient
          colors={getAuraColor()}
          style={styles.glow}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Main Soulseed */}
      <TouchableOpacity 
        style={[
          styles.soulseed, 
          currentSize,
          isPlayingSound && styles.soulseedDisabled
        ]} 
        onPress={handlePetSoulseed}
        activeOpacity={isPlayingSound ? 1 : 0.8}
        disabled={isPlayingSound}
      >
        <Image 
          source={isPetted ? require('../assets/images/petted.png') : require('../assets/images/openness.png')}
          style={styles.soulseedImage} 
          resizeMode='contain' 
        />
        {/* <LinearGradient
          colors={level > 1 ? ['#8B7BD8', '#6366F1'] : ['#F5E6A3', '#D4AF37']}
          style={styles.soulseedGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.face}>
            <View style={styles.eyes}>
              <View style={[styles.eye, { backgroundColor: '#1A0B3D' }]} />
              <View style={[styles.eye, { backgroundColor: '#1A0B3D' }]} />
            </View>
            <View style={[styles.mouth, { backgroundColor: '#1A0B3D' }]} />
          </View>
        </LinearGradient> */}
      </TouchableOpacity>

      {/* Sparkle Effects */}
      {level > 1 && (
        <Animated.View
          style={[
            styles.sparklesContainer,
            {
              opacity: sparkleAnim,
              transform: [
                {
                  rotate: sparkleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        >
          {[...Array(6)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.sparkle,
                {
                  transform: [
                    { rotate: `${index * 60}deg` },
                    { translateY: -currentSize.width * 0.6 },
                  ],
                },
              ]}
            >
              <View style={styles.sparkleInner} />
            </View>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowContainer: {
    position: 'absolute',
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  soulseed: {
    borderRadius: 1000,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#8B7BD8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  soulseedDisabled: {
    opacity: 0.6,
    elevation: 4,
    shadowOpacity: 0.1,
  },
  soulseedGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  face: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyes: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  eye: {
    width: 12,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  mouth: {
    width: 20,
    height: 8,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  sparklesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sparkle: {
    position: 'absolute',
    width: 8,
    height: 8,
    left: '50%',
    top: '50%',
    marginLeft: -4,
    marginTop: -4,
  },
  sparkleInner: {
    width: 8,
    height: 8,
    backgroundColor: '#FFD700',
    borderRadius: 4,
    opacity: 0.8,
  },
  soulseedImage: {
    flex: 1,
    width: "100%",
    // width: 40
  }
});