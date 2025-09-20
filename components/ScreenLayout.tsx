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
import { useRouter } from 'expo-router';

interface ScreenLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showKeyboardAvoiding?: boolean;
  scrollable?: boolean;
  contentStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  gradientColors?: readonly [string, string, ...string[]];
  rightElement?: React.ReactNode;
  disableBottomSafeArea?: boolean;
}



export default function ScreenLayout({
  children,
  showBackButton = false,
  onBackPress,
  showKeyboardAvoiding = true,
  scrollable = true,
  contentStyle,
  headerStyle,
  gradientColors = [Colors.primary, Colors.primary],
  rightElement,
  disableBottomSafeArea = false
}: ScreenLayoutProps) {
  const router = useRouter();
  const defaultOnBackPress = () => {
    router.back()
  }

  return (

    <LinearGradient colors={gradientColors} style={[styles.container]}>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[{ flex: 1 }]}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <SafeAreaView 
          style={{ flex: 1 }}
          edges={disableBottomSafeArea ? ['top', 'left', 'right'] : ['top', 'left', 'right', 'bottom']}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.container, contentStyle]}>

            {/* Header */}
            {(showBackButton || rightElement) && (
              <View style={[styles.header, headerStyle]}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={onBackPress ? onBackPress : defaultOnBackPress}
                  disabled={!showBackButton}
                >
                  {showBackButton && <ArrowLeft size={24} color="#FFFFFF" />}
                </TouchableOpacity>

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
