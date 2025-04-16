export interface Syllabus {
  subject: string;
  topics: {
    topic: string;
    subtopics: string[];
  }[];
}

export interface Block {
  id: string;
  type: 'paragraph' | 'h1' | 'h2' | 'h3' | 'bullet' | 'numbered' | 'quote' | 'code';
  content: string;
  styles?: {
    bold?: [number, number][];
    italic?: [number, number][];
    underline?: [number, number][];
    strikethrough?: [number, number][];
  };
}

export interface Note {
  subject: string;
  topic: string;
  subtopic: string;
  content: string;
} 