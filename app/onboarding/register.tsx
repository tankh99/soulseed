import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/colors';
import ScreenLayout from '@/components/ScreenLayout';
import Button from '@/components/Button';
// import DateTimePicker from '@react-native-community/datetimepicker';

interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  birthday: Date;
  schoolYear: string;
  ethnicity: string;
  gender: string;
}

const schoolYearOptions = [
  'Secondary 1',
  'Secondary 2', 
  'Secondary 3',
  'Secondary 4',
  'Secondary 5',
  'JC Year 1',
  'JC Year 2',
  'Poly Year 1',
  'Poly Year 2',
  'Poly Year 3',
  'ITE Year 1',
  'ITE Year 2',
  'ITE Year 3',
];

const ethnicityOptions = [
  'Chinese',
  'Malay',
  'Indian',
  'Eurasian',
  'Other',
];

const genderOptions = [
  'Male',
  'Female',
  'Non-binary',
  'Prefer not to say',
];

export default function RegisterPage() {
  const { soulseedName, soulseedStatement, sessionId } = useLocalSearchParams();
  
  // Mock data for development - remove in production
  const [formData, setFormData] = useState<RegistrationData>({
    email: 'testuser@soulseed.com',
    password: 'password123',
    confirmPassword: 'password123',
    birthday: new Date(2005, 5, 15), // June 15, 2005 (18 years old)
    schoolYear: 'JC Year 2',
    ethnicity: 'Chinese',
    gender: 'Female',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSchoolYearPicker, setShowSchoolYearPicker] = useState(false);
  const [showEthnicityPicker, setShowEthnicityPicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: keyof RegistrationData, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return false;
    }

    if (!formData.schoolYear) {
      Alert.alert('Missing Information', 'Please select your school year.');
      return false;
    }

    if (!formData.ethnicity) {
      Alert.alert('Missing Information', 'Please select your ethnicity.');
      return false;
    }

    if (!formData.gender) {
      Alert.alert('Missing Information', 'Please select your gender.');
      return false;
    }

    // Check age (must be at least 13)
    const age = new Date().getFullYear() - formData.birthday.getFullYear();
    if (age < 13) {
      Alert.alert('Age Requirement', 'You must be at least 13 years old to register.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Mock API call - simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful registration
      console.log('Mock registration data:', {
        email: formData.email,
        password: formData.password,
        birthday: formData.birthday.toISOString(),
        schoolYear: formData.schoolYear,
        ethnicity: formData.ethnicity,
        gender: formData.gender,
        soulseedName: soulseedName,
        soulseedStatement: soulseedStatement,
        sessionId: sessionId,
      });

      // Navigate to main app (homepage)
      router.replace('/(tabs)');
      
    } catch (err) {
      console.error('Registration error:', err);
      Alert.alert(
        'Registration Failed',
        'There was an error creating your account. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScreenLayout
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>Complete your profile to start your journey with {soulseedName}</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              placeholder="Create a password"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData('confirmPassword', text)}
              placeholder="Confirm your password"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Birthday */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Birthday *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.pickerButtonText}>
                {formatDate(formData.birthday)}
              </Text>
              <Text style={styles.pickerHint}>Tap to change</Text>
            </TouchableOpacity>
          </View>

          {/* School Year */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>School Year *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowSchoolYearPicker(true)}
            >
              <Text style={styles.pickerButtonText}>
                {formData.schoolYear || 'Select your school year'}
              </Text>
              <Text style={styles.pickerHint}>Tap to select</Text>
            </TouchableOpacity>
          </View>

          {/* Ethnicity */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Ethnicity *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowEthnicityPicker(true)}
            >
              <Text style={styles.pickerButtonText}>
                {formData.ethnicity || 'Select your ethnicity'}
              </Text>
              <Text style={styles.pickerHint}>Tap to select</Text>
            </TouchableOpacity>
          </View>

          {/* Gender */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Gender *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowGenderPicker(true)}
            >
              <Text style={styles.pickerButtonText}>
                {formData.gender || 'Select your gender'}
              </Text>
              <Text style={styles.pickerHint}>Tap to select</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
          <Button
            title={isSubmitting ? 'Creating Account...' : 'Create Account'}
            onPress={handleSubmit}
            style={{marginBottom: 20}}
            textStyle={{textAlign: "center"}}
            disabled={isSubmitting}
          />

        {/* Terms */}
        <Text style={styles.termsText}>
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>

      {/* Date Picker Modal - Simplified for now */}
      {showDatePicker && (
        <View style={styles.pickerModal}>
          <View style={styles.pickerContent}>
            <Text style={styles.pickerTitle}>Select Your Birthday</Text>
            <TextInput
              style={styles.textInput}
              placeholder="MM/DD/YYYY"
              value={formData.birthday.toLocaleDateString()}
              onChangeText={(text) => {
                // Simple date parsing - in a real app, you'd want better validation
                const date = new Date(text);
                if (!isNaN(date.getTime())) {
                  updateFormData('birthday', date);
                }
              }}
            />
            <TouchableOpacity
              style={styles.pickerCancel}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.pickerCancelText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* School Year Picker Modal */}
      {showSchoolYearPicker && (
        <View style={styles.pickerModal}>
          <View style={styles.pickerContent}>
            <Text style={styles.pickerTitle}>Select School Year</Text>
            <ScrollView style={styles.pickerOptions}>
              {schoolYearOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.pickerOption}
                  onPress={() => {
                    updateFormData('schoolYear', option);
                    setShowSchoolYearPicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.pickerCancel}
              onPress={() => setShowSchoolYearPicker(false)}
            >
              <Text style={styles.pickerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Ethnicity Picker Modal */}
      {showEthnicityPicker && (
        <View style={styles.pickerModal}>
          <View style={styles.pickerContent}>
            <Text style={styles.pickerTitle}>Select Ethnicity</Text>
            <ScrollView style={styles.pickerOptions}>
              {ethnicityOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.pickerOption}
                  onPress={() => {
                    updateFormData('ethnicity', option);
                    setShowEthnicityPicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.pickerCancel}
              onPress={() => setShowEthnicityPicker(false)}
            >
              <Text style={styles.pickerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Gender Picker Modal */}
      {showGenderPicker && (
        <View style={styles.pickerModal}>
          <View style={styles.pickerContent}>
            <Text style={styles.pickerTitle}>Select Gender</Text>
            <ScrollView style={styles.pickerOptions}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.pickerOption}
                  onPress={() => {
                    updateFormData('gender', option);
                    setShowGenderPicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.pickerCancel}
              onPress={() => setShowGenderPicker(false)}
            >
              <Text style={styles.pickerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 24,
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
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  pickerButton: {
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
  pickerButtonText: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  pickerHint: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
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
  termsText: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  pickerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pickerContent: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    maxHeight: '70%',
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerOptions: {
    maxHeight: 300,
  },
  pickerOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerOptionText: {
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  pickerCancel: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    alignItems: 'center',
  },
  pickerCancelText: {
    fontSize: 16,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
