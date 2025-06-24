import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Path to AuthService
import { Observable } from 'rxjs'; // Not strictly needed if hasRole is sync and no async operations in guard
// map and take are not needed if hasRole is sync and no async operations in guard

export const adminAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const adminRole = 'ROLE_ADMIN'; // Define the admin role string

  // Check if user is logged in first.
  // AuthService.getCurrentUserLoggedInStatus() is synchronous.
  if (!authService.getCurrentUserLoggedInStatus()) {
    console.warn('AdminAuthGuard: User not logged in. Redirecting to login.');
    return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
  }

  // Check for admin role. AuthService.hasRole() is currently synchronous.
  const isAdmin = authService.hasRole(adminRole);

  if (isAdmin) {
    return true;
  } else {
    console.warn(\`AdminAuthGuard: User does not have required role '\${adminRole}'. Redirecting to dashboard.\`);
    return router.createUrlTree(['/dashboard']); // Or a dedicated '/unauthorized' page
  }
};
