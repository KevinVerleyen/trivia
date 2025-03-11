import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { response } from 'express';

export interface ITriviaQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
}

export interface ITriviaResponse {
  response_code: number;
  results: ITriviaQuestion[];
}

@Injectable({
  providedIn: 'root',
})
export class TriviaApiService {
  private URL: string = 'https://opentdb.com/api.php';

  constructor(private http: HttpClient) {}

  // Méthode de récupération des information depuis l'api de opentdb
  getQuestions(
    amount: number,
    category?: number,
    difficulty?: string
  ): Observable<ITriviaQuestion[]> {
    // Construction de l'url complet
    let url = `${this.URL}?amount=${amount}`;

    if (category) {
      url += `&category=${category}`;
    }

    if (difficulty) {
      url += `&difficulty=${difficulty}`;
    }

    return this.http.get<ITriviaResponse>(url).pipe(
      map((response) => {
        return response.results.map((question) => {
          const allAnswers = [
            ...question.incorrect_answers,
            question.correct_answer,
          ];
          //Mélange des réponse (correctes et incorrectes)
          this.shuffleArray(allAnswers);

          return {
            ...question,
            all_answers: allAnswers,
            question: this.decodeHtml(question.question),
            correct_answer: this.decodeHtml(question.correct_answer),
            incorrect_answers: question.incorrect_answers.map((el) =>
              this.decodeHtml(el)
            ),
          };
        });
      })
    );
  }

  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const rIndex = Math.floor(Math.random() * (i + 1));

      [array[i], array[rIndex]] = [array[rIndex], array[i]];
    }
  }

  private decodeHtml(html: string) {
    const texte = document.createElement('textarea');
    texte.innerHTML = html;
    return texte.value;
  }

  getCategories() {
    return this.http.get<{ trivia_categories: { id: number; name: string }[] }>(
      'https://opentdb.com/api_category.php'
    );
  }
}
