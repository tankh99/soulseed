import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="intro" />
      <Stack.Screen name="personality-test" />
      <Stack.Screen name="personality-submit" />
      <Stack.Screen name="soulseed-result" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
