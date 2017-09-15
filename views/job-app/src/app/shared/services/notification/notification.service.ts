import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export const DEFAULT_NOTIFICATION_TIME: number = 5000;


@Injectable()
export class NotificationService {

  private _isNotificationOnSubject$: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
  public readonly isNotificationOn$: Observable<boolean> = this._isNotificationOnSubject$.asObservable();

  private _notificationTextSubject$: BehaviorSubject<string> = new BehaviorSubject<any>('');
  public readonly notificationText$: Observable<string> = this._notificationTextSubject$.asObservable();

  private _notificationBootstrapClassSubject: BehaviorSubject<string> = new BehaviorSubject<string>('success');
  public readonly notificationBootstrapClass$: Observable<string> = this._notificationBootstrapClassSubject.asObservable();

  constructor() { }

  setNotificationOn(notificationText: string = '', notificationBootstrapClass:string = 'success') {
    this._notificationTextSubject$.next(notificationText);
    this._isNotificationOnSubject$.next(true);
    this._notificationBootstrapClassSubject.next(notificationBootstrapClass);
    
    Observable.timer(DEFAULT_NOTIFICATION_TIME).subscribe(() => {
      this._isNotificationOnSubject$.next(false);
    });
  }

  setNotificationOff() {
    this._notificationTextSubject$.next('');
    this._isNotificationOnSubject$.next(false);
  }

}
