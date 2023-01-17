import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  private readonly tokenKey = 'token';

  public getToken() : string {
    return this.cookieService.get(this.tokenKey);
  }

  public isTokenAvailable() : boolean {
    return this.cookieService.check(this.tokenKey) && this.isTokenNotEmpty();
  }

  private isTokenNotEmpty() {
    return this.cookieService.get(this.tokenKey).length != 0;
  }

  public clearToken() {
    this.cookieService.delete(this.tokenKey);
  }

  async fetchToken(username: string, password: string) {
    this.http.post("/auth", this.getLoginParams(username, password), this.getUrlEncodedOptions())
    .subscribe((res: any) => {
      this.saveToken(res);
    })
  }

  private saveToken(res: any) {
    this.cookieService.set(this.tokenKey, res.access_token, this.getExpirationDate());
  }

  private getExpirationDate(): number | Date | undefined {
    let date = new Date();
    date.setHours(date.getHours() + 1);
    return date;
  }

  private getUrlEncodedOptions() {
    return {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
  }

  private getLoginParams(username: string, password: string) {
    return new HttpParams()
      .set('grant_type', 'password')
      .set('client_id', 'employee-management-service')
      .set('username', username)
      .set('password', password);
  }
}
