import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Injectable({
  providedIn: 'root'
})
export class SleepService {
	// private static LoadDefaultData:boolean = true;
	public static AllSleepData:SleepData[] = [];
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];

	public static ActiveSleepStart:Date | null = null;
	
	private static ACTIVE_KEY = 'activeSleepStart';
	private static OVERNIGHT_KEY = 'overnightLogs';
	private static SLEEPINESS_KEY = 'sleepinessLogs';

	constructor(private storage:Storage) {}

	// private addDefaultData() {
	// 	var goToBed = new Date();
	// 	goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
	// 	goToBed.setHours(1, 3, 0); //1:03am
	// 	var wakeUp = new Date();
	// 	wakeUp.setTime(goToBed.getTime() + 8 * 60 * 60 * 1000); //Sleep for exactly eight hours, waking up at 9:03am
	// 	this.logOvernightData(new OvernightSleepData(goToBed, wakeUp)); // add that person was asleep 1am-9am yesterday
	// 	var sleepinessDate = new Date();
	// 	sleepinessDate.setDate(sleepinessDate.getDate() - 1); //set to yesterday
	// 	sleepinessDate.setHours(14, 38, 0); //2:38pm
	// 	this.logSleepinessData(new StanfordSleepinessData(4, sleepinessDate)); // add sleepiness at 2pm
	// 	goToBed = new Date();
	// 	goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
	// 	goToBed.setHours(23, 11, 0); //11:11pm
	// 	wakeUp = new Date();
	// 	wakeUp.setTime(goToBed.getTime() + 9 * 60 * 60 * 1000); //Sleep for exactly nine hours
	// 	this.logOvernightData(new OvernightSleepData(goToBed, wakeUp));
	// }
	async init() {
		await this.storage.create();
		const overnight = (await this.storage.get(SleepService.OVERNIGHT_KEY)) ?? [];
		const sleepiness = (await this.storage.get(SleepService.SLEEPINESS_KEY)) ?? [];
		const active = await this.storage.get(SleepService.ACTIVE_KEY);
		SleepService.AllOvernightData = overnight.map((r:any) => OvernightSleepData.fromRecord(r));
		SleepService.AllSleepinessData = sleepiness.map((r:any) => StanfordSleepinessData.fromRecord(r));
		SleepService.ActiveSleepStart = active ? new Date(active) : null;
		this.rebuildAll();
	}

	public async logOvernightData(sleepData:OvernightSleepData) {
		// SleepService.AllSleepData.push(sleepData);
		SleepService.AllOvernightData.push(sleepData);
		this.rebuildAll();
		await this.save();
	}

	public async logSleepinessData(sleepData:StanfordSleepinessData) {
		// SleepService.AllSleepData.push(sleepData);
		SleepService.AllSleepinessData.push(sleepData);
		this.rebuildAll();
		await this.save();
	}
	
	public async deleteLog(sleepData:SleepData) {
		SleepService.AllOvernightData = SleepService.AllOvernightData.filter(d => d.id !== sleepData.id);
		SleepService.AllSleepinessData = SleepService.AllSleepinessData.filter(d => d.id !== sleepData.id);
		this.rebuildAll();
		await this.save();
	}

	public async startSleep() {
		SleepService.ActiveSleepStart = new Date();
		await this.storage.set(SleepService.ACTIVE_KEY, SleepService.ActiveSleepStart.toISOString());
	}

	public async clearActiveSleep() {
		SleepService.ActiveSleepStart = null;
		await this.storage.remove(SleepService.ACTIVE_KEY);
	}

	
	private rebuildAll() {
		SleepService.AllSleepData = [
			...SleepService.AllOvernightData,
			...SleepService.AllSleepinessData
		].sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
	}

	private async save() {
		await this.storage.set(SleepService.OVERNIGHT_KEY,
			SleepService.AllOvernightData.map(d => d.toRecord()));
		await this.storage.set(SleepService.SLEEPINESS_KEY,
			SleepService.AllSleepinessData.map(d => d.toRecord()));
	}
}
