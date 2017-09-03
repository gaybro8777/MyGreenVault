import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs'
import { Job } from './jobs';
export { Job } from './jobs';

import 'rxjs/add/operator/map';


@Injectable()
export class ActiveJobService {

  private _activeJobSubject: BehaviorSubject<Job> = new BehaviorSubject(null);
  public readonly activeJob: Observable<Job> = this._activeJobSubject.asObservable()

  constructor() {}

  setActiveJob(job: Job): void {
    this._activeJobSubject.next(job);
  }

  getActiveJob(): Observable<Job> {
    return this.activeJob;
  }

  removeActiveJob():void {
    this._activeJobSubject.next(null);
  }

}
