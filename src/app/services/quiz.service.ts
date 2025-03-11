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

export interface IResult {
  category: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
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
      ...this.initialState,
      question,
      currentQuestionIndex: 0,
      score: 0,
      category,
      difficulty,
      totalQuestions: question.length,
      // answers: [],
      // gameOver: false,
    });
  }

  submitAnswer(answer: string) {
    // Récuperation de l'etat de la partie
    const currentState = this.gameState.value;
    // Récupération de la question
    const currentQuestion =
      currentState.question[currentState.currentQuestionIndex];
    // On verifie si la réponse de l'utilisateur est correcte
    const isCorrect = answer === currentQuestion.correct_answer;

    // Calcul du score actuel
    const newScore = isCorrect ? currentState.score + 1 : currentState.score;

    // Ajout de la réponse de l'utilisateur dans le tableau d'historique des réponse
    const answers = [
      ...currentState.answers,
      {
        question: currentQuestion.question,
        userAnswer: answer,
        correctAnswer: currentQuestion.correct_answer,
        correct: isCorrect,
      },
    ];

    // On vérifie si l'utilisateur est sur la dernier question
    const isLastQuestion =
      currentState.currentQuestionIndex === currentState.question.length - 1;

    // Mise à jour de l'état de la partie
    this.gameState.next({
      ...currentState,
      currentQuestionIndex: isLastQuestion
        ? currentState.currentQuestionIndex
        : currentState.currentQuestionIndex + 1,
      score: newScore,
      answers,
      gameOver: isLastQuestion,
    });

    // Si la partie est terminée, on sauvegarde les information dans l'historique de la db
    if (isLastQuestion) {
      this.saveGameResult({
        category: currentState.category,
        difficulty: currentState.difficulty,
        score: newScore,
        totalQuestions: currentState.totalQuestions,
      });
    }

    return {
      isCorrect,
      isLastQuestion,
      correct_answer: currentQuestion.correct_answer,
    };
  }

  private async saveGameResult(result: IResult) {
    await this.dbService.addToHistory({
      ...result,
      total_question: result.totalQuestions,
    });
  }

  reset() {
    this.gameState.next(this.initialState);
  }
}
