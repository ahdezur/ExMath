export type Role = 'admin' | 'presenter' | 'student';

export type University = 'uchile' | 'uandes' | 'udd' | 'usm' | 'puc';

export interface StudentUser {
  id: string;
  email: string;
  name: string;
  university: University;
  password?: string;
  verified: boolean;
  createdAt: string;
}

export interface OTPState {
  email: string;
  code: string;
  expiresAt: number; // timestamp in ms
  university: University;
  name: string;
  password?: string;
}

export type QuestionType = 
  | 'true_false' 
  | 'multiple_choice' 
  | 'checkboxes' 
  | 'fill_blanks' 
  | 'development';

export interface BaseQuestion {
  id: string;
  courseId: string;
  type: QuestionType;
  title: string;
  prompt: string; // Markdown/LaTeX allowed
  explanation?: string; // LaTeX explanation for post-answer
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  correctAnswer: boolean;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  options: {
    id: string;
    text: string; // Markdown/LaTeX allowed
  }[];
  correctOptionId: string;
}

export interface CheckboxesQuestion extends BaseQuestion {
  type: 'checkboxes';
  options: {
    id: string;
    text: string;
  }[];
  correctOptionIds: string[];
}

export interface FillBlanksQuestion extends BaseQuestion {
  type: 'fill_blanks';
  templateText: string; 
  blanks: {
    index: number;
    options: string[]; 
    correctValue: string; 
  }[];
}

export interface DevelopmentQuestion extends BaseQuestion {
  type: 'development';
  hints?: string[];
  solutionPauta: {
    steps: {
      title: string;
      content: string; 
    }[];
    finalAnswer: string; 
  };
}

export type Question = 
  | TrueFalseQuestion 
  | MultipleChoiceQuestion 
  | CheckboxesQuestion 
  | FillBlanksQuestion 
  | DevelopmentQuestion;

export type SlideLayout = 
  | 'title' 
  | 'content' 
  | 'theorem' 
  | 'split_question' 
  | 'full_exercise';

export interface Slide {
  id: string;
  courseId: string;
  title: string;
  subtitle?: string;
  content: string; // Markdown / LaTeX content
  layout: SlideLayout;
  questionId?: string; 
  codeExample?: string;
  notes?: string; 
}

export interface Course {
  id: string;
  code: string; // e.g. "MAT-101"
  name: string; // e.g. "Cálculo Diferencial e Integral"
  description: string;
  color: string; // Accent color hex or tailwind class
  slides: Slide[];
  targetUniversity?: University | 'all'; // Target university tag
}

export interface UserResponseState {
  [questionId: string]: {
    answered: boolean;
    isCorrect?: boolean;
    userAnswer?: any;
    showPauta?: boolean;
    notesText?: string;
  };
}
