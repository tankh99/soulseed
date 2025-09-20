import { Stack } from 'expo-router';

export default function JournalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="mood" />
      <Stack.Screen name="entry" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
