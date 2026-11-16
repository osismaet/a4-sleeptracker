import { SleepData } from './sleep-data';

export class OvernightSleepData extends SleepData {
	public sleepStart:Date;
	public sleepEnd:Date;
	public note:string;

	constructor(sleepStart:Date, sleepEnd:Date, note:string = '') {
		super();
		this.sleepStart = sleepStart;
		this.sleepEnd = sleepEnd;
		this.note = note;
	}
	get durationMs():number {
		return this.sleepEnd.getTime() - this.sleepStart.getTime();
	}
	
	durationString():string {
		const totalMinutes = Math.floor(this.durationMs / (1000 * 60));
		return Math.floor(totalMinutes / 60) + ' h ' + (totalMinutes % 60) + ' min';
	}
	
	timeRangeString():string {
		const opts:Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
		return this.sleepStart.toLocaleTimeString('en-US', opts) + ' to ' +
			this.sleepEnd.toLocaleTimeString('en-US', opts);
	}


	override summaryString():string {
		return this.durationString();
	}

	override dateString():string {
		return "Night of " + this.sleepStart.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	}

	toRecord() {
		return {
			id: this.id,
			loggedAt: this.loggedAt.toISOString(),
			sleepStart: this.sleepStart.toISOString(),
			sleepEnd: this.sleepEnd.toISOString(),
			note: this.note
		};
	}

	static fromRecord(r:any):OvernightSleepData {
		const data = new OvernightSleepData(new Date(r.sleepStart), new Date(r.sleepEnd), r.note ?? '');
		data.id = r.id;
		data.loggedAt = new Date(r.loggedAt);
		return data;
	}
}
