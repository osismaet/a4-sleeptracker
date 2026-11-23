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

	/* opens the database and loads saved logs. */
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

	/* newest first, both sleeps and sleepiness */
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
