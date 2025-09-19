import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
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
  const [isUnpacking, setIsUnpacking] = useState(false);
  
  // Conversation flow state
  const [conversationMode, setConversationMode] = useState(false);
  const [conversationThread, setConversationThread] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [conversationStep, setConversationStep] = useState(0);

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

  // Mock API call to get next question in conversation
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
        2: "What does this happiness teach you about what you value?",
        3: "How can you share this joy with others around you?"
      },
      surprised: {
        0: "What caught you off guard about this situation?",
        1: "How does this surprise challenge your expectations?",
        2: "What new possibilities does this reveal to you?",
        3: "How might this change your perspective going forward?"
      },
      sad: {
        0: "What specifically is making you feel this way?",
        1: "What support do you need right now?",
        2: "What would comfort you in this moment?",
        3: "How can you be gentle with yourself today?"
      },
      angry: {
        0: "What triggered this feeling for you?",
        1: "What boundary might need to be set here?",
        2: "How can you channel this energy constructively?",
        3: "What would help you feel heard and understood?"
      },
      neutral: {
        0: "What's really going on beneath the surface?",
        1: "How are you feeling physically right now?",
        2: "What does your body need today?",
        3: "What small action could bring you more clarity?"
      }
    };

    // Get question for current step
    const moodQuestionSet = moodQuestions[mood as keyof typeof moodQuestions] || moodQuestions.neutral;
    const question = moodQuestionSet[step as keyof typeof moodQuestionSet] || "Thank you for sharing. Is there anything else you'd like to reflect on?";
    
    return question;
  };

  // Mock API call to send conversation to backend
  const mockSendConversationToBackend = async (conversationThread: Array<{role: 'user' | 'assistant', content: string}>): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Convert conversation to string format
    const conversationString = conversationThread
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    console.log('Sending conversation to backend:', conversationString);
    
    // Simulate successful submission
    return true;
  };

  const handleUnpackIt = async () => {
    if (!journalText.trim()) {
      Alert.alert('Empty Journal', 'Please write something first before unpacking your thoughts.');
      return;
    }

    if (!selectedMood) {
      Alert.alert('No Mood Selected', 'Please select a mood first to get personalized questions.');
      return;
    }

    setIsUnpacking(true);
    
    try {
      // Initialize conversation thread with journal entry
      const initialThread = [
        { role: 'user' as const, content: journalText }
      ];
      
      // Get first question from LLM
      const firstQuestion = await mockGetNextQuestion(selectedMood, journalText, initialThread, 0);
      
      // Set up conversation state
      setConversationThread(initialThread);
      setCurrentQuestion(firstQuestion);
      setConversationStep(1);
      setConversationMode(true);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to start conversation. Please try again.');
    } finally {
      setIsUnpacking(false);
    }
  };

  // Handle sending answer to current question
  const handleSendAnswer = async () => {
    if (!currentAnswer.trim()) {
      Alert.alert('Empty Answer', 'Please write something before sending your response.');
      return;
    }

    setIsWaitingForResponse(true);

    try {
      // Add user's answer to conversation thread
      const updatedThread = [
        ...conversationThread,
        { role: 'assistant' as const, content: currentQuestion },
        { role: 'user' as const, content: currentAnswer }
      ];

      setConversationThread(updatedThread);

      // Check if we should end conversation (after 3 questions)
      if (conversationStep >= 3) {
        // Send entire conversation to backend
        await mockSendConversationToBackend(updatedThread);
        
        // End conversation and show completion
        setConversationMode(false);
        setCurrentStep('complete');
        
        setTimeout(() => {
          // Reset for next session
          setCurrentStep('mood');
          setSelectedMood('');
          setJournalText('');
          setShowUnpackIt(false);
          setUnpackSuggestions([]);
          setConversationThread([]);
          setCurrentQuestion('');
          setCurrentAnswer('');
          setConversationStep(0);
        }, 3000);
      } else {
        // Get next question
        const nextQuestion = await mockGetNextQuestion(
          selectedMood, 
          journalText, 
          updatedThread, 
          conversationStep
        );
        
        setCurrentQuestion(nextQuestion);
        setCurrentAnswer('');
        setConversationStep(prev => prev + 1);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send response. Please try again.');
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  // Handle ending conversation early
  const handleEndConversation = async () => {
    if (conversationThread.length === 0) return;

    setIsWaitingForResponse(true);

    try {
      // Send current conversation to backend
      await mockSendConversationToBackend(conversationThread);
      
      // End conversation
      setConversationMode(false);
      setCurrentStep('complete');
      
      setTimeout(() => {
        // Reset for next session
        setCurrentStep('mood');
        setSelectedMood('');
        setJournalText('');
        setShowUnpackIt(false);
        setUnpackSuggestions([]);
        setConversationThread([]);
        setCurrentQuestion('');
        setCurrentAnswer('');
        setConversationStep(0);
      }, 3000);
    } catch (error) {
      Alert.alert('Error', 'Failed to end conversation. Please try again.');
    } finally {
      setIsWaitingForResponse(false);
    }
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
            resilience: 0.7,
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
          {conversationMode ? 'Reflection Conversation' : 
           currentStep === 'mood' ? 'How are you feeling?' : 'Journal Entry'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Always visible soulseed at the top */}
        <View style={styles.topSoulseedContainer}>
          <SoulseedDisplay 
            level={2} 
            personality={{
              openness: 0.8,
              conscientiousness: 0.6,
              extroversion: 0.7,
              agreeableness: 0.9,
              resilience: 0.7,
            }}
            size="medium"
            selectedMood={selectedMood}
          />
        </View>

        {currentStep === 'mood' && (
          <View style={styles.moodSection}>
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
                style={[styles.textInput, conversationMode && styles.textInputDisabled]}
                multiline
                placeholder="I feel really good today. My school life is great and I have plenty of friends, but I still feel so lonely. It feels like everything might come crashing down on me one day and I can't do anything about it..."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={journalText}
                onChangeText={setJournalText}
                textAlignVertical="top"
                editable={!conversationMode}
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
                style={[styles.unpackButton, isUnpacking && styles.unpackButtonDisabled]}
                onPress={handleUnpackIt}
                disabled={isUnpacking}
              >
                {isUnpacking ? (
                  <ActivityIndicator size="small" color="#FFD700" />
                ) : (
                  <Sparkles size={20} color="#FFD700" />
                )}
                <Text style={styles.unpackButtonText}>
                  {isUnpacking ? 'Analyzing...' : 'Unpack It'}
                </Text>
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

        {/* Conversation Mode */}
        {conversationMode && (
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.conversationContainer}
          >
            <View style={styles.conversationSection}>
              {/* Conversation History */}
              <ScrollView style={styles.conversationHistory} showsVerticalScrollIndicator={false}>
                {conversationThread.map((message, index) => (
                  <View key={index} style={[
                    styles.messageContainer,
                    message.role === 'user' ? styles.userMessage : styles.assistantMessage
                  ]}>
                    <Text style={[
                      styles.messageText,
                      message.role === 'user' ? styles.userMessageText : styles.assistantMessageText
                    ]}>
                      {message.content}
                    </Text>
                  </View>
                ))}
                
                {/* Current Question */}
                {currentQuestion && (
                  <View style={[styles.messageContainer, styles.assistantMessage]}>
                    <Text style={styles.assistantMessageText}>
                      {currentQuestion}
                    </Text>
                  </View>
                )}
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
                    <Text style={styles.endConversationText}>End Conversation</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.sendAnswerButton, isWaitingForResponse && styles.sendAnswerButtonDisabled]}
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
          </KeyboardAvoidingView>
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
  topSoulseedContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
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
  textInputDisabled: {
    opacity: 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
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
  unpackButtonDisabled: {
    opacity: 0.6,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
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
  
  // Conversation styles
  conversationContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  conversationSection: {
    flex: 1,
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
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    alignSelf: 'flex-end',
    marginLeft: 50,
  },
  assistantMessage: {
    backgroundColor: 'rgba(139, 123, 216, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.3)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 216, 0.3)',
    padding: 16,
    marginBottom: 16,
  },
  answerInput: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    minHeight: 80,
    maxHeight: 120,
  },
  conversationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  endConversationButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  endConversationText: {
    color: '#8B8FA5',
    fontSize: 14,
    fontWeight: '500',
  },
  sendAnswerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B7BD8',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  sendAnswerButtonDisabled: {
    opacity: 0.6,
    backgroundColor: '#6B5B9A',
  },
  sendAnswerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});