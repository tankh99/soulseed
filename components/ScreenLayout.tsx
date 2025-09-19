import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  TextStyle
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '../constants/colors';

interface ScreenLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showKeyboardAvoiding?: boolean;
  scrollable?: boolean;
  contentStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  gradientColors?: readonly [string, string, ...string[]];
  rightElement?: React.ReactNode;
}

export default function ScreenLayout({
  children,
  title,
  showBackButton = false,
  onBackPress,
  showKeyboardAvoiding = true,
  scrollable = true,
  contentStyle,
  headerStyle,
  titleStyle,
  gradientColors = ['#2D1B69', '#1A0B3D'],
  rightElement
}: ScreenLayoutProps) {
  const ContentWrapper = scrollable ? ScrollView : View;
  const contentProps = scrollable ? { showsVerticalScrollIndicator: false } : {};

  const content = (
    <>
      {/* Header */}
      {(title || showBackButton || rightElement) && (
        <View style={[styles.header, headerStyle]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBackPress}
            disabled={!showBackButton}
          >
            {showBackButton && <ArrowLeft size={24} color="#FFFFFF" />}
          </TouchableOpacity>
          
          {title && (
            <Text style={[styles.headerTitle, titleStyle]}>
              {title}
            </Text>
          )}
          
          <View style={styles.headerRight}>
            {rightElement || <View style={styles.placeholder} />}
          </View>
        </View>
      )}

      {/* Content */}
      <ContentWrapper style={[styles.content, contentStyle]} {...contentProps}>
        {children}
      </ContentWrapper>
    </>
  );

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView style={{flex: 1}}>
            {content}
          </ScrollView>
        </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    minHeight: 100,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    flex: 1,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
});
