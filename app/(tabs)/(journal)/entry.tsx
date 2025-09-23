import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  FlatList,
  Animated,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
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
import { getUserFruits, getNextUncollectedFruit, collectFruit } from "../../../data/userFruits";

export default function JournalEntryPage() {
  const { mood } = useLocalSearchParams();
  const selectedMood = mood as string;
  const moodData = getMoodData(selectedMood);
  
  const [journalText, setJournalText] = useState('');
  const [showUnpackIt, setShowUnpackIt] = useState(false);
  const [unpackSuggestions, setUnpackSuggestions] = useState<string[]>([]);
  const [conversationMode, setConversationMode] = useState(false);
  const [conversationThread, setConversationThread] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [conversationStep, setConversationStep] = useState(0);

  const conversationScrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (conversationMode) {
      conversationScrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [conversationThread, currentQuestion]);

  const chimePlayer = useAudioPlayer(require('../../../assets/sounds/chime.mp3'));

  // Mock API functions
  const mockGetNextQuestion = async (
    mood: string, 
    journalText: string, 
    conversationHistory: Array<{role: 'user' | 'assistant', content: string}>,
    step: number
  ): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mood-specific question templates for different conversation steps
    const moodQuestions = {
      happy: {
        0: "What made this moment so special for you?",
        1: "How can you recreate this feeling in other parts of your life?",
        2: "What would you tell someone else who wants to feel this way?"
      },
      sad: {
        0: "What's weighing on your heart right now?",
        1: "What support do you need during this difficult time?",
        2: "What small step could you take to care for yourself today?"
      },
      angry: {
        0: "What triggered this feeling in you?",
        1: "What boundaries might you need to set?",
        2: "How can you channel this energy constructively?"
      },
      surprised: {
        0: "What caught you off guard about this situation?",
        1: "How does this change your perspective?",
        2: "What new possibilities does this open up?"
      },
      neutral: {
        0: "What's on your mind right now?",
        1: "What would you like to explore or understand better?",
        2: "How are you feeling about your current state?"
      }
    };

    const questions = moodQuestions[mood as keyof typeof moodQuestions] || moodQuestions.neutral;
    return questions[step as keyof typeof questions] || "Tell me more about what you're experiencing.";
  };

  const mockSendConversationToBackend = async (conversationThread: Array<{role: 'user' | 'assistant', content: string}>): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Convert conversation to string format
    const conversationString = conversationThread
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n');
    
    console.log('Sending conversation to backend:', conversationString);
    return true;
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

    chimePlayer.play();

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
    
    // Initialize conversation with journal entry
    const initialThread = [
      { role: 'user' as const, content: journalText }
    ];
    
    // Get first question from LLM
    const firstQuestion = await mockGetNextQuestion(selectedMood, journalText, initialThread, 0);
    
    setCurrentQuestion(firstQuestion);
    setConversationThread(initialThread);
  };

  const handleSendAnswer = async () => {
    if (!currentAnswer.trim()) return;
    
    setIsWaitingForResponse(true);
    
    // Add user's answer to conversation
    const updatedThread = [
      ...conversationThread,
      { role: 'assistant' as const, content: currentQuestion },
      { role: 'user' as const, content: currentAnswer }
    ];

    setConversationThread(updatedThread);

    // Check if we should end conversation (after 3 questions)
    if (conversationStep >= 2) {
      // End conversation and send to backend
      await mockSendConversationToBackend(updatedThread);
      setConversationMode(false);
      setCurrentQuestion('');
      setCurrentAnswer('');
      setConversationStep(0);
      setIsWaitingForResponse(false);
      
      chimePlayer.play();

      // Navigate to complete page
      router.push({
        pathname: '/(journal)/complete' as any,
        params: { mood: selectedMood, text: journalText }
      });
    } else {
      // Get next question
      const nextQuestion = await mockGetNextQuestion(selectedMood, journalText, updatedThread, conversationStep + 1);
      setCurrentQuestion(nextQuestion);
      setCurrentAnswer('');
      setConversationStep(prev => prev + 1);
      setIsWaitingForResponse(false);
    }
  };

  const handleEndConversation = async () => {
    await mockSendConversationToBackend(conversationThread);
    setConversationMode(false);
    setCurrentQuestion('');
    setCurrentAnswer('');
    setConversationStep(0);
    
    chimePlayer.play();

    // Navigate to complete page
    router.push({
      pathname: '/(journal)/complete' as any,
      params: { mood: selectedMood, text: journalText }
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
            router.replace('/(tabs)/');
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
    color: '#FFFFFF',
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
