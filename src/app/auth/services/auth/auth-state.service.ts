import { Injectable, computed, signal } from '@angular/core';
import { Credentials } from '../../interfaces/credentials.interface';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  // state
  private state = signal({
    user: undefined,
  });

  // selectors
  user = computed(() => this.state().user);

  login(credentials: Credentials) {
    return from([]);
  }

}
