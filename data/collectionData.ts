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

// Create a pool of 52 fruits for the year to ensure variety
let fruitPool: Fruit[] = [];
for (let i = 0; i < Math.ceil(52 / fruits.length); i++) {
  fruitPool.push(...fruits);
}
fruitPool = fruitPool.slice(0, 52);

// Shuffle the fruit pool to randomize the order
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
shuffleArray(fruitPool);

let weekCounter = 0;
export const collectionData: MonthlyCollection[] = months.map((month, monthIndex) => {
  const weeksInMonth = monthIndex === 1 ? 4 : 4; // Simplified for dummy data
  const weeks: (FruitCollection | null)[] = Array.from({ length: weeksInMonth }, (_, weekIndex) => {
    const fruitFromPool = fruitPool[weekCounter];
    weekCounter++;
    if (!fruitFromPool) return null;

    // Randomly decide if a fruit is collected for dummy data, but ensure some are uncollected
    const isCollected = Math.random() > 0.4;

    return {
      fruit: {
        ...fruitFromPool,
        collected: isCollected,
      },
      weeklyHighlight: generateDummyHighlights(weekCounter),
    };
  });

  return {
    month,
    year: 2025,
    weeks,
  };
});
