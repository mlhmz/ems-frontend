import { Component, Input } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {
  @Input() itemsShown: boolean = false;
  expanded: boolean = false;

  constructor (
    private keycloakService: KeycloakService,
  ) {}

  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  /**
   * Logs the user out by clearing its token
   */
  logout() {
    this.keycloakService.logout();
  }
}
