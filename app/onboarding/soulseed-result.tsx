import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { SoulseedDisplay } from '@/components/SoulseedDisplay';
import { Colors } from '../../constants/colors';
import ScreenLayout from '@/components/ScreenLayout';
import Button from '@/components/Button';

interface SoulseedData {
  name: string;
  statement: string;
  level: number;
  personality: {
    openness: number;
    conscientiousness: number;
    extroversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  trait: string;
  scar: string;
  variationSlots: string[];
  growthExpression: string[];
  palette: string[];
}

export default function SoulseedResultPage() {
  const { personalityScores, sessionId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [soulseedData, setSoulseedData] = useState<SoulseedData | null>(null);
  const [editableName, setEditableName] = useState('');
  const [editableStatement, setEditableStatement] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingStatement, setIsEditingStatement] = useState(false);

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
      
      // Mock soulseed data - will use the actual personality-based soulseed
      const mockSoulseed: SoulseedData = {
        name: "Astra",
        statement: "Drifts into daydreams, but shines in seeing possibilities no one else imagines.",
        level: 1,
        personality: scores,
        trait: "openness",
        scar: "Constellation freckles inside the body.",
        variationSlots: ["star clusters", "spiral galaxies", "prism shards"],
        growthExpression: ["surreal patterns", "ethereal wings", "shifting hues"],
        palette: ["Indigo", "iridescent gradients", "gold sparks"],
      };
      
      setSoulseedData(mockSoulseed);
      setEditableName(mockSoulseed.name);
      setEditableStatement(mockSoulseed.statement);
      
    } catch (err) {
      console.error('Error generating soulseed:', err);
      
      // Fallback with default openness soulseed
      const scores = JSON.parse(personalityScores as string);
      const fallbackSoulseed: SoulseedData = {
        name: "Astra",
        statement: "Drifts into daydreams, but shines in seeing possibilities no one else imagines.",
        level: 1,
        personality: scores,
        trait: "openness",
        scar: "Constellation freckles inside the body.",
        variationSlots: ["star clusters", "spiral galaxies", "prism shards"],
        growthExpression: ["surreal patterns", "ethereal wings", "shifting hues"],
        palette: ["Indigo", "iridescent gradients", "gold sparks"],
      };
      
      setSoulseedData(fallbackSoulseed);
      setEditableName(fallbackSoulseed.name);
      setEditableStatement(fallbackSoulseed.statement);
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
          soulseedStatement: editableStatement,
          sessionId: sessionId as string,
        }
      });
    }
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={Colors.gradientBackground}
        style={styles.container}
      >
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={Colors.textPrimary} />
          <Text style={styles.loadingText}>Creating your Soulseed...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!soulseedData) {
    return (
      <LinearGradient
        colors={Colors.gradientPrimary}
        style={styles.container}
      >
        <View style={styles.errorContent}>
          <Text style={styles.errorText}>Failed to generate your Soulseed. Please try again.</Text>
        </View>
      </LinearGradient> 
    );
  }

  return (
    <ScreenLayout
      disableBottomSafeArea
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

          {/* Editable Statement */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Character Statement</Text>
            <TouchableOpacity
              style={[styles.inputField, styles.textAreaField]}
              onPress={() => setIsEditingStatement(true)}
            >
              {isEditingStatement ? (
                <TextInput
                  style={[styles.textInput, styles.textAreaInput]}
                  value={editableStatement}
                  onChangeText={setEditableStatement}
                  onBlur={() => setIsEditingStatement(false)}
                  multiline
                  numberOfLines={3}
                  autoFocus
                  selectTextOnFocus
                />
              ) : (
                <Text style={styles.inputText}>{editableStatement}</Text>
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
  
          <Button
            textStyle={{textAlign: "center"}}
            title="Continue to Registration"
            onPress={handleContinue}
          />
        </View>
      </ScrollView>
    </ScreenLayout>
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
    color: 'white',
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
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  inputField: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  textAreaField: {
    minHeight: 80,
  },
  textInput: {
    fontSize: 16,
    color: Colors.textPrimary,
    padding: 0,
  },
  textAreaInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  inputText: {
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  editHint: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  traitsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  traitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
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
    color: Colors.textMuted,
    width: 100,
  },
  traitBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  traitFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 4,
  },
  traitValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    width: 40,
    textAlign: 'right',
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.secondary,
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
