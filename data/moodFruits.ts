export enum MoodType {
  JOY = 'joy',
  CALM = 'calm',
  STRESS = 'stress',
  ANGER = 'anger',
  MIXED = 'mixed',
  SAD = 'sad',
}

export type MoodPlantStage = 'seed' | 'sprout' | 'bloom';

export interface FruitSpecies {
  name: string;
  baseColor: string | null;
  shape: 'round_soft' | 'round_smooth' | 'faceted' | 'pointed' | 'cluster' | 'droplet';
  ornament: 'sparkle' | 'soft_gloss' | 'textured_peel' | 'flare' | 'multi_gradient' | 'dew';
  image: any;
}

export const FruitSpeciesMapping: Record<MoodType, FruitSpecies> = {
  [MoodType.JOY]: {
    name: 'Sunstone Peach',
    baseColor: '#FF8FA6',
    shape: 'round_soft',
    ornament: 'sparkle',
    image: require('../assets/images/fruits/fruits_orange_full.png'),
  },
  [MoodType.CALM]: {
    name: 'Moonberry',
    baseColor: '#8FBFE0',
    shape: 'round_smooth',
    ornament: 'soft_gloss',
    image: require('../assets/images/fruits/fruits_orange_full.png'),
  },
  [MoodType.STRESS]: {
    name: 'Citrine Citrus',
    baseColor: '#FFD24C',
    shape: 'faceted',
    ornament: 'textured_peel',
    image: require('../assets/images/fruits/fruits_orange_full.png'),
  },
  [MoodType.ANGER]: {
    name: 'Blazefruit',
    baseColor: '#FF6A3A',
    shape: 'pointed',
    ornament: 'flare',
    image: require('../assets/images/fruits/fruits_orange_full.png'),
  },
  [MoodType.MIXED]: {
    name: 'Prism Cluster',
    baseColor: null,
    shape: 'cluster',
    ornament: 'multi_gradient',
    image: require('../assets/images/fruits/fruits_orange_full.png'),
  },
  [MoodType.SAD]: {
    name: 'Dewdrop Melon',
    baseColor: '#6A78FF',
    shape: 'droplet',
    ornament: 'dew',
    image: require('../assets/images/fruits/fruits_orange_full.png'),
  },
};

export interface MoodEntry {
  id: string;
  timestamp: string; // ISO string
  mood: MoodType;
}

export interface WeeklyMoodSummary {
  startDate: string;
  endDate: string;
  moodCounts: Partial<Record<MoodType, number>>;
  totalEntries: number;
}

export type GrowthStage = 'bud' | 'half_grown' | 'ripe';

export interface GeneratedFruit {
  speciesName: string;
  displayColor: string;
  growthStage: GrowthStage;
  dominantMood: MoodType;
  intensity: number; // 0-1
  image: any;
  summary: WeeklyMoodSummary;
}

export interface HarvestedFruit {
  id: string;
  harvestedAt: string;
  fruit: GeneratedFruit;
}
