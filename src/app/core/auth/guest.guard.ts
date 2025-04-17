import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from './token.service';

export const guestGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const token = tokenService.getToken();

  if (!token || tokenService.isTokenExpired(token)) {
    return true;
  } else {
    router.navigate(['/home']); // already logged in → redirect to home
    return false;
  }
};