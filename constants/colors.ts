// Soulseed App Color Palette
// Primary color scheme with complementary colors

export const Colors = {
  // Primary Colors
  primary: '#2A2F45',        // Dark blue-gray background
  secondary: '#B6A4E2',      // Light purple for buttons
  accent: '#E8C988',         // Warm gold accent
  
  // Complementary Colors
  background: '#2A2F45',     // Same as primary
  surface: '#3A3F55',        // Slightly lighter than primary
  surfaceLight: '#4A4F65',   // Even lighter surface
  card: '#3A3F55',           // Card backgrounds
  
  // Text Colors
  textPrimary: '#FFFFFF',    // White for primary text
  textSecondary: '#B6A4E2',  // Light purple for secondary text
  textMuted: '#8B8FA5',      // Muted gray for less important text
  textAccent: '#E8C988',     // Gold for accent text
  
  // Button Colors
  buttonPrimary: '#B6A4E2',  // Light purple
  buttonSecondary: '#E8C988', // Gold
  buttonDisabled: '#5A5F75', // Muted for disabled state
  
  // Status Colors
  success: '#4CAF50',        // Green for success states
  warning: '#FF9800',        // Orange for warnings
  error: '#F44336',          // Red for errors
  info: '#2196F3',           // Blue for info
  
  // Gradient Colors
  gradientPrimary: ['#2A2F45', '#4A3F75'],           // Primary gradient with saturated purple
  gradientSecondary: ['#B6A4E2', '#9B8FD1'],         // Secondary gradient
  gradientAccent: ['#E8C988', '#D4B85A'],            // Accent gradient
  gradientWarm: ['#E8C988', '#B6A4E2'],              // Warm gradient
  gradientCool: ['#2A2F45', '#6B4F8F'],              // Cool gradient with vibrant purple
  gradientPurple: ['#4A3F75', '#6B4F8F', '#8B5FBF'], // Rich purple gradient
  gradientBackground: ['#2A2F45', '#4A3F75', '#6B4F8F'], // Main background gradient
  
  // Special Effects
  shadow: 'rgba(42, 47, 69, 0.3)',                   // Shadow with primary color
  shadowLight: 'rgba(182, 164, 226, 0.2)',          // Light shadow
  overlay: 'rgba(42, 47, 69, 0.8)',                  // Overlay
  border: '#5A5F75',                                  // Border color
  borderLight: '#6A6F85',                             // Light border
  
  // Soulseed Specific Colors
  soulseedGlow: '#B6A4E2',                           // Soulseed glow effect
  soulseedSparkle: '#E8C988',                        // Sparkle effects
  soulseedAura: 'rgba(182, 164, 226, 0.3)',         // Soulseed aura
  
  // Interactive States
  hover: '#9B8FD1',                                  // Hover state
  active: '#D4B85A',                                 // Active state
  focus: '#E8C988',                                  // Focus ring
  
  // Transparent Variations
  transparent: 'transparent',
  primaryAlpha10: 'rgba(42, 47, 69, 0.1)',
  primaryAlpha20: 'rgba(42, 47, 69, 0.2)',
  primaryAlpha30: 'rgba(42, 47, 69, 0.3)',
  secondaryAlpha10: 'rgba(182, 164, 226, 0.1)',
  secondaryAlpha20: 'rgba(182, 164, 226, 0.2)',
  secondaryAlpha30: 'rgba(182, 164, 226, 0.3)',
  accentAlpha10: 'rgba(232, 201, 136, 0.1)',
  accentAlpha20: 'rgba(232, 201, 136, 0.2)',
  accentAlpha30: 'rgba(232, 201, 136, 0.3)',
} as const;

// Type for color keys
export type ColorKey = keyof typeof Colors;

// Helper function to get color with optional opacity
export const getColor = (colorKey: ColorKey, opacity?: number): string => {
  const color = Colors[colorKey];
  
  // Handle array colors (gradients) - return first color
  if (Array.isArray(color)) {
    return color[0] as string;
  }
  
  const colorString = color as string;
  if (opacity !== undefined && colorString.startsWith('#')) {
    const hex = colorString.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return colorString;
};
