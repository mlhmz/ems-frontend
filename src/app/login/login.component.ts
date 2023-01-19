import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username : string = "";
  password : string = "";
  loginFailed : boolean = false;

  constructor(
    private authService: AuthService
  ) {
  }
  
  /**
   * Authenticates the user with by fetching the token with the users
   * {@link username} and {@link password}.
   * 
   * checks if the fetch succeeded by handling its callback, which is a boolean promise
   */
  authenticate() {
    this.authService.fetchToken(this.username, this.password)
    .then(succeded => this.loginFailed = !succeded)
  }
}
