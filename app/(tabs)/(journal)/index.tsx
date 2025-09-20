import React, { useEffect } from 'react';
import { router } from 'expo-router';

export default function JournalIndex() {
  useEffect(() => {
    // Redirect to mood selection page
    router.replace('/journal/mood' as any);
  }, []);

  return null;
}
