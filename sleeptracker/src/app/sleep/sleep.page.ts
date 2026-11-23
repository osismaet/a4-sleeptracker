import { Component } from '@angular/core';
import {
  IonContent, IonButton, IonIcon, IonDatetime, IonDatetimeButton, IonModal, IonTextarea,
  NavController, ToastController, AlertController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';

@Component({
  selector: 'app-sleep',
  templateUrl: './sleep.page.html',
  styleUrls: ['./sleep.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonDatetime, IonDatetimeButton, IonModal, IonTextarea, IonIcon]
})
export class SleepPage {
  bedIso = '';
  wakeIso = '';
  note = '';

  constructor(
    private sleepService:SleepService,
    private router:Router,
    private navCtrl:NavController,
    private toastCtrl:ToastController,
    private alertCtrl:AlertController
  ) { 
    this.resetForm();
  }

  ionViewWillEnter() {
    if (SleepService.ActiveSleepStart) {
      this.navCtrl.navigateRoot('/session');
    }
  }

  async startSleep() {
    await this.sleepService.startSleep();
    await this.navCtrl.navigateRoot('/session');
  }
  
  private static toLocalIso(d:Date):string {
    const p = (n:number) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
      'T' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':00';
  }

  private resetForm() {
    const now = new Date();
    now.setSeconds(0, 0);

    const bed = new Date(now);
    bed.setDate(bed.getDate() - 1);
    bed.setHours(23, 0, 0, 0);

    const wake = new Date(now);
    wake.setHours(7, 0, 0, 0);
    if (wake.getTime() > now.getTime()) {
      wake.setTime(now.getTime());
    }

    this.bedIso = SleepPage.toLocalIso(bed);
    this.wakeIso = SleepPage.toLocalIso(wake);
    this.note = '';
  }
  
  get bed():Date { return new Date(this.bedIso); }
  get wake():Date { return new Date(this.wakeIso); }

  /* latest time the pickers allow */
  get maxIso():string {
    return SleepPage.toLocalIso(new Date());
  }

  /* ---------- validation ---------- */

  get error():string {
    const now = new Date();
    const ms = this.wake.getTime() - this.bed.getTime();
    if (this.bed.getTime() > now.getTime() || this.wake.getTime() > now.getTime()) {
      return "Times can't be in the future.";
    }
    if (ms <= 0) {
      return 'Wake-up time must be after bedtime.';
    }
    if (ms > 24 * 60 * 60 * 1000) {
      return "Sleep can't be longer than 24 hours.";
    }
    return '';
  }

  get durationPreview():string {
    const totalMinutes = Math.floor((this.wake.getTime() - this.bed.getTime()) / 60000);
    return Math.floor(totalMinutes / 60) + ' h ' + (totalMinutes % 60) + ' min';
  }

  /* ---------- events ---------- */

  onBedChange(event:any) {
    this.bedIso = String(event.detail.value);
  }

  onWakeChange(event:any) {
    this.wakeIso = String(event.detail.value);
  }

  onNoteInput(event:any) {
    this.note = String(event.detail.value ?? '');
  }

  async save() {
    if (this.error) return;
    const wake = this.wake;

    // only one overnight log per day
    const existing = SleepService.AllOvernightData.find(
      d => d.sleepEnd.toDateString() === wake.toDateString()
    );
    if (existing) {
      const alert = await this.alertCtrl.create({
        header: 'Replace existing log?',
        message: 'You already logged ' + existing.durationString() + ' of sleep for this day. Replace it?',
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          { text: 'Replace', role: 'confirm' }
        ]
      });
      await alert.present();
      const { role } = await alert.onDidDismiss();
      if (role !== 'confirm') return;
      await this.sleepService.deleteLog(existing);
    }

    const log = new OvernightSleepData(this.bed, wake, this.note.trim());
    log.loggedAt = wake;
    await this.sleepService.logOvernightData(log);

    const toast = await this.toastCtrl.create({
      message: 'Sleep saved',
      duration: 2000,
      position: 'bottom',
      positionAnchor: 'app-tab-bar'
    });
    await toast.present();

    this.resetForm();
    this.router.navigateByUrl('/home');
  }

}
