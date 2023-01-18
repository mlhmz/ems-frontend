import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Qualification } from './Qualification';

@Injectable({
  providedIn: 'root'
})
export class QualificationService {
  private bearer: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { 
    this.bearer = authService.getToken();
  }

  public getAllQualifications(): Observable<Qualification[]> {
    return this.http.get<Qualification[]>('/backend/qualifications', {
      headers: this.getHeaders()
    });
  }

  public getQualificationByDesignation(designation: string): any {
    this.http.get<Qualification>(`/backend/qualifications/`, {
      headers: this.getHeaders()
    });
  }

  private getHeaders(): HttpHeaders | { [header: string]: string | string[]; } | undefined {
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.bearer}`);
  }
}
