import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Activity } from './models/activity.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private api = `${environment.apiUrl}/activity`;

  constructor(private http: HttpClient) {}

  getMyHistory(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.api);
  }
}
