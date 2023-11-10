import { Component, effect, inject } from '@angular/core';
import { RegisterService } from './services/register.service';
import { RegisterFormComponent } from './register-form/register-form.component';
import { Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [RegisterService],
  imports: [RegisterFormComponent],
  standalone: true
})
export class RegisterComponent {

  public registerService = inject(RegisterService);
  private authService = inject(AuthStateService);
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
}
