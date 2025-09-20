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
import { ArrowLeft, Scroll } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  gradientColors = [Colors.primary, Colors.primary],
  rightElement
}: ScreenLayoutProps) {


  return (

    <LinearGradient colors={gradientColors} style={[styles.container]}>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[{ flex: 1 }]}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.container, contentStyle]}>

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
            {/* <ScrollView
              style={styles.content}
              contentContainerStyle={contentStyle}
            > */}
            {children}
            {/* </ScrollView> */}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 12
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
