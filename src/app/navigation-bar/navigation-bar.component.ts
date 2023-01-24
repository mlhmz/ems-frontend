import { Component, Input } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
})
export class NavigationBarComponent {
  @Input() itemsShown: boolean = false;
  expanded: boolean = false;

  constructor(private keycloakService: KeycloakService) {}

  /**
   * Toggles the navigation bar expanded flag
   */
  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  /**
   * Logs the user with the service of keycloak out
   */
  logout() {
    this.keycloakService.logout();
  }
}
