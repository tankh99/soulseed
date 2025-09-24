import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

// Big Five personality test questions
const questions = [
  { id: 1, text: "I am the life of the party", trait: "extroversion", reversed: false },
  { id: 2, text: "I sympathize with others' feelings", trait: "agreeableness", reversed: false },
  { id: 3, text: "I get chores done right away", trait: "conscientiousness", reversed: false },
  { id: 4, text: "I have frequent mood swings", trait: "neuroticism", reversed: true },
  { id: 5, text: "I have a vivid imagination", trait: "openness", reversed: false },
  // { id: 6, text: "I don't talk a lot", trait: "extroversion", reversed: true },
  // { id: 7, text: "I am not interested in other people's problems", trait: "agreeableness", reversed: true },
  // { id: 8, text: "I often forget to put things back in their proper place", trait: "conscientiousness", reversed: true },
  // { id: 9, text: "I am relaxed most of the time", trait: "neuroticism", reversed: false },
  // { id: 10, text: "I am not interested in abstract ideas", trait: "openness", reversed: true },
  // { id: 11, text: "I talk to a lot of different people at parties", trait: "extroversion", reversed: false },
  // { id: 12, text: "I feel others' emotions", trait: "agreeableness", reversed: false },
  // { id: 13, text: "I like order", trait: "conscientiousness", reversed: false },
  // { id: 14, text: "I get upset easily", trait: "neuroticism", reversed: true },
  // { id: 15, text: "I have difficulty understanding abstract ideas", trait: "openness", reversed: true },
  // { id: 16, text: "I keep in the background", trait: "extroversion", reversed: true },
  // { id: 17, text: "I am not really interested in others", trait: "agreeableness", reversed: true },
  // { id: 18, text: "I make a mess of things", trait: "conscientiousness", reversed: true },
  // { id: 19, text: "I seldom feel blue", trait: "neuroticism", reversed: false },
  // { id: 20, text: "I do not have a good imagination", trait: "openness", reversed: true },
];

const scaleOptions = [
  { value: 1, label: "Very inaccurate" },
  { value: 2, label: "Moderately inaccurate" },
  { value: 3, label: "Neither inaccurate nor accurate" },
  { value: 4, label: "Moderately accurate" },
  { value: 5, label: "Very accurate" },
];

export default function PersonalityTestPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAnswer = (questionId: number, value: number) => {
    if (isTransitioning) return; // Prevent answering during transition
    
    setIsTransitioning(true);
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      setCurrentQuestion(prev => {
        if (prev < questions.length - 1) {
          return prev + 1;
        }
        return prev;
      });
      setIsTransitioning(false); // End transition
    }, 300);
  };

  const handleSubmit = () => {
    // Calculate Big Five scores
    const scores = {
      openness: 0,
      conscientiousness: 0,
      extroversion: 0,
      agreeableness: 0,
      neuroticism: 0,
    };

    // Count questions per trait and calculate averages
    const traitCounts = {
      openness: 0,
      conscientiousness: 0,
      extroversion: 0,
      agreeableness: 0,
      neuroticism: 0,
    };

    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        // Handle reversed items (invert the score: 6 - answer)
        const adjustedAnswer = question.reversed ? (6 - answer) : answer;
        scores[question.trait as keyof typeof scores] += adjustedAnswer;
        traitCounts[question.trait as keyof typeof traitCounts]++;
      }
    });

    // Calculate averages and normalize to 0-1
    Object.keys(scores).forEach(trait => {
      if (traitCounts[trait as keyof typeof traitCounts] > 0) {
        scores[trait as keyof typeof scores] = 
          scores[trait as keyof typeof scores] / traitCounts[trait as keyof typeof traitCounts] / 5; // Normalize to 0-1
      }
    });

    // Navigate to submit page with results
    router.push({
      pathname: '/onboarding/personality-submit',
      params: { scores: JSON.stringify(scores) }
    });
  };

  const isComplete = Object.keys(answers).length === questions.length;

  return (
    <LinearGradient
      colors={Colors.gradientBackground}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Progress Header */}
          <View style={styles.header}>
            <Text style={styles.progressText}>
              Question {currentQuestion + 1} of {questions.length}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
                ]} 
              />
            </View>
          </View>

          {/* Instructions */}
          {currentQuestion === 0 && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>
                Please use the rating scale below to describe how accurately each statement describes you.
                Describe yourself as you generally are now, not as you wish to be in the future.
              </Text>
            </View>
          )}

          {/* Current Question */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {questions[currentQuestion]?.text || ''}
            </Text>

            {/* Scale Options */}
            <View style={styles.scaleContainer}>
              {scaleOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.scaleOption,
                    answers[questions[currentQuestion]?.id] === option.value && styles.scaleOptionSelected
                  ]}
                  onPress={() => handleAnswer(questions[currentQuestion]?.id || 0, option.value)}
                  disabled={isTransitioning} // Disable during transition
                >
                  <Text style={[
                    styles.scaleValue,
                    answers[questions[currentQuestion]?.id] === option.value && styles.scaleValueSelected
                  ]}>
                    {option.value}
                  </Text>
                  <Text style={[
                    styles.scaleLabel,
                    answers[questions[currentQuestion]?.id] === option.value && styles.scaleLabelSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Navigation */}
            <View style={styles.navigationContainer}>
              {currentQuestion > 0 && (
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={() => setCurrentQuestion(prev => prev - 1)}
                >
                  <Text style={styles.navButtonText}>Previous</Text>
                </TouchableOpacity>
              )}
              
              {currentQuestion < questions.length - 1 && (
                <TouchableOpacity
                  style={[styles.navButton, styles.navButtonPrimary]}
                  onPress={() => setCurrentQuestion(prev => prev + 1)}
                  disabled={!answers[questions[currentQuestion]?.id]}
                >
                  <Text style={[styles.navButtonText, styles.navButtonTextPrimary]}>Next</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Submit Button */}
            {isComplete && (
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <LinearGradient
                  colors={['#8B7BD8', '#6366F1']}
                  style={styles.submitGradient}
                >
                  <Text style={styles.submitButtonText}>Submit Assessment</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
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
  },
  header: {
    marginBottom: 40,
  },
  progressText: {
    fontSize: 16,
    color: Colors.textAccent,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.primaryAlpha20,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  instructionsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  instructionsText: {
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
  },
  questionContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 30,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 30,
  },
  scaleContainer: {
    marginBottom: 40,
  },
  scaleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  scaleOptionSelected: {
    backgroundColor: Colors.secondaryAlpha20,
    borderColor: Colors.secondary,
  },
  scaleValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.secondary,
    width: 30,
    textAlign: 'center',
  },
  scaleValueSelected: {
    color: Colors.textAccent,
  },
  scaleLabel: {
    fontSize: 16,
    color: Colors.textMuted,
    marginLeft: 16,
    flex: 1,
  },
  scaleLabelSelected: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  navButtonPrimary: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  navButtonText: {
    fontSize: 16,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  navButtonTextPrimary: {
    color: Colors.textPrimary,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
});
