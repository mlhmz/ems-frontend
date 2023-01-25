import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  constructor(private router: Router) {}

  private readonly previousUrlKey = 'previous-url';
  private readonly routeStoringKey = 'avoid-route';
  private readonly defaultRoute = '/';
  private readonly contentBlacklist: string[] = ['saveSuccess=true'];

  /**
   * Stores the previous route into a local storage json array history
   */
  public storePreviousRoute(): void {
    if (this.isRoutesStored()) {
      this.setRoutesStored(false);
      return;
    }
    let routes: string[];
    const routeString: string | null = window.localStorage.getItem(this.previousUrlKey);
    if (routeString != null) {
      routes = JSON.parse(routeString);
      routes.push(this.getCleanRouteUrl());
    } else {
      routes = [this.defaultRoute, this.getCleanRouteUrl()];
    }
    routes = this.cutRoutesWhenRoutesListIsTooBig(routes, 25);
    this.saveRoutes(routes);
  }

  /**
   * Gets clean route url with removed blacklisted strings from {@link contentBlacklist}
   */
  private getCleanRouteUrl(): string {
    let url: string = this.getRouterUrl();
    for (const content of this.contentBlacklist) {
      url = url.replace(content, '');
    }
    return url;
  }

  /**
   * Cuts routes if list has over x entries
   *
   * @param routes - of the application
   * @param maxEntries - param to rule how many entries should be maximally allowed
   * @returns cutted string array
   */
  private cutRoutesWhenRoutesListIsTooBig(routes: string[], maxEntries: number): string[] {
    if (routes.length > maxEntries) {
      return routes.slice(-maxEntries);
    }
    return routes;
  }

  /**
   * Saves routes array as json array to local storage
   *
   * @param routes - array
   */
  private saveRoutes(routes: string[]) {
    window.localStorage.setItem(this.previousUrlKey, JSON.stringify(routes));
  }

  /**
   * Gets current route url from router
   *
   * @returns route url as string
   */
  private getRouterUrl(): string {
    return this.router.url;
  }

  /**
   * Goes to last route, and then removes last route
   */
  public goBack(): void {
    let routes: string[];
    const routeString: string | null = window.localStorage.getItem(this.previousUrlKey);
    let lastRoute;
    this.setRoutesStored(true);
    if (routeString != null) {
      routes = JSON.parse(routeString);
      lastRoute = this.getLastRoute(routes);
      routes.pop();
      window.localStorage.setItem(this.previousUrlKey, JSON.stringify(routes));
      this.router.navigateByUrl(lastRoute);
    } else {
      this.router.navigateByUrl('/');
    }
  }

  /**
   * Checks if routes should be stored
   *
   * @returns boolean if routes should be stored
   */
  private isRoutesStored(): boolean {
    const routesStored = window.localStorage.getItem(this.routeStoringKey);
    return routesStored != undefined && routesStored === 'true';
  }

  /**
   * Sets if routes should be stored
   *
   * @param routesStored - boolean to enable and disable
   */
  private setRoutesStored(routesStored: boolean) {
    window.localStorage.setItem(this.routeStoringKey, String(routesStored));
  }

  /**
   * Gets last route from array
   *
   * @param routes - as string array
   * @returns last route
   *
   */
  private getLastRoute(routes: string[]): string {
    return routes.slice(-1)[0];
  }
}
