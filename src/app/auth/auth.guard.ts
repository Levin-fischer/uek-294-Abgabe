import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const { authenticated, grantedRoles, keycloak } = authData;

  const requiredRoles: string | string[] | undefined = route.data['roles'];
  if (!requiredRoles) {
    return false;
  }
  const hasRequiredRole = (role: string | string[]): boolean => {
    const requiredRoles = Array.isArray(role) ? role : [role];
    return Object.values(grantedRoles.resourceRoles).some((roles) =>
      requiredRoles.some((r) => roles.includes(r)),
    );
  };

  if (authenticated && hasRequiredRole(requiredRoles)) {
    return true;
  }

  if (!authenticated) {
    // login und dann redirect auf die aktuelle uri
    await keycloak.login({ redirectUri: window.location.href });
    return false;
  }

  const router = inject(Router);
  return router.parseUrl('/forbidden');
};

export const canActivateAuthRole = createAuthGuard<CanActivateFn>(isAccessAllowed);
