
export interface JournalEntry {
  id: string;
  date: string; // ISO 8601 format
  mood: 'happy' | 'sad' | 'angry' | 'surprised' | 'neutral';
  content: string;
  chapterId: string;
}

export const mockJournalEntries: JournalEntry[] = [
  // Chapter 1: Overcoming a Challenge
  {
    id: 'j-1',
    date: '2025-09-20T10:00:00Z',
    mood: 'sad',
    content: "I just got back my math exam results and I'm so disappointed in myself. I tried so hard and didn't get the result I wanted.",
    chapterId: '1',
  },
  {
    id: 'j-2',
    date: '2025-09-21T18:30:00Z',
    mood: 'neutral',
    content: "Feeling a bit better today. I talked to my teacher and we came up with a plan to improve. It's not so bad when you have a path forward.",
    chapterId: '1',
  },
  {
    id: 'j-3',
    date: '2025-09-23T12:00:00Z',
    mood: 'happy',
    content: "The plan is working! I spent a few hours studying and things are starting to click. I'm actually feeling excited about the next test.",
    chapterId: '1',
  },

  // Chapter 2: A New Creative Spark
  {
    id: 'j-4',
    date: '2025-09-15T08:00:00Z',
    mood: 'happy',
    content: 'Started a new painting today. I feel so creative and alive when I have a brush in my hand.',
    chapterId: '2',
  },
  {
    id: 'j-5',
    date: '2025-09-16T20:00:00Z',
    mood: 'surprised',
    content: 'I tried a new technique with watercolors and it turned out unexpectedly beautiful. Sometimes mistakes lead to the best outcomes.',
    chapterId: '2',
  },
  {
    id: 'j-6',
    date: '2025-09-18T15:45:00Z',
    mood: 'neutral',
    content: 'Feeling stuck on the composition. I think I need to step away from it for a day and come back with fresh eyes.',
    chapterId: '2',
  },

  // Chapter 3: Navigating a Friendship
  {
    id: 'j-7',
    date: '2025-09-25T19:00:00Z',
    mood: 'angry',
    content: "Had a fight with my best friend. I'm so frustrated because I feel like they weren't listening to me at all.",
    chapterId: 'chapter-3',
  },
  {
    id: 'j-8',
    date: '2025-09-26T13:00:00Z',
    mood: 'sad',
    content: "Still feeling down about the argument. I miss talking to them, the silence is the hardest part.",
    chapterId: 'chapter-3',
  },
  {
    id: 'j-9',
    date: '2025-09-27T10:00:00Z',
    mood: 'neutral',
    content: "Decided to write down my feelings before talking to them again. I want to make sure I can express myself clearly without getting angry again.",
    chapterId: 'chapter-3',
  },
  {
    id: 'j-10',
    date: '2025-09-28T16:00:00Z',
    mood: 'happy',
    content: "We talked it out, and it went really well. We both apologized and understood each other's perspectives. So relieved and happy to have my friend back.",
    chapterId: 'chapter-3',
  },
];
