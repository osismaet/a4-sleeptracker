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
  private static dateKey(d:Date):string {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + mm + '-' + dd;
  }

  private static sameDay(a:Date, b:Date):boolean {
    return LogsPage.dateKey(a) === LogsPage.dateKey(b);
  }

  get selectedKey():string { return LogsPage.dateKey(this.selectedDate); }
  get todayKey():string { return LogsPage.dateKey(new Date()); }

  get isToday():boolean {
    return LogsPage.sameDay(this.selectedDate, new Date());
  }

  get dayLabel():string {
    if (this.isToday) return 'Today';
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (LogsPage.sameDay(this.selectedDate, yesterday)) return 'Yesterday';
    return this.selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  changeDay(offset:number) {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() + offset);
    if (d.getTime() <= new Date().getTime()) {
      this.selectedDate = LogsPage.startOfDay(d);
    }
  }

  onDatePicked(event:any) {
    const value = String(event.detail.value);              
    const [y, m, d] = value.substring(0, 10).split('-').map(Number);
    this.selectedDate = new Date(y, m - 1, d);
    this.pickerOpen = false;
  }

  private logDay(log:SleepData):Date {
    return log instanceof OvernightSleepData ? log.sleepEnd : log.loggedAt;
  }

  get logsForDay():SleepData[] {
    return SleepService.AllSleepData.filter(log => LogsPage.sameDay(this.logDay(log), this.selectedDate));
  }

  isOvernight(log:SleepData):boolean {
    return log instanceof OvernightSleepData;
  }

  title(log:SleepData):string {
    if (log instanceof OvernightSleepData) return 'Sleep: ' + log.durationString();
    if (log instanceof StanfordSleepinessData) return 'Sleepiness: ' + log.loggedValue;
    return log.summaryString();
  }

  rightText(log:SleepData):string {
    if (log instanceof OvernightSleepData) return log.timeRangeString();
    if (log instanceof StanfordSleepinessData) return log.timeString();
    return '';
  }

  note(log:SleepData):string {
    return log instanceof OvernightSleepData ? log.note : '';
  }

  async deleteLog(log:SleepData) {
    await this.sleepService.deleteLog(log);
    const toast = await this.toastCtrl.create({
      message: 'Log deleted',
      duration: 5000,
      position: 'top',
      buttons: [{ text: 'Undo', handler: () => this.undoDelete(log) }]
    });
    await toast.present();
  }

  private async undoDelete(log:SleepData) {
    if (log instanceof OvernightSleepData) {
      await this.sleepService.logOvernightData(log);
    } else if (log instanceof StanfordSleepinessData) {
      await this.sleepService.logSleepinessData(log);
    }
  }
  ngOnInit() {
  }

}
