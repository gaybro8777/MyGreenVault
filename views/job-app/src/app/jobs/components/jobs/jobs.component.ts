import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { JobsService, IPagedList, IJob } from '../../services/jobs';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService, DEFAULT_NOTIFICATION_TIME } from '../../../shared/services/notification/notification.service';


const DEFAULT_TAKE: number = 8;

@Component({
  selector: 'ti-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  isJobNotFound: boolean = false;

  @ViewChild('updateJobRef') updateJobRef: ElementRef;
  @ViewChild('addJobRef') addJobRef: ElementRef;

  private _addJobModalRef: NgbModalRef;

  updateJobModal: any;
  private _updateJobModalRef: NgbModalRef;

  jobs$: Observable<IJob[]>
  isJobsLoading$: Observable<boolean>;

  activeJob: IJob = null;
  activeJobSub$: Subscription;

  activeJob$: Observable<IJob>;

  isLoading: boolean = false;

  loading: boolean = true;
  private _more: boolean;
  get more(): boolean {
    return this._more;
  }
  set more(val: boolean) {
    this._more = val;
  }

  private _skip: number = 0;
  set skip(val: number) {
    this._skip = val;
  }
  get skip(): number {
    return this._skip;
  }

  private _take: number = DEFAULT_TAKE;
  set take(val: number) {
    this._take = val;
  }
  get take(): number {
    return this._take;
  }

  constructor(
    private _jobsService: JobsService,
    private _modalService: NgbModal,
    private _notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.jobs$ = this._jobsService.jobs$;
    this.isJobsLoading$ = this._jobsService.isJobsLoading$;
    this.activeJob$ = this._jobsService.activeJob$;

    this.doSearch();
  }

  nextPage() {
    this.skip = this.skip + this.take;
    this.doSearch();
  }

  previousPage() {
    if (this.skip >= this.take) {
      this.skip = this.skip - this.take;
      this.doSearch();
    }
  }

  doSearch() {
    this.isLoading = true;
    this.isJobNotFound = false;
    this._jobsService.getJobs(this.skip, this.take).subscribe(response => {
      if(response.data.length === 0) {
        this.isJobNotFound = true;
      }
      this.more = response.more
      this.isLoading = false;
      this.more = response.more;
      this.skip = response.skip;
      this.take = response.take;
    })
  }

  openUpdateJobModal(jobId) {
    this._jobsService.setActiveJob(jobId);
    this._updateJobModalRef = this._modalService.open(this.updateJobRef, { size: 'lg' });
  }

  closeUpdateJobModal() {
    this._updateJobModalRef.close();
  }

  closeAddJobModal() {
    this._addJobModalRef.close();
  }

  isTiUpdateJobLoading(event) {
    console.log(event);
  }

  addJob() {
    this._addJobModalRef = this._modalService.open(this.addJobRef, { size: 'lg' });
  }

  removeJob(job) {
    this.isLoading = true;
    this._jobsService.removeJob(job).subscribe(data => {
      this._notificationService.setNotificationOn('successfully removed job')
      Observable.timer(DEFAULT_NOTIFICATION_TIME).subscribe(() => {
        this._notificationService.setNotificationOff()
      });
      this._jobsService.getJobs(this.skip, this.take).subscribe(() => {
        this.isLoading = false;
        console.log('updated');
      })
    });
  }

}
