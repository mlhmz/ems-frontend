import { Component } from '@angular/core';
import { Employee } from "./Employee";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private authService: AuthService
  ) { }

  isTokenAvailable(): boolean {
    return this.authService.isTokenAvailable();
  }

}
