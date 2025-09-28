import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Sparkles, Send } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import ScreenLayout from '../../../components/ScreenLayout';
import Header from '../../../components/Header';
import { SoulseedDisplay } from '../../../components/SoulseedDisplay';
import { SoulseedData } from '../../../constants/userData';
import { getMoodData } from '../../../constants/moods';
import { useAudioPlayer } from 'expo-audio';
import { getUserFruits, getNextUncollectedFruit, collectFruit } from '../../../data/userFruits';
import { Colors } from '../../../constants/colors';
import { Api } from '@/services/api';

export default function JournalEntryPage() {
  const { mood } = useLocalSearchParams();
  const selectedMood = mood as string;
  const moodData = getMoodData(selectedMood);

  const [journalText, setJournalText] = useState('');
  const [showUnpackIt, setShowUnpackIt] = useState(false);
  const [unpackSuggestions, setUnpackSuggestions] = useState<string[]>([]);
  const [conversationMode, setConversationMode] = useState(false);
  const [conversationThread, setConversationThread] = useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [conversationStep, setConversationStep] = useState(0);

  const conversationScrollViewRef = useRef<ScrollView>(null);
  const chimePlayer = useAudioPlayer(require('../../../assets/sounds/chime.mp3'));

  useEffect(() => {
    if (conversationMode) {
      conversationScrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [conversationThread, currentQuestion, conversationMode]);

  // === Backend-powered next-question generator (calls /unpack via Api.AI.getGuidance) ===
  const getNextQuestion = async (
    mood: string,
    journalText: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    step: number
  ): Promise<string> => {
    // Compact conversation context for the model
    const historyStr = conversationHistory
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    try {
      const guidance = await Api.AI.getGuidance({
        text: `${journalText}\n\n${historyStr}`,
        mood,
      });

      // Prefer suggestions (as prompts) → coping → strengths-derived prompts
      const candidates: string[] = [
        ...(guidance.suggestions ?? []),
        ...(guidance.immediateCoping ?? []),
        ...(guidance.strengths ?? []).map((s) => `Can you give an example of "${s}" from today?`),
      ].filter(Boolean);

      return candidates[step] || candidates[0] || "Tell me more about what you're experiencing.";
    } catch (e) {
      console.warn('[Journal] getNextQuestion fallback, error:', e);

      // Original mood-based fallbacks (kept to preserve UX if backend fails)
      const moodQuestions = {
        happy: [
          'What made this moment so special for you?',
          'How can you recreate this feeling in other parts of your life?',
          'What would you tell someone else who wants to feel this way?',
        ],
        sad: [
          "What's weighing on your heart right now?",
          'What support do you need during this difficult time?',
          'What small step could you take to care for yourself today?',
        ],
        angry: [
          'What triggered this feeling in you?',
          'What boundaries might you need to set?',
          'How can you channel this energy constructively?',
        ],
        surprised: [
          'What caught you off guard about this situation?',
          'How does this change your perspective?',
          'What new possibilities does this open up?',
        ],
        neutral: [
          "What's on your mind right now?",
          'What would you like to explore or understand better?',
          'How are you feeling about your current state?',
        ],
      } as const;

      const qs = (moodQuestions as any)[mood] ?? moodQuestions.neutral;
      return qs[step] ?? "Tell me more about what you're experiencing.";
    }
  };

  // === Send the final conversation to backend (posts to /unpack; safe no-op if it fails) ===
  const sendConversationToBackend = async (
    thread: Array<{ role: 'user' | 'assistant'; content: string }>,
    mood: string,
    journalText: string
  ): Promise<boolean> => {
    try {
      const conversationString = thread
        .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');

      await Api.AI.unpack({
        text: `Journal:\n${journalText}\n\nConversation:\n${conversationString}`,
        mood,
      });
      return true;
    } catch (e) {
      console.warn('[Journal] sendConversationToBackend failed:', e);
      return false;
    }
  };

  const handleSave = () => {
    if (!journalText.trim()) {
      Alert.alert('Empty Entry', 'Please write something before saving.');
      return;
    }

    const nextFruit = getNextUncollectedFruit();
    if (nextFruit) {
      collectFruit(nextFruit.id);
    }

    router.push({
      pathname: '/(journal)/complete' as any,
      params: { mood: selectedMood, text: journalText },
    });
  };

  const handleUnpackIt = async () => {
    if (!journalText.trim()) {
      Alert.alert('Empty Entry', 'Please write something before unpacking.');
      return;
    }

    setConversationMode(true);
    setShowUnpackIt(true);

    // Initialize conversation with the user’s journal text
    const initialThread = [{ role: 'user' as const, content: journalText }];

    // Get first question from backend-guided helper (with graceful fallback)
    const firstQuestion = await getNextQuestion(selectedMood, journalText, initialThread, 0);

    setCurrentQuestion(firstQuestion);
    setConversationThread(initialThread);
  };

  const handleSendAnswer = async () => {
    if (!currentAnswer.trim()) return;

    setIsWaitingForResponse(true);

    // Add the assistant’s current question + user’s answer to the thread
    const updatedThread = [
      ...conversationThread,
      { role: 'assistant' as const, content: currentQuestion },
      { role: 'user' as const, content: currentAnswer },
    ];

    setConversationThread(updatedThread);
    setCurrentQuestion('');
    setCurrentAnswer('');

    // After 3 questions, finish
    if (conversationStep >= 2) {
      await sendConversationToBackend(updatedThread, selectedMood, journalText);
      setConversationMode(false);
      setConversationStep(0);
      setIsWaitingForResponse(false);

      router.push({
        pathname: '/(journal)/complete' as any,
        params: { mood: selectedMood, text: journalText },
      });
    } else {
      // Ask next question
      const nextQuestion = await getNextQuestion(
        selectedMood,
        journalText,
        updatedThread,
        conversationStep + 1
      );
      setCurrentQuestion(nextQuestion);
      setConversationStep((prev) => prev + 1);
      setIsWaitingForResponse(false);
    }
  };

  const handleEndConversation = async () => {
    await sendConversationToBackend(conversationThread, selectedMood, journalText);
    setConversationMode(false);
    setCurrentQuestion('');
    setCurrentAnswer('');
    setConversationStep(0);

    router.push({
      pathname: '/(journal)/complete' as any,
      params: { mood: selectedMood, text: journalText },
    });
  };

  return (
    <ScreenLayout showKeyboardAvoiding={false}>
      <Header
        showBackButton={true}
        onBackPress={() => {
          if (conversationMode) {
            setConversationMode(false);
            setCurrentQuestion('');
            setCurrentAnswer('');
            setConversationStep(0);
          } else {
            router.back();
          }
        }}
        title={conversationMode ? 'Reflection' : 'Journal'}
      />
      <View style={{ flex: 1 }}>
        {/* Always visible soulseed at the top */}
        <View style={styles.topSoulseedContainer}>
          <SoulseedDisplay
            level={SoulseedData.level}
            personality={SoulseedData.personality}
            size="medium"
            selectedMood={selectedMood}
          />
        </View>

        {!conversationMode ? (
          <View style={styles.journalSection}>
            <Text style={styles.journalPrompt}>
              {selectedMood === 'happy' && "What's bringing you joy right now?"}
              {selectedMood === 'sad' && "What's on your heart today?"}
              {selectedMood === 'angry' && "What's frustrating you?"}
              {selectedMood === 'surprised' && 'What caught you off guard?'}
              {selectedMood === 'neutral' && "What's on your mind?"}
            </Text>

            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Share your thoughts..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={journalText}
              onChangeText={setJournalText}
              textAlignVertical="top"
            />

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.unpackButton}
                onPress={handleUnpackIt}
                disabled={!journalText.trim()}
              >
                <Sparkles size={20} color="#FFFFFF" />
                <Text style={styles.unpackButtonText}>Unpack It</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={!journalText.trim()}
              >
                <Text style={styles.saveButtonText}>Save Entry</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.conversationSection}>
            {/* Selected Mood Display */}
            <View style={styles.selectedMoodContainer}>
              <Text style={styles.selectedMoodText}>
                You chose:{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {moodData?.emoji} {moodData?.label}
                </Text>
              </Text>
            </View>

            {/* Conversation History */}
            <ScrollView
              ref={conversationScrollViewRef}
              style={styles.conversationHistory}
              contentContainerStyle={{ paddingBottom: 10 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
            >
              {[
                ...conversationThread,
                ...(currentQuestion
                  ? [{ role: 'assistant' as const, content: currentQuestion, id: 'current-question' }]
                  : []),
              ].map((item, index) => (
                <View
                  key={'id' in item ? (item as any).id : `message-${index}`}
                  style={[
                    styles.messageContainer,
                    item.role === 'user' ? styles.userMessage : styles.assistantMessage,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      item.role === 'user' ? styles.userMessageText : styles.assistantMessageText,
                    ]}
                  >
                    {item.content}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* Answer Input */}
            <View style={styles.answerInputContainer}>
              <TextInput
                style={styles.answerInput}
                multiline
                placeholder="Share your thoughts..."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={currentAnswer}
                onChangeText={setCurrentAnswer}
                textAlignVertical="top"
                editable={!isWaitingForResponse}
              />

              <View style={styles.conversationActions}>
                <TouchableOpacity
                  style={styles.endConversationButton}
                  onPress={handleEndConversation}
                  disabled={isWaitingForResponse}
                >
                  <Text style={styles.endConversationText}>Finish</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sendAnswerButton,
                    (isWaitingForResponse || !currentAnswer.trim()) && styles.sendAnswerButtonDisabled,
                  ]}
                  onPress={handleSendAnswer}
                  disabled={isWaitingForResponse || !currentAnswer.trim()}
                >
                  {isWaitingForResponse ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Send size={20} color="#FFFFFF" />
                  )}
                  <Text style={styles.sendAnswerText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  topSoulseedContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  journalSection: {
    flex: 1,
  },
  journalPrompt: {
    fontSize: 18,
    color: '#8B7BD8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    color: '#FFFFFF',
    textAlignVertical: 'top',
    minHeight: 200,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  unpackButton: {
    flex: 1,
    backgroundColor: '#8B7BD8',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  unpackButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#E8C988',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#2A2F45',
    fontSize: 16,
    fontWeight: '600',
  },

  // Conversation styles
  conversationContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  conversationSection: {
    flex: 1,
  },
  selectedMoodContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedMoodText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  conversationHistory: {
    flex: 1,
    maxHeight: 300,
    marginBottom: 16,
  },
  messageContainer: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: '#8B7BD8',
    alignSelf: 'flex-end',
    marginLeft: 50,
  },
  assistantMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'flex-start',
    marginRight: 50,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: Colors.accent,
  },
  answerInputContainer: {
    paddingTop: 16,
  },
  answerInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    textAlignVertical: 'top',
    minHeight: 80,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    lineHeight: 24,
  },
  conversationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  endConversationButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  endConversationText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sendAnswerButton: {
    flex: 2,
    backgroundColor: '#8B7BD8',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    opacity: 1,
  },
  sendAnswerButtonDisabled: {
    backgroundColor: 'rgba(139, 123, 216, 0.5)',
    opacity: 0.5,
  },
  sendAnswerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
