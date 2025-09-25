import { ImageSourcePropType } from "react-native";

export interface Mood {
  id: string;
  emoji: string;
  label: string;
  color: string;
  image: ImageSourcePropType;
}

export const MOODS: Mood[] = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: '#FFD700', image: require('../assets/images/moods/happy.png') },
  { id: 'sad', emoji: '😢', label: 'Sad', color: '#4A90E2', image: require('../assets/images/moods/sad.png') },
  { id: 'angry', emoji: '😠', label: 'Anger', color: '#FF6B6B', image: require('../assets/images/moods/anger.png') },
  { id: 'surprised', emoji: '😲', label: 'Surprise', color: '#4ECDC4', image: require('../assets/images/moods/surprise.png') },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: '#95A5A6', image: require('../assets/images/moods/neutral.png') },
];

export const getMoodData = (moodId: string): Mood | undefined => {
  return MOODS.find(mood => mood.id === moodId);
};
