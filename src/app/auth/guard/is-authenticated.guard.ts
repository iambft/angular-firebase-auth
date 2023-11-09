import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../services/auth/auth-state.service';

export const isAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthStateService);
  const router = inject(Router);

  if (authService.user()) {
    return true;
  } else {
    router.navigate(['login']).then();
    return false;
  }
};
