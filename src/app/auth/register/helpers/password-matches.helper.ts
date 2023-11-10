import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchesValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  const isMatches = password && confirmPassword && password === confirmPassword;

  return isMatches ? null : { passwordMatch: true };
};
