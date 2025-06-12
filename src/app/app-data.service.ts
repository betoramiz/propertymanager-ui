import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppData {
  residentId: number;
  issue: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  constructor() { }

  private appDataSubject = new BehaviorSubject<AppData | null>(null);
  appData$: Observable<AppData | null> = this.appDataSubject.asObservable();

  setAppData(data: AppData): void {
    this.appDataSubject.next(data);
  }

  getAppData(): AppData | null {
    return this.appDataSubject.value;
  }
}
