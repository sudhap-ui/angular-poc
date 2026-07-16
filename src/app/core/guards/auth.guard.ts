import { Injectable } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthGuardImpl {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
    return false;
  }
}

export const AuthGuard: CanActivateFn = () => {
  return inject(AuthGuardImpl).canActivate();
};
