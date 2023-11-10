import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RegisterStatus } from '../services/register.service';
import { Credentials } from '../../interfaces/credentials.interface';
import { passwordMatchesValidator } from '../helpers/password-matches.helper';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {
  @Input({ required: true }) status!: RegisterStatus;
  @Output() register = new EventEmitter<Credentials>();

  private fb = inject(FormBuilder);

  registerForm = this.fb.nonNullable.group(
    {
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(8), Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      updateOn: 'blur',
      validators: [passwordMatchesValidator],
    }
  );

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...credentials } = this.registerForm.getRawValue();
      this.register.emit(credentials);
    }
  }
}
