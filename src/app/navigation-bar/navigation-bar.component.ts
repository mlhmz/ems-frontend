import { Component, Input } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {
  @Input() itemsShown: boolean = false;

  constructor (
    private authService: AuthService
  ) {}

  /**
   * Logs the user out by clearing its token
   */
  logout() {
    this.authService.clearToken();
  }
}
