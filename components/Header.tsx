import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightContent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBackButton = true, 
  onBackPress,
  rightContent 
}) => {
  const handleBack = onBackPress || (() => router.back());

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.secondary} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.titleContainer}>
        {title && <Text style={styles.title}>{title}</Text>}
      </View>
      <View style={styles.rightContainer}>
        {rightContent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    width: '100%',
  },
  leftContainer: {
    flex: 0.5,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 2,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 0.5,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default Header;
