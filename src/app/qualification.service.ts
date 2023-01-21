import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, firstValueFrom, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Qualification } from './Qualification';
import { QualificationEmployees } from './QualificationEmployees';

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
   * Gets asynchronously a qualification by its skill.
   * 
   * @param skill as string
   * @returns Qualification as Promise
   */
  public async getQualificationBySkill(skill: string): Promise<Qualification | undefined> {
    const qualification = await firstValueFrom(this.http.get<Qualification[]>(`/backend/qualifications`, {
      headers: this.getHeaders()
    })).then(qualifications => {
      return this.getQualificationFromListByDesignation(qualifications, skill);
    })
    return qualification;
  }

  public async saveNotExistingQualifications(qualifications: Qualification[]) {
    let allQualifications = await firstValueFrom(this.http.get<Qualification[]>('/backend/qualifications', {
      headers: this.getHeaders()
    }))
    for (let qualification of qualifications) {
      this.saveQualificationIfNotExisting(qualification, allQualifications);
    }
  } 

  public async saveQualification(qualification: Qualification): Promise<Qualification> {
    return await firstValueFrom(
      this.http.post<Qualification>(`/backend/qualifications`, qualification, { 
        headers: this.getHeaders() 
      })
    );
  }

  /**
   * Gets qualification employees by skill
   * 
   * @param skill to get the qualifications employees object
   */
  public getQualificationEmployeesBySkill(skill: string): Observable<QualificationEmployees> {
    return this.http.get<QualificationEmployees>(`/backend/qualifications/${skill}/employees`, {
      headers: this.getHeaders()
    });
  }

  public convertStringListToQualificationList(skillList: string[]): Qualification[] {
    let qualifications: Qualification[] = [];
    for (let skill of skillList) {
      qualifications.push(
        this.convertStringToQualification(skill)
      );
    }
    return qualifications;
  }

  public convertStringToQualification(skill: string): Qualification {
    return new Qualification(skill);
  }

  private saveQualificationIfNotExisting(qualification: Qualification, allQualifications: Qualification[]) {
    if (this.isQualificationNotExisting(qualification, allQualifications)) {
      this.saveQualification(qualification);
    }
  }

  private isQualificationNotExisting(qualification: Qualification, allQualifications: Qualification[]) {
    console.log(allQualifications)
    return allQualifications.filter(entry => entry.skill === qualification.skill).length == 0;
  }

  /**
   * Filters a qualification from a list by its skill.
   * 
   * @returns Qualifcation which equals the skill, or null if qualification doesn't exists
   */
  private getQualificationFromListByDesignation(qualifications: Qualification[], skill: string): Qualification {
    return qualifications.filter(
      qualification => qualification.skill === skill
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
