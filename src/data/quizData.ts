import rawQuizData from '../../quiz/quiz-daten.json';

export interface QuizQuestion {
  q: string;
  o: string[];
  a: number;
  e: string;
}

export interface QuizDeck {
  id: string;
  titel: string;
  kapitel: string;
  karten: [string, string][];
  fragen: QuizQuestion[];
}

export const QUIZ_DECKS: QuizDeck[] = rawQuizData as unknown as QuizDeck[];
