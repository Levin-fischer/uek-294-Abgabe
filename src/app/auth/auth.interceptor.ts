import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const currentUrl = window.location.href;
  if (authService.authenticated()) {
    const token = authService.token();
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
    });
    return next(cloned);
  }
  return next(req)
    .pipe(
      catchError((error) => {
        if (error.status === 401) {
          void authService.login({ redirectUri: currentUrl}); // Weiterleitung o.Ä.
        }
        return throwError(() => error);
      })
    );
};
