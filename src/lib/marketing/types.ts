export interface GoalTemplate {
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  category: string;
  durationWeeks: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  milestones: Array<{ title: string; description: string; weekNumber: number }>;
  suggestedHabits: Array<{ name: string; frequency: string; why: string }>;
  firstWeekTasks: Array<{ title: string; day: number; priority: 'low' | 'medium' | 'high' }>;
  faq: Array<{ question: string; answer: string }>;
  relatedTemplates: string[];
}

export interface ComparisonPage {
  slug: string;
  competitor: string;
  summary: string;
  bestFor: string;
  categories: Array<{
    name: string;
    resurgo: string;
    competitor: string;
  }>;
  pricing: {
    resurgo: string;
    competitor: string;
  };
  faq: Array<{ question: string; answer: string }>;
}

export interface UseCasePage {
  slug: string;
  persona: string;
  summary: string;
  pains: string[];
  solutions: string[];
  sampleSetup: string[];
  testimonial: { quote: string; role: string };
  related: string[];
}

export interface LearnTerm {
  slug: string;
  term: string;
  definition: string;
  whyItMatters: string;
  howResurgoHelps: string[];
  relatedTerms: string[];
}

export interface ToolPage {
  slug: string;
  title: string;
  summary: string;
  promptLabel: string;
  outputLabel: string;
  freeLimit: number;
  cta: string;
}
