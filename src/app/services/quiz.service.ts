import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITriviaQuestion } from './trivia-api.service';
import { DatabaseService } from './database.service';

export interface IAnswers {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  correct: boolean;
}

export interface IQuiz {
  question: ITriviaQuestion[];
  currentQuestionIndex: number;
  score: number;
  category: string;
  difficulty: string;
  totalQuestions: number;
  answers: IAnswers[];
  gameOver: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  // Création de l'etat initial de la partie, état que l'on va réinitialiser à chaque partie
  private initialState: IQuiz = {
    question: [],
    currentQuestionIndex: 0,
    score: 0,
    category: '',
    difficulty: '',
    totalQuestions: 0,
    answers: [],
    gameOver: false,
  };

  // Création d'un BehaviorSubject pour gérer l'etat de notre partie de maniere dynamique
  //Permet aux composants qui utilisent ce service de s'abonner aux différents changemeny
  private gameState = new BehaviorSubject<IQuiz>(this.initialState);
  constructor(private dbService: DatabaseService) {}

  // Méthode qui return un Observable de l'état du quiz
  getGameState() {
    return this.gameState.asObservable();
  }

  initGame(question: ITriviaQuestion[], category: string, difficulty: string) {
    this.gameState.next({
      question,
      currentQuestionIndex: 0,
      score: 0,
      category,
      difficulty,
      totalQuestions: question.length,
      answers: [],
      gameOver: false,
    });
  }
}
