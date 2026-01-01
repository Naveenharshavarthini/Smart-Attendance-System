import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  private alertSubject = new Subject<any>();

  constructor() {}

  // Observable for alerts
  getAlertObservable() {
    return this.alertSubject.asObservable();
  }

  // Trigger success alert
  showSuccess(message: string) {
    this.alertSubject.next({ type: 'success', message });
  }

  // Trigger error alert
  showError(message: string) {
    this.alertSubject.next({ type: 'danger', message });
  }
}
