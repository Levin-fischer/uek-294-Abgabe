import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.getAccessToken();
  if (authService.authenticated()) {
    return true;
  }

  return router.createUrlTree(['/home']);
};
