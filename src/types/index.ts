export type Role = 'admin' | 'presenter';

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
  // Example text: "Un espacio vector V sobre un cuerpo K es un conjunto {0} equipado con {1} operaciones."
  templateText: string; 
  blanks: {
    index: number;
    options: string[]; // List of options for this dropdown
    correctValue: string; // The correct string value
  }[];
}

export interface DevelopmentQuestion extends BaseQuestion {
  type: 'development';
  hints?: string[];
  solutionPauta: {
    steps: {
      title: string;
      content: string; // LaTeX formatted step explanation
    }[];
    finalAnswer: string; // LaTeX formatted final answer
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
  questionId?: string; // Optional embedded question from bank
  codeExample?: string;
  notes?: string; // Presenter private speaker notes
}

export interface Course {
  id: string;
  code: string; // e.g. "MAT-101"
  name: string; // e.g. "Cálculo Diferencial e Integral"
  description: string;
  color: string; // Accent color hex or tailwind class
  slides: Slide[];
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
