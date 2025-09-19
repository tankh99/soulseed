import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image, TouchableOpacity, Button, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AudioPlayer, useAudioPlayer } from 'expo-audio';
import { Colors } from '../constants/colors';

const { width } = Dimensions.get('window');

interface SoulseedDisplayProps {
  level: number;
  personality: {
    openness: number;
    conscientiousness: number;
    extroversion: number;
    agreeableness: number;
    resilience: number;
  };
  size?: 'small' | 'medium' | 'large';
  selectedMood?: string;
}

export function SoulseedDisplay({ level, personality, size = 'large', selectedMood }: SoulseedDisplayProps) {
  const [sparkleAnim] = useState(new Animated.Value(0));
  const [glowAnim] = useState(new Animated.Value(0));
  const [isPetted, setIsPetted] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [currentMoodImage, setCurrentMoodImage] = useState<string | null>(null);
  
  // Audio players for the two petted sounds
  const player1 = useAudioPlayer(require('../assets/sounds/petted_1.m4a'));
  const player2 = useAudioPlayer(require('../assets/sounds/petted_2.m4a'));
  
  // Audio players for mood reactions (placeholder - will be replaced with actual sounds)
  const moodHappyPlayer = useAudioPlayer(require('../assets/sounds/happy_1.m4a')); // Placeholder
  const moodSadPlayer = useAudioPlayer(require('../assets/sounds/sad_1.m4a')); // Placeholder
  const moodAngryPlayer = useAudioPlayer(require('../assets/sounds/angry_1.m4a')); // Placeholder
  const moodSurprisedPlayer = useAudioPlayer(require('../assets/sounds/surprise_1.m4a')); // Placeholder
  const moodNeutralPlayer = useAudioPlayer(require('../assets/sounds/neutral_1.m4a')); // Placeholder
  
  const sizeConfig = {
    small: { width: 80, height: 80 },
    medium: { width: 120, height: 120 },
    large: { width: 160, height: 160 },
  };

  const currentSize = sizeConfig[size];

  // Handle mood changes
  useEffect(() => {
    if (selectedMood) {
      setCurrentMoodImage(getMoodImage(selectedMood));
      playMoodSound(selectedMood);
      
      // Reset mood image after 2 seconds
      setTimeout(() => {
        setCurrentMoodImage(null);
      }, 2000);
    }
  }, [selectedMood]);

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

  const playMoodSound = (mood: string) => {
    let player;
    switch (mood) {
      case 'happy':
        player = moodHappyPlayer;
        break;
      case 'sad':
        player = moodSadPlayer;
        break;
      case 'angry':
        player = moodAngryPlayer;
        break;
      case 'surprised':
        player = moodSurprisedPlayer;
        break;
      case 'neutral':
        player = moodNeutralPlayer;
        break;
      default:
        return;
    }
    
    player.seekTo(0);
    player.play();
    
    // Set playing state and reset after sound duration
    setIsPlayingSound(true);
    setTimeout(() => {
      setIsPlayingSound(false);
    }, 2000);
  };

  const getMoodImage = (mood: string): string => {
    // Placeholder - will be replaced with actual mood-specific images
    switch (mood) {
      case 'happy':
        return require('../assets/images/reactions/openness/happy.png'); // Placeholder
      case 'sad':
        return require('../assets/images/reactions/openness/sad.png'); // Placeholder
      case 'angry':
        return require('../assets/images/reactions/openness/angry.png'); // Placeholder
      case 'surprised':
        return require('../assets/images/reactions/openness/surprised.png'); // Placeholder
      case 'neutral':
        return require('../assets/images/reactions/openness/neutral.png'); // Placeholder
      default:
        return require('../assets/images/openness.png');
    }
  };

  const handlePetSoulseed = () => {
    // Prevent interaction if sound is currently playing
    if (isPlayingSound) {
      return;
    }

    const currentTime = Date.now();
    
    // Reset tap count if more than 1 second has passed since last tap
    if (currentTime - lastTapTime > 1000) {
      setTapCount(1);
    } else {
      setTapCount(prev => prev + 1);
    }
    
    setLastTapTime(currentTime);
    
    // If 3 taps within 1 second, trigger petting effect
    if (tapCount >= 2) { // tapCount will be 2 when this is the 3rd tap
      setIsPetted(true);
      playRandomSound();
      
      // Reset tap count
      setTapCount(0);
      
      // Return to base image after 2 seconds
      setTimeout(() => {
        setIsPetted(false);
      }, 2000);
    }
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
    
    if (openness > 0.7) return [Colors.secondaryAlpha30, Colors.secondaryAlpha10];
    if (extroversion > 0.7) return [Colors.accentAlpha30, Colors.accentAlpha10];
    if (agreeableness > 0.8) return [Colors.secondaryAlpha30, Colors.secondaryAlpha10];
    
    return [Colors.soulseedAura, Colors.secondaryAlpha10];
  };

  return (
    <View style={[styles.container, currentSize]}>
      {/* Glow Effect */}
      <Animated.View
        pointerEvents="none"
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
      <TouchableWithoutFeedback
        style={[
          styles.soulseed, 
          currentSize,
          isPlayingSound && styles.soulseedDisabled
        ]} 
        onPress={handlePetSoulseed}
        // activeOpacity={isPlayingSound ? 1 : 0.8}
        disabled={isPlayingSound}
      >
        <Image 
          source={
            currentMoodImage ? currentMoodImage : 
            isPetted ? require('../assets/images/petted.png') : 
            require('../assets/images/openness.png')
          }
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
      </TouchableWithoutFeedback>

      {/* Sparkle Effects */}
      {level > 1 && (
        <Animated.View
          pointerEvents="none"
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
    shadowColor: Colors.secondary,
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
    backgroundColor: Colors.accent,
    borderRadius: 4,
    opacity: 0.8,
  },
  soulseedImage: {
    flex: 1,
    width: "100%",
    // width: 40
  }
});