import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../auth/services/auth-state.service';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  authService = inject(AuthStateService)

  onLogOut(): void {
    this.authService.logout();
  }

}
