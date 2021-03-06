import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PagedList } from '../../shared/models';
import { tap } from 'rxjs/operators';

import { Plant } from '../models';
import { PlantsState } from './plants-state';
import { TokenService } from '../../shared/services/token/token.service';

export const DEFAULT_SKIP: number = 0;
export const DEFAULT_TAKE: number = 8;

@Injectable()
export class PlantsSearchService extends PlantsState {
  constructor(
    private _http: HttpClient,
    private _route: ActivatedRoute,
    private _router: Router,
    private readonly _tokenService: TokenService
  ) {
    super();
    this.doSearchOnPlantsPage();
  }

  public doSearch() {
    this._isPlantsLoading$.next(true);
    if (this._router.navigated) {
      this._plantsSkip$.next(this._route.snapshot.queryParams['skip'] || 0);
      this._plantsTake$.next(this._route.snapshot.queryParams['take'] || 8);
      this._plantsQuery$.next(this._route.snapshot.queryParams['query'] || null);
      this.getPlants()
        .first()
        .subscribe(data => {
          this._isPlantsLoading$.next(false);
        });
    }
  }

  public getPlantDetail(plantId: any) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let url = `/api/v1/plants/${plantId}`;

    this._isJobDetailLoading$.next(true);

    return this._http
      .get(url, { headers: headers, withCredentials: true })
      .map((res: any) => {
        return res;
      })
      .catch(err => {
        throw new Error(err);
      })
      .first()
      .subscribe(data => {
        this._isJobDetailLoading$.next(false);
        this._plantDetailSubject$.next(data);
      });
  }

  public getPlants() {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    let url = `/api/v1/plants?skip=${this._plantsSkip$.value}&take=${this._plantsTake$.value}`;

    if (this._plantsQuery$.value) {
      url += `&query=${this._plantsQuery$.value}`;
    }

    return this._http.get(url, { headers: headers, withCredentials: true }).map((res: PagedList<any>) => {
      const jobs = res.data;
      const moreJobs = res.more;
      const hasPreviousJobs = this._plantsSkip$.value != 0;

      this._plants$.next(jobs);
      this._morePlantsSubject$.next(moreJobs);
      this._hasPreviousPlants$.next(hasPreviousJobs);
    });
  }

  public saveProfileImage(plantId, images) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let url = `/api/v1/plants/${plantId}/profile-image`;

    const imagesRequest = { images: images, plantId };

    return this._http.post(url, imagesRequest, { headers: headers });
  }

  public deleteProfileImage(plantId: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const url = `/api/v1/plants/${plantId}/delete-profile-image`;

    const request = { plantId };

    return this._http.post(url, request, { headers: headers });
  }

  public getPlantProfileImage(plantId) {
    const userId = this._tokenService.getToken('userId');
    const url = `https://mygreenvault.blob.core.windows.net/plant-profile-photo/${userId}:${plantId}:profile`;

    return this._http.get(url, {
      responseType: 'blob'
    });
  }

  public getAllPlants() {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    let url = `/api/v1/plants/all`;

    return this._http
      .get(url, { headers: headers, withCredentials: true })
      .map((res: Plant[]) => {
        this._allPlants$.next(res);
      })
      .subscribe();
  }

  private getPlant() {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    let url = `/api/v1/plants?skip=${this._plantsSkip$.value}&take=${this._plantsTake$.value}`;

    if (this._plantsQuery$.value) {
      url += `&query=${this._plantsQuery$.value}`;
    }

    return this._http
      .get(url, { headers: headers, withCredentials: true })
      .map((res: PagedList<Plant>) => {
        const jobs = res.data;
        const moreJobs = res.more;
        const hasPreviousJobs = this._plantsSkip$.value != 0;

        this._allPlants$.next(jobs);
        this._morePlantsSubject$.next(moreJobs);
        this._hasPreviousPlants$.next(hasPreviousJobs);

        return jobs;
      })
      .catch(err => {
        throw new Error(err);
      });
  }

  public addPlant(plant) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http
      .post('/api/v1/plants/', plant, { headers: headers })
      .map((res: PagedList<Plant>) => {
        this._morePlantsSubject$.next(res.more);
      })
      .finally(() => {
        this.doSearch();
      });
  }

  public updatePlant(plant) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.put('/api/v1/plants', plant, { headers: headers }).map((res: any) => {
      this.doSearch();
      return res;
    });
  }

  public removePlant(plant) {
    let headers = new HttpHeaders();

    this._isPlantsLoading$.next(true);
    return this._http.post('/api/v1/plants/remove', plant, { headers: headers }).pipe(
      tap((res: HttpResponse<any>) => {
        const plants = this._allPlants$.value;
        if (!!plants && plants.length === 0) {
          this.previousPage();
        } else {
          this.doSearch();
        }
      })
    );
  }

  public setActivePlant(plantId: string): void {
    let activeJob = this.plants$.map(jobs => jobs.filter(job => job._id === plantId)[0]).subscribe(activePlant => {
      this._activePlantSubject$.next(activePlant);
    });
  }

  public nextPage() {
    this._router.navigate([`/plants`], {
      queryParams: {
        skip: Number(this._plantsSkip$.value) + Number(this._plantsTake$.value),
        take: Number(this._plantsTake$.value),
        query: this._plantsQuery$.value
      }
    });
  }

  public previousPage() {
    if (Number(this._plantsSkip$.value) >= Number(this._plantsTake$.value)) {
      this._router.navigate([`/plants`], {
        queryParams: {
          skip: Number(this._plantsSkip$.value) - Number(this._plantsTake$.value),
          take: Number(this._plantsTake$.value),
          query: this._plantsQuery$.value
        }
      });
    }
  }

  private doSearchOnPlantsPage() {
    this._router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      if (event.url.includes('plants') || (event.url.length === 1 && event.url.includes('/'))) {
        this.doSearch();
      }
    });
  }
}
