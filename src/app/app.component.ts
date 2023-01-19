import { Component } from '@angular/core';
import { Employee } from "./Employee";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { filter, map, Observable, of } from "rxjs";
import { AuthService } from './auth.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { HistoryService } from './history.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private authService: AuthService,
    private historyService: HistoryService,
    private router: Router,
  ) {
    router.events.subscribe(val => {
      if (val instanceof NavigationStart) {
        historyService.storePreviousRoute();
      }
    });
  }

  isTokenAvailable(): boolean {
    return this.authService.isTokenAvailable();
  }

}
