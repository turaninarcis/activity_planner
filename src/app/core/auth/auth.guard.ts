import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from './token.service';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const token = tokenService.getToken();

  if (token && !tokenService.isTokenExpired(token)) {
    return true;
  } else {
    tokenService.clearToken(); // clean up expired token
    router.navigate(['/login']);
    return false;
  }
};