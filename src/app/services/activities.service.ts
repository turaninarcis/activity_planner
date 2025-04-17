import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DetailsPayload } from '../../Models/details-payload.model';
import { UserUpdatePayload } from '../../Models/user-update-payload.model';
@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private readonly apiUrl = 'http://localhost:8080/activities';
  constructor(private http: HttpClient) {}

  public getDetails():Observable<any>{
      console.log('Hit get joined activities');
        return this.http.get<any>(`${this.apiUrl}`);
  }
}