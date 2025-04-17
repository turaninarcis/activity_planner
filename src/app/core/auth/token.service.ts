import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload{
  exp:number;
  sub: string;
  [key:string]:any;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'jwt_token';
  constructor() { }

  saveToken(token: string): void{
    localStorage.setItem(this.TOKEN_KEY, token);
  }
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  clearToken(): void{
    localStorage.removeItem(this.TOKEN_KEY);
  }
  
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: JwtPayload = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // in seconds
      return decoded.exp < currentTime;
    } catch (e) {
      return true;
    }
  }
}
