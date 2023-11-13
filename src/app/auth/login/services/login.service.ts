import { Injectable, computed, inject, signal } from '@angular/core';
import { EMPTY, Subject, catchError, merge, switchMap } from 'rxjs';
import { Credentials } from '../../interfaces/credentials.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthStateService } from '../../services/auth-state.service';

export enum LoginStatusEnum {
  Pending = 'pending',
  Authenticating = 'authenticating',
  Success = 'success',
  Error = 'error'
}

export type LoginStatus = LoginStatusEnum.Pending | LoginStatusEnum.Authenticating | LoginStatusEnum.Success | LoginStatusEnum.Error;

interface LoginState {
  status: LoginStatus;
}

@Injectable()
export class LoginService {
  private authService = inject(AuthStateService);

  // sources
  error$ = new Subject<any>();
  login$ = new Subject<Credentials>();
  loginWithGoogle$ = new Subject<void>();

  userAuthenticated$ = merge(
    this.login$.pipe(
      switchMap((credentials) => this.authService.login(credentials))
    ),
    this.loginWithGoogle$.pipe(
      switchMap(() => this.authService.loginWithGoogle())
    )
  ).pipe(
    catchError((err) => {
      this.error$.next(err);
      return EMPTY;
    })
  );

   // state
   private state = signal<LoginState>({
    status: LoginStatusEnum.Pending,
  });

  // selectors
  status = computed(() => this.state().status);

  constructor() {
    this.initAuthenticatedReducer();
    this.initErrorReducer();
    this.initLoginReducer();
  }

  initAuthenticatedReducer() {
    this.userAuthenticated$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: LoginStatusEnum.Success }))
      );
  }

  initLoginReducer() {
    this.login$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: LoginStatusEnum.Authenticating }))
      );
  }

  initErrorReducer() {
    this.error$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: LoginStatusEnum.Error }))
      );
  }
}
