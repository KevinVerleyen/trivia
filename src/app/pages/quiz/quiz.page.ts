import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCardTitle,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonItem,
  IonRadio,
  IonRadioGroup,
  IonLabel,
  IonList,
  IonProgressBar,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
  standalone: true,
  imports: [
    IonProgressBar,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonItem,
    IonRadioGroup,
    IonLabel,
    IonRadio,
    IonList,
    IonButton,
  ],
})
export class QuizPage implements OnInit {
  [x: string]: any;
  data: { [key: string]: any } = { questionIndex: 0 } ;
  nextQuestion() {
    this['questionIndex']++;
  }
   constructor() {}

  ngOnInit() {}
}
