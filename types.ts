export interface Block {
  id: string;
  type: 'paragraph' | 'h1' | 'h2' | 'h3' | 'bullet' | 'numbered' | 'quote' | 'code';
  content: string;
  styles: {
    bold?: [number, number][];
    italic?: [number, number][];
    underline?: [number, number][];
    strikethrough?: [number, number][];
  };
}

export interface Subtopic {
  name: string;
  completed: boolean;
  date?: string;
}

export interface Timeline {
  days: number;
  startDate: string;
}

export interface Plan {
  day: number;
  subtopics: string[];
}

export interface Topic {
  topic: string;
  subtopics: Subtopic[];
}

export interface Syllabus {
  subject: string;
  priority: 'high' | 'none';
  timeline?: Timeline;
  plan?: Plan[];
  topics: Topic[];
}

export interface Progress {
  completed: number;
  total: number;
  status: 'onTrack' | 'behind' | 'atRisk';
}

export interface Note {
  subject: string;
  topic: string;
  subtopic: string;
  content: string;
} 