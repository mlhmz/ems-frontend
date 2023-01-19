import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(
    private router: Router
  ) { }

  private readonly previousUrlKey = 'previous-url';
  private readonly defaultRoute = '/'

  /**
   * Stores the previous route into a local storage json array history
   */
  public storePreviousRoute(): void {
    var routes: string[];
    var routeString: string | null = window.localStorage.getItem(this.previousUrlKey);
    if (routeString != null)  {
      routes = JSON.parse(routeString);
      routes.push(this.getRouterUrl())
    } else {
      routes = [this.defaultRoute, this.getRouterUrl()];
    }
    this.saveRoutes(routes);
  }

  /**
   * Saves routes array as json array to local storage
   * 
   * @param routes array
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
    var routes: string[];
    var routeString: string | null = window.localStorage.getItem(this.previousUrlKey);
    let lastRoute;
    if (routeString != null) {
      routes = JSON.parse(routeString);
      lastRoute = this.getLastRoute(routes);
      routes.pop();
      window.localStorage.setItem(this.previousUrlKey, JSON.stringify(routes));
      this.router.navigateByUrl(lastRoute);
    } else {
      this.router.navigateByUrl("/");
    }
  }

  /**
   * Gets last route from array
   * 
   * @param routes as string array
   * @returns last route
   * 
   */
  private getLastRoute(routes: string[]): string {
    return routes.slice(-1)[0];
  }
}
