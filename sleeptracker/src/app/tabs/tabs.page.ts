import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, moon, book } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  constructor(private navCtrl:NavController) {
    addIcons({ home, moon, book });

    if (SleepService.ActiveSleepStart) {
      this.navCtrl.navigateRoot('/session');
    }
  }
}