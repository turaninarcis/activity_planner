import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RegisterPayload{
  username: string;
  email : string;
  password:string;
}
interface LoginPayload{
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/users';
  constructor(private http: HttpClient) {}


   register(payload: RegisterPayload):Observable<{token: string}>{
    //console.log('Hit');
      return this.http.post<{token: string}>(`${this.apiUrl}/register`,payload);
   }
   login(payload: LoginPayload):Observable<{token: string}>{
    //console.log('Hit');
      return this.http.post<{token: string}>(`${this.apiUrl}/login`,payload);
   }
}
