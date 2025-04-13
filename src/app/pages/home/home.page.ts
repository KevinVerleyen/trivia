import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonRange,
  IonButton,
  IonNote,
} from '@ionic/angular/standalone';
import { TriviaApiService } from 'src/app/services/trivia-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonNote,
    IonItem,
    IonList,
    IonCard,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonRange,
    IonButton,
  ],
})
export class HomePage implements OnInit {
  categories: { id: number; name: string }[] = []; // Structure des catégories
numberOfQuestions: any;
  constructor(private triviaService: TriviaApiService) {}

  ngOnInit() {
    this.triviaService
      .getCategories()
      .subscribe((response: { trivia_categories: any }) => {
        this.categories = response.trivia_categories; // Mise à jour des catégories
      });
  }
}
