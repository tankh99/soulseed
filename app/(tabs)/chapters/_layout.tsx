import { Stack } from 'expo-router';

export default function ChaptersLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[chapterId]" options={{ headerShown: false }} />
    </Stack>
  );
}
