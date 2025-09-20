export interface Mood {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

export const MOODS: Mood[] = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: '#FFD700' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: '#4A90E2' },
  { id: 'angry', emoji: '😠', label: 'Angry', color: '#FF6B6B' },
  { id: 'surprised', emoji: '😲', label: 'Surprised', color: '#4ECDC4' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: '#95A5A6' },
];

export const getMoodData = (moodId: string): Mood | undefined => {
  return MOODS.find(mood => mood.id === moodId);
};
