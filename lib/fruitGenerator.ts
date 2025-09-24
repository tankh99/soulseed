import { FruitSpeciesMapping, GeneratedFruit, GrowthStage, MoodEntry, MoodPlantStage, MoodType, WeeklyMoodSummary } from '@/data/moodFruits';

const MS_IN_DAY = 24 * 60 * 60 * 1000;

export function getRollingWeekSummary(entries: MoodEntry[], referenceDate: Date = new Date()): WeeklyMoodSummary {
  const endDate = referenceDate;
  const startDate = new Date(endDate.getTime() - 6 * MS_IN_DAY);

  const moodCounts: Partial<Record<MoodType, number>> = {};
  let totalEntries = 0;

  entries.forEach(entry => {
    const time = new Date(entry.timestamp).getTime();
    if (time >= startDate.getTime() && time <= endDate.getTime()) {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      totalEntries += 1;
    }
  });

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    moodCounts,
    totalEntries,
  };
}

function determineDominantMood(summary: WeeklyMoodSummary): MoodType {
  const entries = Object.entries(summary.moodCounts) as [MoodType, number][];
  if (entries.length === 0) return MoodType.MIXED;

  entries.sort((a, b) => b[1] - a[1]);
  const [topMood, topCount] = entries[0];

  const ties = entries.filter(([, count]) => count === topCount);
  if (ties.length > 1) return MoodType.MIXED;

  return topMood;
}

function calculateGrowthStage(totalEntries: number): GrowthStage {
  if (totalEntries >= 5) return 'ripe';
  if (totalEntries >= 3) return 'half_grown';
  return 'bud';
}

function adjustColor(baseColor: string | null, intensity: number): string {
  if (!baseColor) {
    // fallback gradient-like color for mixed mood fruits
    return 'linear-gradient(135deg, #A855F7, #38BDF8)';
  }

  const clampedIntensity = Math.max(0, Math.min(1, intensity));
  const base = baseColor.replace('#', '');
  let r = parseInt(base.substring(0, 2), 16);
  let g = parseInt(base.substring(2, 4), 16);
  let b = parseInt(base.substring(4, 6), 16);

  const factor = 0.8 + clampedIntensity * 0.4;
  r = Math.min(255, Math.round(r * factor));
  g = Math.min(255, Math.round(g * factor));
  b = Math.min(255, Math.round(b * factor));

  return `rgb(${r}, ${g}, ${b})`;
}

export function generateFruitFromSummary(summary: WeeklyMoodSummary): GeneratedFruit | null {
  if (summary.totalEntries === 0) return null;

  const dominantMood = determineDominantMood(summary);
  const intensity = summary.totalEntries > 0 ? (summary.moodCounts[dominantMood] || 0) / summary.totalEntries : 0;
  const growthStage = calculateGrowthStage(summary.totalEntries);
  const species = FruitSpeciesMapping[dominantMood];

  return {
    speciesName: species.name,
    displayColor: adjustColor(species.baseColor, intensity),
    growthStage,
    dominantMood,
    intensity,
    image: species.image,
    summary,
  };
}

export function derivePlantStage(summary: WeeklyMoodSummary): MoodPlantStage {
  if (summary.totalEntries >= 5) return 'bloom';
  if (summary.totalEntries >= 1) return 'sprout';
  return 'seed';
}
