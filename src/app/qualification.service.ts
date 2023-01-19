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

  /**
   * Gets all qualifications from service.
   * 
   * @returns Qualifications array as observable
   */
  public getAllQualifications(): Observable<Qualification[]> {
    return this.http.get<Qualification[]>('/backend/qualifications', {
      headers: this.getHeaders()
    });
  }

  /**
   * Gets asynchronously a qualification by its designation.
   * 
   * @param designation as string
   * @returns Qualification as Promise
   */
  public async getQualificationByDesignation(designation: string): Promise<Qualification | undefined> {
    const qualification = await firstValueFrom(this.http.get<Qualification[]>(`/backend/qualifications`, {
      headers: this.getHeaders()
    })).then(qualifications => {
      return this.getQualificationFromListByDesignation(qualifications, designation);
    })
    return qualification;
  }

  /**
   * Filters a qualification from a list by its designation.
   * 
   * @returns Qualifcation which equals the designation, or null if qualification doesn't exists
   */
  private getQualificationFromListByDesignation(qualifications: Qualification[], designation: string): Qualification {
    return qualifications.filter(
      qualification => qualification.skill === designation
    )[0];
  }

  /**
   * Gets required Headers for Qualification related requests
   * 
   * @returns headers for requests
   */
  private getHeaders(): HttpHeaders | { [header: string]: string | string[]; } | undefined {
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.bearer}`);
  }
}
