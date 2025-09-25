import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Sparkles, Send } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import ScreenLayout from '../../../components/ScreenLayout';
import Header from '../../../components/Header';
import { SoulseedDisplay } from '../../../components/SoulseedDisplay';
import { SoulseedData } from '../../../constants/userData';
import { getMoodData } from '../../../constants/moods';
import { useAudioPlayer } from 'expo-audio';
import { getNextUncollectedFruit, collectFruit } from "../../../data/userFruits";
import { Colors } from '../../../constants/colors';
import {
  fetchNextQuestion,
  completeConversation,
  type JournalConversationMessage,
} from '@/services/journalApi';

export default function JournalEntryPage() {
  const { mood } = useLocalSearchParams();
  const selectedMood = mood as string;
  const moodData = getMoodData(selectedMood);
  
  const [journalText, setJournalText] = useState('');
  const [showUnpackIt, setShowUnpackIt] = useState(false);
  const [unpackSuggestions, setUnpackSuggestions] = useState<string[]>([]);
  const [conversationMode, setConversationMode] = useState(false);
  const [conversationThread, setConversationThread] = useState<JournalConversationMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [conversationStep, setConversationStep] = useState(0);
  const [isCurrentQuestionFinal, setIsCurrentQuestionFinal] = useState(false);

  const conversationScrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (conversationMode) {
      conversationScrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [conversationThread, currentQuestion]);

  const chimePlayer = useAudioPlayer(require('../../../assets/sounds/chime.mp3'));

  const navigateToCompletion = () => {
    router.push({
      pathname: '/(journal)/complete' as any,
      params: { mood: selectedMood, text: journalText }
    });
  };

  const resetConversationState = () => {
    setConversationMode(false);
    setShowUnpackIt(false);
    setConversationThread([]);
    setCurrentQuestion('');
    setCurrentAnswer('');
    setConversationStep(0);
    setIsCurrentQuestionFinal(false);
  };

  const handleSave = () => {
    if (!journalText.trim()) {
      Alert.alert('Empty Entry', 'Please write something before saving.');
      return;
    }

    // Fruit collection logic
    const nextFruit = getNextUncollectedFruit();
    if (nextFruit) {
      collectFruit(nextFruit.id);
      // Alert.alert(
      //   "New Fruit Collected!",
      //   `You've collected the ${nextFruit.name}! Check it out in your almanac.`,
      //   [{ text: "OK" }]
      // );
    }

    // Navigate to complete page
    router.push({
      pathname: '/(journal)/complete' as any,
      params: { mood: selectedMood, text: journalText }
    });
  };

  const handleUnpackIt = async () => {
    if (!journalText.trim()) {
      Alert.alert('Empty Entry', 'Please write something before unpacking.');
      return;
    }

    setConversationMode(true);
    setShowUnpackIt(true);
    
    const trimmedEntry = journalText.trim();
    const initialThread: JournalConversationMessage[] = [
      { role: 'user', content: trimmedEntry }
    ];

    setIsWaitingForResponse(true);
    setConversationThread(initialThread);
    setConversationStep(0);
    setIsCurrentQuestionFinal(false);

    try {
      const firstQuestion = await fetchNextQuestion({
        mood: selectedMood,
        journalText: trimmedEntry,
        conversation: initialThread,
        step: 0,
      });

      setCurrentQuestion(firstQuestion.question);
      setIsCurrentQuestionFinal(firstQuestion.isFinalStep);
    } catch (error) {
      console.error('Failed to start guided reflection', error);
      Alert.alert(
        'Unable to start',
        'We could not start the guided reflection right now. Please try again in a moment.'
      );
      resetConversationState();
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  const handleSendAnswer = async () => {
    const trimmedAnswer = currentAnswer.trim();
    if (!trimmedAnswer || !currentQuestion) return;

    const previousThread = conversationThread;
    const previousQuestion = currentQuestion;
    const entryText = journalText.trim();

    const updatedThread: JournalConversationMessage[] = [
      ...conversationThread,
      { role: 'assistant', content: currentQuestion },
      { role: 'user', content: trimmedAnswer }
    ];

    setIsWaitingForResponse(true);
    setConversationThread(updatedThread);
    setCurrentQuestion('');
    setCurrentAnswer('');

    try {
      if (isCurrentQuestionFinal) {
        await completeConversation({
          mood: selectedMood,
          journalText: entryText,
          conversation: updatedThread,
        });
        resetConversationState();
        navigateToCompletion();
      } else {
        const nextStep = conversationStep + 1;
        const nextQuestion = await fetchNextQuestion({
          mood: selectedMood,
          journalText: entryText,
          conversation: updatedThread,
          step: nextStep,
        });

        setCurrentQuestion(nextQuestion.question);
        setIsCurrentQuestionFinal(nextQuestion.isFinalStep);
        setConversationStep(nextStep);
      }
    } catch (error) {
      console.error('Failed to progress guided reflection', error);
      Alert.alert(
        'Something went wrong',
        'We could not send your response. Please try again.'
      );
      setConversationThread(previousThread);
      setCurrentQuestion(previousQuestion);
      setCurrentAnswer(trimmedAnswer);
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  const handleEndConversation = async () => {
    const trimmedAnswer = currentAnswer.trim();
    const entryText = journalText.trim();
    const finalThread: JournalConversationMessage[] = [...conversationThread];

    if (currentQuestion) {
      finalThread.push({ role: 'assistant', content: currentQuestion });
    }

    if (trimmedAnswer) {
      finalThread.push({ role: 'user', content: trimmedAnswer });
    }

    if (finalThread.length === 0) {
      resetConversationState();
      return;
    }

    try {
      setIsWaitingForResponse(true);
      await completeConversation({
        mood: selectedMood,
        journalText: entryText,
        conversation: finalThread,
      });
      resetConversationState();
      navigateToCompletion();
    } catch (error) {
      console.error('Failed to finish guided reflection', error);
      Alert.alert(
        'Something went wrong',
        'We could not finish the guided reflection right now. Please try again.'
      );
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  return (
    <ScreenLayout showKeyboardAvoiding={false}>
      <Header
        showBackButton={true}
        onBackPress={() => {
          if (conversationMode) {
            resetConversationState();
          } else {
            router.back()
            // router.replace('/(tabs)/(journal)/mood' as any);
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
              {selectedMood === 'surprised' && "What caught you off guard?"}
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
                  You chose: <Text style={{fontWeight: 'bold'}}>{moodData?.emoji} {moodData?.label}</Text>
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
                  ...(currentQuestion ? [{ role: 'assistant' as const, content: currentQuestion, id: 'current-question' }] : [])
                ].map((item, index) => (
                  <View 
                    key={'id' in item ? item.id : `message-${index}`} 
                    style={[
                      styles.messageContainer,
                      item.role === 'user' ? styles.userMessage : styles.assistantMessage
                    ]}
                  >
                    <Text style={[
                      styles.messageText,
                      item.role === 'user' ? styles.userMessageText : styles.assistantMessageText
                    ]}>
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
                    style={[styles.sendAnswerButton, (isWaitingForResponse || !currentAnswer.trim()) && styles.sendAnswerButtonDisabled]}
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
