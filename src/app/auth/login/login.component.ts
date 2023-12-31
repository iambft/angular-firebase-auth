import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthStateService } from '../services/auth-state.service';
import { LoginService } from './services/login.service';
import { GoogleSigninComponent } from './google-signin/google-signin.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginFormComponent, MatProgressSpinnerModule, GoogleSigninComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService]
})
export class LoginComponent {
  public loginService = inject(LoginService);
  public authService = inject(AuthStateService);
  private router = inject(Router);

  constructor() {
    this.initEffect();
  }

  initEffect(): void {
    effect(() => {
      if (this.authService.user()) {
        this.router.navigate(['home']);
      }
    });
  }

  onGoToRegistration(): void {
    this.router.navigate(['auth', 'register']);
  }

  login(event: any): void {
    this.loginService.login$.next(event);
  }

  googleSignin(): void {
    this.loginService.loginWithGoogle$.next();
  }
}
