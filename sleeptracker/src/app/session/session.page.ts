import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon, IonTextarea,
  NavController, AlertController, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moon, close } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';

@Component({
  selector: 'app-session',
  templateUrl: './session.page.html',
  styleUrls: ['./session.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, IonTextarea]
})
export class SessionPage implements OnInit {
  stage:'sleeping' | 'summary' = 'sleeping';
  start:Date = new Date();
  end:Date = new Date();
  elapsed = '00:00:00';
  note = '';
  private timer:any;

  constructor(private sleepService:SleepService,
    private navCtrl:NavController,
    private alertCtrl:AlertController,
    private toastCtrl:ToastController) { 
      addIcons({ moon, close });
    }

  ionViewWillEnter() {
    const active = SleepService.ActiveSleepStart;
    if (!active) {
      this.navCtrl.navigateRoot('/home');
      return;
    }
    this.start = active;
    this.stage = 'sleeping';
    this.note = '';
    this.tick();
    clearInterval(this.timer);
    this.timer = setInterval(() => this.tick(), 1000);
  }

  ionViewWillLeave() {
    clearInterval(this.timer);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  private tick() {
    const total = Math.max(0, Math.floor((Date.now() - this.start.getTime()) / 1000));
    const p = (n:number) => String(n).padStart(2, '0');
    this.elapsed = p(Math.floor(total / 3600)) + ':' + p(Math.floor(total / 60) % 60) + ':' + p(total % 60);
  }

   get durationText():string {
    const totalMinutes = Math.floor((this.end.getTime() - this.start.getTime()) / 60000);
    return Math.floor(totalMinutes / 60) + ' h ' + (totalMinutes % 60) + ' min';
  }

  get timeRange():string {
    const opts:Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
    return this.start.toLocaleTimeString('en-US', opts) + ' to ' + this.end.toLocaleTimeString('en-US', opts);
  }

  get tooLong():boolean {
    return this.end.getTime() - this.start.getTime() > 24 * 60 * 60 * 1000;
  }

  onNoteInput(event:any) {
    this.note = String(event.detail.value ?? '');
  }

  async confirmEnd() {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure you want to end this sleep?',
      buttons: [
        { text: 'Yes, end sleep', role: 'confirm' },
        { text: 'No, cancel', role: 'cancel' }
      ]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role === 'confirm') {
      clearInterval(this.timer);
      this.end = new Date();
      this.stage = 'summary';
    }
  }

    async cancelSleep() {
    const ranMs = Date.now() - this.start.getTime();
    if (ranMs > 2 * 60 * 1000) {   // only ask if it has been running a while
      const alert = await this.alertCtrl.create({
        header: 'Cancel this sleep?',
        message: 'Nothing will be saved.',
        buttons: [
          { text: 'Keep sleeping', role: 'cancel' },
          { text: 'Yes, cancel', role: 'confirm' }
        ]
      });
      await alert.present();
      const { role } = await alert.onDidDismiss();
      if (role !== 'confirm') return;
    }
    await this.sleepService.clearActiveSleep();
    await this.navCtrl.navigateRoot('/home');
  }

  ngOnInit() {
  }

}
