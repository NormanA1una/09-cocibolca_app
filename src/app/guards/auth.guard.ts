import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log(state.url);

  console.log('Guard funciona');

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/logIn']);
    return false;
  }
};
