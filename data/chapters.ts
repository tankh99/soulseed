export interface Chapter {
  id: string;
  title: string;
  status: 'in_progress' | 'completed';
  story: string;
  summary: string;
  insights: string[];
}
