import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { SoulseedDisplay } from '@/components/SoulseedDisplay';

interface SoulseedData {
  name: string;
  tagline: string;
  level: number;
  personality: {
    openness: number;
    conscientiousness: number;
    extroversion: number;
    agreeableness: number;
    neuroticism: number;
  };
}

export default function SoulseedResultPage() {
  const { personalityScores, sessionId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [soulseedData, setSoulseedData] = useState<SoulseedData | null>(null);
  const [editableName, setEditableName] = useState('');
  const [editableTagline, setEditableTagline] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingTagline, setIsEditingTagline] = useState(false);

  useEffect(() => {
    generateSoulseed();
  }, []);

  const generateSoulseed = async () => {
    try {
      setIsLoading(true);
      
      // Parse personality scores
      const scores = JSON.parse(personalityScores as string);
      
      // Mock API call - simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock soulseed data - default to openness soulseed
      const mockSoulseed: SoulseedData = {
        name: "Curious",
        tagline: "An imaginative and creative companion who loves exploring new ideas and possibilities. Born from your openness to experience, this soulseed thrives on curiosity and innovation.",
        level: 1,
        personality: scores,
      };
      
      setSoulseedData(mockSoulseed);
      setEditableName(mockSoulseed.name);
      setEditableTagline(mockSoulseed.tagline);
      
    } catch (err) {
      console.error('Error generating soulseed:', err);
      
      // Fallback with default openness soulseed
      const scores = JSON.parse(personalityScores as string);
      const fallbackSoulseed: SoulseedData = {
        name: "Curious",
        tagline: "An imaginative and creative companion who loves exploring new ideas and possibilities.",
        level: 1,
        personality: scores,
      };
      
      setSoulseedData(fallbackSoulseed);
      setEditableName(fallbackSoulseed.name);
      setEditableTagline(fallbackSoulseed.tagline);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (soulseedData) {
      router.push({
        pathname: '/onboarding/register',
        params: {
          soulseedName: editableName,
          soulseedTagline: editableTagline,
          sessionId: sessionId as string,
        }
      });
    }
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#8B7BD8', '#6366F1']}
        style={styles.container}
      >
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Creating your Soulseed...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!soulseedData) {
    return (
      <LinearGradient
        colors={['#F8F9FF', '#E8EDFF']}
        style={styles.container}
      >
        <View style={styles.errorContent}>
          <Text style={styles.errorText}>Failed to generate your Soulseed. Please try again.</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#F8F9FF', '#E8EDFF', '#D6E3FF']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Meet Your Soulseed!</Text>
            <Text style={styles.subtitle}>Born from your unique personality</Text>
          </View>

          {/* Soulseed Display */}
          <View style={styles.soulseedContainer}>
            <SoulseedDisplay
              level={soulseedData.level}
              personality={soulseedData.personality}
              size="large"
            />
          </View>

          {/* Editable Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <TouchableOpacity
              style={styles.inputField}
              onPress={() => setIsEditingName(true)}
            >
              {isEditingName ? (
                <TextInput
                  style={styles.textInput}
                  value={editableName}
                  onChangeText={setEditableName}
                  onBlur={() => setIsEditingName(false)}
                  autoFocus
                  selectTextOnFocus
                />
              ) : (
                <Text style={styles.inputText}>{editableName}</Text>
              )}
              <Text style={styles.editHint}>Tap to edit</Text>
            </TouchableOpacity>
          </View>

          {/* Editable Tagline */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Character Description</Text>
            <TouchableOpacity
              style={[styles.inputField, styles.textAreaField]}
              onPress={() => setIsEditingTagline(true)}
            >
              {isEditingTagline ? (
                <TextInput
                  style={[styles.textInput, styles.textAreaInput]}
                  value={editableTagline}
                  onChangeText={setEditableTagline}
                  onBlur={() => setIsEditingTagline(false)}
                  multiline
                  numberOfLines={3}
                  autoFocus
                  selectTextOnFocus
                />
              ) : (
                <Text style={styles.inputText}>{editableTagline}</Text>
              )}
              <Text style={styles.editHint}>Tap to edit</Text>
            </TouchableOpacity>
          </View>

          {/* Personality Traits Summary */}
          <View style={styles.traitsContainer}>
            <Text style={styles.traitsTitle}>Your Soulseed's Traits</Text>
            <View style={styles.traitsGrid}>
              {Object.entries(soulseedData.personality).map(([trait, value]) => (
                <View key={trait} style={styles.traitItem}>
                  <Text style={styles.traitName}>
                    {trait.charAt(0).toUpperCase() + trait.slice(1)}
                  </Text>
                  <View style={styles.traitBar}>
                    <View 
                      style={[
                        styles.traitFill, 
                        { width: `${value * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.traitValue}>
                    {Math.round(value * 100)}%
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <LinearGradient
              colors={['#8B7BD8', '#6366F1']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Continue to Registration</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 20,
    fontWeight: '500',
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A0B3D',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  soulseedContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputField: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textAreaField: {
    minHeight: 80,
  },
  textInput: {
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
  },
  textAreaInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  inputText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 22,
  },
  editHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  traitsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  traitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  traitsGrid: {
    gap: 12,
  },
  traitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  traitName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    width: 100,
  },
  traitBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  traitFill: {
    height: '100%',
    backgroundColor: '#8B7BD8',
    borderRadius: 4,
  },
  traitValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    width: 40,
    textAlign: 'right',
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#8B7BD8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
