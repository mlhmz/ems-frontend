import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Qualification } from './Qualification';
import { QualificationEmployees } from './QualificationEmployees';
import { ValidationResult } from './ValidationResult';

@Injectable({
  providedIn: 'root',
})
export class QualificationService {
  constructor(private http: HttpClient) {}

  public isQualificationValid(qualfication: Qualification): boolean {
    return this.getAllFieldValidationResults(qualfication).filter((result) => !result.valid).length == 0;
  }

  public getAllFieldValidationResults(qualfication: Qualification): ValidationResult[] {
    const validationResults = [];
    for (const field of Qualification.ALL_FIELDS) {
      validationResults.push(this.getFieldValidationResult(field, qualfication));
    }
    return validationResults;
  }

  public getFieldValidationResult(field: string, qualification: Qualification): ValidationResult {
    let validationResult: ValidationResult;
    switch (field) {
      case Qualification.SKILL_FIELD_NAME:
        validationResult = new ValidationResult().buildMandatoryStringValidator(
          this.getGuiRep(field),
          this.getFieldContent(field, qualification)
        );
        break;
      default:
        throw new Error('Invalid field identifier');
    }
    return validationResult;
  }

  private getGuiRep(field: string): string {
    let guiRep: string | undefined;
    switch (field) {
      case Qualification.SKILL_FIELD_NAME:
        guiRep = 'Qualifikation';
        break;
      default:
        throw new Error('Invalid field identifier');
    }
    return guiRep;
  }

  private getFieldContent(field: string, qualification: Qualification): string | undefined {
    let content: string | undefined;
    switch (field) {
      case Qualification.SKILL_FIELD_NAME:
        content = qualification.skill;
        break;
      default:
        throw new Error('Invalid field identifier');
    }
    return content;
  }

  /**
   * Gets all qualifications from service.
   *
   * @returns Qualifications array as observable
   */
  public getAllQualifications(): Observable<Qualification[]> {
    return this.http.get<Qualification[]>('/backend/qualifications', {
      headers: this.getHeaders(),
    });
  }

  /**
   * Gets asynchronously a qualification by its skill.
   *
   * @param skill as string
   * @returns Qualification as Promise
   */
  public async getQualificationBySkill(skill: string): Promise<Qualification | undefined> {
    const qualification = await firstValueFrom(
      this.http.get<Qualification[]>(`/backend/qualifications`, {
        headers: this.getHeaders(),
      })
    ).then((qualifications) => {
      return this.getQualificationFromListByDesignation(qualifications, skill);
    });
    return qualification;
  }

  /**
   * Saves not existing qualifications from a qualification array
   *
   * @param qualifications array to check from
   */
  public async saveNotExistingQualifications(qualifications: Qualification[]) {
    const allQualifications = await firstValueFrom(
      this.http.get<Qualification[]>('/backend/qualifications', {
        headers: this.getHeaders(),
      })
    );
    for (const qualification of qualifications) {
      await this.saveQualificationIfNotExisting(qualification, allQualifications);
    }
  }

  /**
   * Saves asynchronusly a qualification
   *
   * @param qualification to save
   * @returns qualification as promise
   */
  public async saveQualification(qualification: Qualification): Promise<Qualification> {
    return await firstValueFrom(
      this.http.post<Qualification>(`/backend/qualifications`, qualification, {
        headers: this.getHeaders(),
      })
    );
  }

  /**
   * Bulk deletes asynchronusly multiple qualifications
   *
   * @param qualifications to delete
   */
  public async bulkDeleteQualifications(qualifications: Qualification[]) {
    for (const qualification of qualifications) {
      await this.deleteQualification(qualification);
    }
  }

  /**
   * Deletes asynchronusly a qualification
   *
   * @param qualification to delete
   */
  public async deleteQualification(qualification: Qualification) {
    await firstValueFrom(
      this.http.delete(`/backend/qualifications`, {
        body: qualification,
        headers: this.getHeaders(),
      })
    );
  }

  /**
   * Checks if a qualification is assigned to any employee
   *
   * @param qualification to check
   */
  public async isQualificationAssignedToAnyEmployee(qualification: Qualification): Promise<boolean> {
    let assigned = false;
    await firstValueFrom(
      this.http.get<QualificationEmployees>(`/backend/qualifications/${qualification.skill}/employees`, {
        headers: this.getHeaders(),
      })
    ).then((qe) => {
      assigned = qe.employees != undefined && qe.employees.length != 0;
    });
    return assigned;
  }

  /**
   * Gets qualification employees by skill
   *
   * @param skill to get the qualifications employees object
   */
  public getQualificationEmployeesBySkill(skill: string): Observable<QualificationEmployees> {
    return this.http.get<QualificationEmployees>(`/backend/qualifications/${skill}/employees`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Converts a string array to a qualification array
   *
   * @param skillArray string array to convert
   * @returns converted qualification array
   */
  public convertStringArrayToQualificationArray(skillArray: string[]): Qualification[] {
    const qualifications: Qualification[] = [];
    for (const skill of skillArray) {
      qualifications.push(this.convertStringToQualification(skill));
    }
    return qualifications;
  }

  /**
   * Converts a string to a qualification
   *
   * @param skill string to convert
   * @returns converted qualification
   */
  public convertStringToQualification(skill: string): Qualification {
    return new Qualification(skill);
  }

  /**
   * saves asynchronusly a qualification if it doesn't exist
   *
   * @param allQualification array to check from
   * @param qualification to check with
   */
  private async saveQualificationIfNotExisting(qualification: Qualification, allQualifications: Qualification[]) {
    if (this.isQualificationNotExisting(qualification, allQualifications)) {
      await this.saveQualification(qualification);
    }
  }

  /**
   * Checks if qualification is existing in array
   *
   * @param qualificaiton to check with
   * @param allQualifications array to check from
   */
  private isQualificationNotExisting(qualification: Qualification, allQualifications: Qualification[]) {
    console.log(allQualifications);
    return allQualifications.filter((entry) => entry.skill === qualification.skill).length == 0;
  }

  /**
   * Filters a qualification from a list by its skill.
   *
   * @returns Qualifcation which equals the skill, or null if qualification doesn't exists
   */
  private getQualificationFromListByDesignation(qualifications: Qualification[], skill: string): Qualification {
    return qualifications.filter((qualification) => qualification.skill === skill)[0];
  }

  /**
   * Gets required Headers for Qualification related requests
   *
   * @returns headers for requests
   */
  private getHeaders(): HttpHeaders | { [header: string]: string | string[] } | undefined {
    return new HttpHeaders().set('Content-Type', 'application/json');
  }
}
