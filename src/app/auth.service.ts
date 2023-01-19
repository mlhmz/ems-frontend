import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  private readonly tokenKey = 'token';

  /**
   * Gets token as string from cookies
   * 
   * @returns token as string
   */
  public getToken(): string {
    return this.cookieService.get(this.tokenKey);
  }

  /**
   * Checks if a token is available and not empty in the cookies of the browser;
   * 
   * @returns boolean if the token is available
   */
  public isTokenAvailable(): boolean {
    return this.cookieService.check(this.tokenKey) && this.isTokenNotEmpty();
  }

  /**
   * Checks if the token is not empty
   * 
   * @returns boolean if token string is not empty
   */
  private isTokenNotEmpty(): boolean {
    return this.cookieService.get(this.tokenKey).length != 0;
  }

  /**
   * Clears the login token on log out.
   */
  public clearToken() {
    this.cookieService.delete(this.tokenKey);
  }

  /**
   * Fetches asynchronously the Token from the Authentication Service
   * 
   * @param username The username of the certain user
   * @param password The password of the certain user
   * @returns callback boolean if the login was successful as promise
   */
  public async fetchToken(username: string, password: string): Promise<boolean> {
    return await firstValueFrom(this.http.post("/auth", this.getLoginParams(username, password), this.getUrlEncodedOptions()))
    .then((res: any) => {
      this.saveToken(res);
      return true;
    })
    .catch(() => {
      return false;
    })
  }

  /**
   * Saves the Token to the cookies of the browser.
   */
  private saveToken(res: any) {
    this.cookieService.set(this.tokenKey, res.access_token, this.getExpirationDate(), "/");
  }

  /**
   * Gets expiration date of the token.
   * The Date will be generated and saved as UTC, but the browser itself will adjust it
   * to the Timezone of the User.
   * 
   * @returns The expiration date
   */
  private getExpirationDate(): number | Date | undefined {
    let date = new Date();
    date.setHours(date.getHours() + 1);
    return date;
  }

  /**
   * Gets required HttpHeaders for Auth related requests
   * 
   * @returns Headers for request
   */
  private getUrlEncodedOptions(): {headers: HttpHeaders} {
    return {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
  }

  /**
   * Generates Parameters for Logging into the authentication service
   * 
   * @param username The username of the certain user
   * @param password The password of the certain user
   * @returns HttpParams for auth service
   */
  private getLoginParams(username: string, password: string): HttpParams {
    return new HttpParams()
      .set('grant_type', 'password')
      .set('client_id', 'employee-management-service')
      .set('username', username)
      .set('password', password);
  }
}
