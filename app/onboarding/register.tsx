import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
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
  const { soulseedName, soulseedTagline, sessionId } = useLocalSearchParams();
  
  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    password: '',
    confirmPassword: '',
    birthday: new Date(2005, 0, 1), // Default to 18 years old
    schoolYear: '',
    ethnicity: '',
    gender: '',
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
        soulseedTagline: soulseedTagline,
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
    <LinearGradient
      colors={['#F8F9FF', '#E8EDFF', '#D6E3FF']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <LinearGradient
              colors={['#8B7BD8', '#6366F1']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.termsText}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </ScrollView>

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
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A0B3D',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
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
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pickerButton: {
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
  pickerButtonText: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  pickerHint: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#8B7BD8',
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
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
  pickerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pickerContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    maxHeight: '70%',
    width: '100%',
    maxWidth: 400,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
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
    borderBottomColor: '#F3F4F6',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  pickerCancel: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  pickerCancelText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
});
