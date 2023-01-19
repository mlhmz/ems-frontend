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

  private saveRoutes(routes: string[]) {
    window.localStorage.setItem(this.previousUrlKey, JSON.stringify(routes));
  }

  private getRouterUrl(): string {
    return this.router.url;
  }

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

  private getLastRoute(routes: string[]): string {
    return routes.slice(-1)[0];
  }
}
