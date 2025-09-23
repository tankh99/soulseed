import { fruits, Fruit } from './fruits';

export interface WeeklyHighlight {
  dateRange: string;
  highlight: string;
  lowlight: string;
}

export interface FruitCollection {
  fruit: Fruit;
  weeklyHighlight: WeeklyHighlight;
}

export interface MonthlyCollection {
  month: string;
  year: number;
  weeks: (FruitCollection | null)[];
}

const generateDummyHighlights = (weekNumber: number): WeeklyHighlight => ({
  dateRange: `Week ${weekNumber}`,
  highlight: `Aced my statistics exams in week ${weekNumber}.`,
  lowlight: `Broke up with my boyfriend in week ${weekNumber}.`,
});

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const collectionData: MonthlyCollection[] = months.map((month, monthIndex) => {
  const weeksInMonth = monthIndex === 1 ? 4 : 4; // Simplified for dummy data
  const weeks: (FruitCollection | null)[] = Array.from({ length: weeksInMonth }, (_, weekIndex) => {
    const fruitIndex = (monthIndex * 4 + weekIndex) % fruits.length;
    return {
      fruit: fruits[fruitIndex],
      weeklyHighlight: generateDummyHighlights(monthIndex * 4 + weekIndex + 1),
    };
  });

  return {
    month,
    year: 2025,
    weeks,
  };
});
