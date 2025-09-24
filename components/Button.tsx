import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, style, textStyle, variant = 'primary', disabled = false }) => {
  const gradientColors = variant === 'primary' 
    ? [Colors.accent, Colors.accent] 
    : [Colors.secondary, Colors.secondary];
    
  const textColor = variant === 'primary' ? Colors.primary : Colors.primary;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]} disabled={disabled}>
        <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 16,
    overflow: 'hidden',
    elevation: 8,
    backgroundColor: Colors.secondary,
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
  },
});

export default Button;
