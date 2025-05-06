import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { DetailsPayload } from '../../Models/details-payload.model';
import { UserUpdatePayload } from '../../Models/user-update-payload.model';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'http://localhost:8080/users';
  constructor(private http: HttpClient) {}
  private userDetailsSubject = new BehaviorSubject<DetailsPayload | null>(null);
  userDetails$ = this.userDetailsSubject.asObservable();

  public getDetails():Observable<DetailsPayload>{
      console.log('Hit get');
        return this.http.get<DetailsPayload>(`${this.apiUrl}`).pipe(
          tap((respone) =>{
            this.userDetailsSubject.next(respone);
          })
        );
  }

  public updateUser(updatePayload:UserUpdatePayload):Observable<DetailsPayload>{
    console.log('Hit update');
      return this.http.patch<DetailsPayload>(`${this.apiUrl}`,updatePayload).pipe(
        tap((respone) =>{
          this.userDetailsSubject.next(respone);
        })
      );
}
}
