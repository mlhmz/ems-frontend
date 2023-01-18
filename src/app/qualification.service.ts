import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
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

  public async getQualificationByDesignation(designation: string): Promise<Qualification | undefined> {
    const qualification = await firstValueFrom(this.http.get<Qualification[]>(`/backend/qualifications`, {
      headers: this.getHeaders()
    })).then(qualifications => {
      return this.getQualificationFromListByDesignation(qualifications, designation);
    })
    return qualification;
  }

  private getQualificationFromListByDesignation(qualifications: Qualification[], designation: string): Qualification {
    return qualifications.filter(
      qualification => qualification.designation === designation
    )[0];
  }

  private getHeaders(): HttpHeaders | { [header: string]: string | string[]; } | undefined {
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.bearer}`);
  }
}
