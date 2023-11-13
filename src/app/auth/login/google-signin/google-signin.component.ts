import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-google-signin',
  templateUrl: './google-signin.component.html',
  styleUrls: ['./google-signin.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
})
export class GoogleSigninComponent {
  @Output() onClick = new EventEmitter<void>();

  matIconRegistry = inject(MatIconRegistry)
  domSanitizer = inject(DomSanitizer)

  constructor() {
    this.initButton();
  }

  initButton(): void {
   this.matIconRegistry.addSvgIcon(
      'google-logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./../../../../assets/icons/google.svg')
    );
  }

  signin(): void {
    this.onClick.emit()
  }
}
