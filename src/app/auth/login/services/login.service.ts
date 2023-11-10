import { Injectable, computed, inject, signal } from '@angular/core';
import { EMPTY, Subject, catchError, switchMap } from 'rxjs';
import { Credentials } from '../../interfaces/credentials.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthStateService } from '../../services/auth-state.service';

export type LoginStatus = 'pending' | 'authenticating' | 'success' | 'error';

interface LoginState {
  status: LoginStatus;
}

@Injectable()
export class LoginService {
  private authService = inject(AuthStateService);

  // sources
  error$ = new Subject<any>();
  login$ = new Subject<Credentials>();

  userAuthenticated$ = this.login$.pipe(
    switchMap((credentials) =>
      this.authService.login(credentials).pipe(
        catchError((err) => {
          this.error$.next(err);
          return EMPTY;
        })
      )
    )
  );

   // state
   private state = signal<LoginState>({
    status: 'pending',
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
        this.state.update((state) => ({ ...state, status: 'success' }))
      );
  }

  initLoginReducer() {
    this.login$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: 'authenticating' }))
      );
  }

  initErrorReducer() {
    this.error$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: 'error' }))
      );
  }
}
