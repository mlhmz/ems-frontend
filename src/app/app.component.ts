import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { HistoryService } from './history.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = "employeeFrontendStarter";

  constructor(private historyService: HistoryService, private router: Router) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        historyService.storePreviousRoute();
      }
    });
  }
}
