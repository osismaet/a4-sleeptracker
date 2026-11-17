import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel,
  IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonButton,
  IonPopover, IonDatetime, ToastController } from '@ionic/angular/standalone';
  import { addIcons } from 'ionicons';
import { moon, happy, chevronDown, chevronBack, chevronForward, trash } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonLabel,
    IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonButton,
    IonPopover, IonDatetime]
})
export class LogsPage implements OnInit {
  selectedDate:Date = LogsPage.startOfDay(new Date());
  pickerOpen = false;

  constructor(private sleepService:SleepService, private toastCtrl:ToastController) {
    addIcons({ moon, happy, chevronDown, chevronBack, chevronForward, trash });
  }
  
  private static startOfDay(d:Date):Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  
  ngOnInit() {
  }

}
