import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Sparkles, Send } from 'lucide-react-native';
import { MoodSelector } from '../../components/MoodSelector';
import { SoulseedDisplay } from '../../components/SoulseedDisplay';

export default function JournalScreen() {
  const [currentStep, setCurrentStep] = useState<'mood' | 'journal' | 'complete'>('mood');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [journalText, setJournalText] = useState('');
  const [showUnpackIt, setShowUnpackIt] = useState(false);
  const [unpackSuggestions, setUnpackSuggestions] = useState<string[]>([]);

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy', color: '#4ADE80' },
    { id: 'surprised', emoji: '😮', label: 'Surprised', color: '#06B6D4' },
    { id: 'sad', emoji: '😢', label: 'Sad', color: '#3B82F6' },
    { id: 'angry', emoji: '😠', label: 'Angry', color: '#EF4444' },
    { id: 'neutral', emoji: '😐', label: 'Neutral', color: '#6B7280' },
  ];

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setTimeout(() => {
      setCurrentStep('journal');
    }, 300);
  };

  const handleUnpackIt = () => {
    if (!journalText.trim()) {
      Alert.alert('Empty Journal', 'Please write something first before unpacking your thoughts.');
      return;
    }

    // Simulate LLM response
    const suggestions = [
      "What specific moment today made you feel this way?",
      "How does this feeling compare to yesterday?",
      "What would you tell a friend feeling the same way?",
      "What's one small thing that might help right now?"
    ];
    
    setUnpackSuggestions(suggestions);
    setShowUnpackIt(true);
  };

  const handleSubmit = () => {
    if (!journalText.trim()) {
      Alert.alert('Empty Journal', 'Please write something before submitting.');
      return;
    }

    // Simulate submission
    setCurrentStep('complete');
    setTimeout(() => {
      // Reset for next session
      setCurrentStep('mood');
      setSelectedMood('');
      setJournalText('');
      setShowUnpackIt(false);
      setUnpackSuggestions([]);
    }, 3000);
  };

  if (currentStep === 'complete') {
    return (
      <LinearGradient colors={['#2D1B69', '#1A0B3D']} style={styles.container}>
        <View style={styles.completeContainer}>
          <SoulseedDisplay level={2} personality={{
            openness: 0.8,
            conscientiousness: 0.6,
            extroversion: 0.7,
            agreeableness: 0.9,
            neuroticism: 0.3,
          }} />
          <Text style={styles.completeTitle}>Journal Saved! ✨</Text>
          <Text style={styles.completeSubtext}>
            Your soulseed grows stronger with each reflection
          </Text>
          <View style={styles.pointsEarned}>
            <Text style={styles.pointsText}>+25 points earned</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#2D1B69', '#1A0B3D']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (currentStep === 'journal') {
              setCurrentStep('mood');
            }
          }}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentStep === 'mood' ? 'How are you feeling?' : 'Journal Entry'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 'mood' && (
          <View style={styles.moodSection}>
            <View style={styles.soulseedPreview}>
              <SoulseedDisplay 
                level={2} 
                personality={{
                  openness: 0.8,
                  conscientiousness: 0.6,
                  extroversion: 0.7,
                  agreeableness: 0.9,
                  neuroticism: 0.3,
                }}
                size="small"
              />
            </View>
            <Text style={styles.moodPrompt}>
              Your soulseed is curious about your current mood
            </Text>
            <MoodSelector 
              moods={moods} 
              selectedMood={selectedMood}
              onSelect={handleMoodSelect}
            />
          </View>
        )}

        {currentStep === 'journal' && (
          <View style={styles.journalSection}>
            <Text style={styles.journalPrompt}>
              What's on your mind? Share your thoughts freely...
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                multiline
                placeholder="I feel really good today. My school life is great and I have plenty of friends, but I still feel so lonely. It feels like everything might come crashing down on me one day and I can't do anything about it..."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={journalText}
                onChangeText={setJournalText}
                textAlignVertical="top"
              />
            </View>

            {showUnpackIt && (
              <View style={styles.unpackSection}>
                <Text style={styles.unpackTitle}>💭 Reflection Questions</Text>
                {unpackSuggestions.map((suggestion, index) => (
                  <TouchableOpacity key={index} style={styles.suggestionCard}>
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.unpackButton}
                onPress={handleUnpackIt}
              >
                <Sparkles size={20} color="#FFD700" />
                <Text style={styles.unpackButtonText}>Unpack It</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Send size={20} color="#1A0B3D" />
                <Text style={styles.submitButtonText}>Finish Entry</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  moodSection: {
    alignItems: 'center',
  },
  soulseedPreview: {
    marginBottom: 24,
  },
  moodPrompt: {
    fontSize: 16,
    color: '#8B7BD8',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  journalSection: {
    flex: 1,
  },
  journalPrompt: {
    fontSize: 16,
    color: '#8B7BD8',
    marginBottom: 24,
    lineHeight: 24,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.3)',
    marginBottom: 24,
  },
  textInput: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    padding: 20,
    minHeight: 200,
  },
  unpackSection: {
    marginBottom: 24,
  },
  unpackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  suggestionCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  suggestionText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  unpackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  unpackButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B7BD8',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  submitButtonText: {
    color: '#1A0B3D',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  completeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 32,
  },
  completeSubtext: {
    fontSize: 16,
    color: '#8B7BD8',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  pointsEarned: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  pointsText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
});