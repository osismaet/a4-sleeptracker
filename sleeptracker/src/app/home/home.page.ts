import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonIcon, IonRange, ToastController } from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { addIcons } from 'ionicons';
import { moon, happy, sad } from 'ionicons/icons';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, IonButton, IonIcon, IonRange],
})
export class HomePage {
  sleepinessValue = 3;
  forceSlider = false;

  constructor( private sleepService:SleepService,
    private router:Router,
    private toastCtrl:ToastController
	) {
		addIcons({ moon, happy, sad });
	}

  	get lastNight():OvernightSleepData | undefined {
    return [...SleepService.AllOvernightData]
      .sort((a, b) => b.sleepEnd.getTime() - a.sleepEnd.getTime())[0];
  	}
	  private static sameDay(a:Date, b:Date):boolean {
    return a.toDateString() === b.toDateString();
  }

  get latestSleepinessToday():StanfordSleepinessData | undefined {
    const today = new Date();
    return SleepService.AllSleepinessData
      .filter(d => HomePage.sameDay(d.loggedAt, today))
      .sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime())[0];
  }

  get nextLogTime():Date | undefined {
    const latest = this.latestSleepinessToday;
    if (!latest) return undefined;
    const next = new Date(latest.loggedAt.getTime() + 2 * 60 * 60 * 1000);
    if (next.getMinutes() > 0 || next.getSeconds() > 0) {
      next.setHours(next.getHours() + 1, 0, 0, 0);
    }
    return next;
  }

  get showLoggedState():boolean {
    const next = this.nextLogTime;
    return !this.forceSlider && !!next && new Date() < next;
  }

  get loggedAtString():string {
    return this.latestSleepinessToday?.timeString() ?? '';
  }

  get nextLogString():string {
    return this.nextLogTime
      ? this.nextLogTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      : '';
  }

  get scaleText():string {
    return StanfordSleepinessData.ScaleValues[this.sleepinessValue] ?? '';
  }

  onRange(event:any) {
    this.sleepinessValue = Number(event.detail.value);
  }

  async logSleepiness() {
    await this.sleepService.logSleepinessData(new StanfordSleepinessData(this.sleepinessValue));
    this.forceSlider = false;
    const toast = await this.toastCtrl.create({
      message: 'Sleepiness logged',
      duration: 2000,
      position: 'bottom',
      positionAnchor: 'app-tab-bar'
    });
    await toast.present();
  }

  go(url:string) {
    this.router.navigateByUrl(url);
  }
	ngOnInit() {
		console.log(this.allSleepData);
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}
}
