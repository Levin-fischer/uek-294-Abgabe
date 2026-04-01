import { CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async (_, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);

  await authService.getAccessToken();
  if (authService.authenticated()) {
    return true;
  }

  await authService.login(state.url);
  return false;
};
