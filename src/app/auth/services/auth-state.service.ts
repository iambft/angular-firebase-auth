import { Injectable, computed, inject, signal } from '@angular/core';
import { Credentials } from '../interfaces/credentials.interface';
import { Observable, defer, from } from 'rxjs';
import { Auth, User, UserCredential, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

export type AuthUser = User | null | undefined;

interface AuthState {
  user: AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private auth = inject(Auth);
  private router = inject(Router)

  // sources
  private user$ = authState(this.auth);

  // state
  private state = signal<AuthState>({
    user: undefined,
  });

  // selectors
  user = computed(() => this.state().user);

  constructor() {
    this.initStateUpdateSubscription();
  }

  initStateUpdateSubscription(): void {
    this.user$.pipe(takeUntilDestroyed()).subscribe((user) =>
    this.state.update((state) => ({
      ...state,
      user,
    }))
  );
  }

  loginWithGoogle(): Observable<UserCredential> {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    return from(
      defer(() => signInWithPopup(this.auth, provider))
    )
  }

  login(credentials: Credentials): Observable<UserCredential> {
    return from(
      defer(() =>
        signInWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        )
      )
    );
  }

  logout(): void {
    signOut(this.auth);
    this.router.navigate(['/']);
  }

  createAccount(credentials: Credentials): Observable<UserCredential> {
    return from(
      defer(() =>
        createUserWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        )
      )
    );
  }
}
