import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, switchMap, tap } from 'rxjs';
import { Credentials } from 'src/app/auth/interfaces/credentials.interface';
import { AuthStateService } from 'src/app/auth/services/auth-state.service';

export enum RegisterStatusEnum {
  pending = 'pending',
  creating = 'creating',
  success = 'success',
  error = 'error'
}

export type RegisterStatus = RegisterStatusEnum.pending | RegisterStatusEnum.creating | RegisterStatusEnum.success | RegisterStatusEnum.error;

interface RegisterState {
  status: RegisterStatus;
}

@Injectable()
export class RegisterService {
  private authService = inject(AuthStateService);

  error$ = new Subject<any>();
  createUser$ = new Subject<Credentials>();

  userCreated$ = this.createUser$.pipe(
    switchMap((credentials) =>
      this.authService.createAccount(credentials).pipe(
        catchError((err) => {
          this.error$.next(err);
          return EMPTY;
        })
      )
    )
  );

  // state
  private state = signal<RegisterState>({
    status: RegisterStatusEnum.pending,
  });

  // selectors
  status = computed(() => this.state().status);

  constructor() {
    this.initUserCreatedReducer();
    this.initCreateUserReducer();
    this.initErrorReducer();
  }

  initUserCreatedReducer() {
    this.userCreated$
    .pipe(takeUntilDestroyed())
    .subscribe(() =>
      this.state.update((state) => ({ ...state, status: RegisterStatusEnum.success }))
    );
  }

  initCreateUserReducer() {
    this.createUser$
    .pipe(takeUntilDestroyed())
    .subscribe(() =>
      this.state.update((state) => ({ ...state, status: RegisterStatusEnum.creating }))
    );
  }

  initErrorReducer() {
    this.error$
    .pipe(
      takeUntilDestroyed(),
      tap(e => console.log(e))
      )
    .subscribe(() =>
      this.state.update((state) => ({ ...state, status: RegisterStatusEnum.error }))
    );
  }
}
