import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Employee } from './Employee';
import { Qualification } from './Qualification';
import { QualificationService } from './qualification.service';
import { ValidationResult } from './ValidationResult';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient, private qualificationService: QualificationService) {}

  /**
   * Checks if an employee is overall valid or if it has any
   * failed validation results
   *
   * @param employee - to check if it is valid
   * @returns boolean if the employee is valid
   */
  public isEmployeeValid(employee: Employee): boolean {
    return this.getAllFieldValidationResults(employee).filter((result) => !result.valid).length == 0;
  }

  /**
   * Gets all fields validation results
   *
   * @param employee - that owns the fields that are being checked
   * @returns {@link ValidationResult} with an array of validation results
   */
  public getAllFieldValidationResults(employee: Employee): ValidationResult[] {
    const validationResults = [];
    for (const field of Employee.ALL_FIELDS) {
      validationResults.push(this.getFieldValidationResult(field, employee));
    }
    return validationResults;
  }

  /**
   * Gets the field validation result of the employee fields
   * that are defined in the {@link Employee} constants
   *
   * @param field - thats validation result is required
   * @param employee - that owns the field that is being checked
   * @returns {@link ValidationResult} of the employee
   * @throws {@link Error} if the field doesnt exist
   */
  public getFieldValidationResult(field: string, employee: Employee): ValidationResult {
    let validationResult: ValidationResult;
    switch (field) {
      case Employee.LAST_NAME_FIELD_NAME:
      case Employee.FIRST_NAME_FIELD_NAME:
      case Employee.STREET_FIELD_NAME:
      case Employee.CITY_FIELD_NAME:
      case Employee.PHONE_FIELD_NAME:
        validationResult = new ValidationResult().buildMandatoryStringValidator(
          this.getGuiRep(field),
          this.getFieldContent(field, employee)
        );
        break;
      case Employee.POSTCODE_FIELD_NAME:
        validationResult = new ValidationResult().buildMinMaxLengthValidator(
          this.getGuiRep(field),
          this.getFieldContent(field, employee),
          5,
          5
        );
        break;
      default:
        throw new Error('Invalid field identifier');
    }
    return validationResult;
  }

  /**
   * Gets the gui representation of the employee fields
   * that are defined in the {@link Employee} constants
   *
   * @param field - thats gui representation is required
   * @returns string of the gui rep
   * @throws {@link Error} if the field doesnt exists
   */
  private getGuiRep(field: string): string {
    let guiRep: string | undefined;
    switch (field) {
      case Employee.LAST_NAME_FIELD_NAME:
        guiRep = 'Nachname';
        break;
      case Employee.FIRST_NAME_FIELD_NAME:
        guiRep = 'Vorname';
        break;
      case Employee.STREET_FIELD_NAME:
        guiRep = 'Straße';
        break;
      case Employee.POSTCODE_FIELD_NAME:
        guiRep = 'Postleitzahl';
        break;
      case Employee.CITY_FIELD_NAME:
        guiRep = 'Stadt';
        break;
      case Employee.PHONE_FIELD_NAME:
        guiRep = 'Telefonnummer';
        break;
      default:
        throw new Error('Invalid field identifier');
    }
    return guiRep;
  }

  /**
   * Gets field content of the fields that are also defined as constants in the
   * {@link Employee} class
   *
   * @param field - thats content is getted
   * @param employee - that owns the field
   * @returns string if the field exists, otherwise it will return undefined
   * @throws {@link Error} if the field doesnt exists
   */
  private getFieldContent(field: string, employee: Employee): string | undefined {
    let content: string | undefined;
    switch (field) {
      case Employee.LAST_NAME_FIELD_NAME:
        content = employee.lastName;
        break;
      case Employee.FIRST_NAME_FIELD_NAME:
        content = employee.firstName;
        break;
      case Employee.STREET_FIELD_NAME:
        content = employee.street;
        break;
      case Employee.POSTCODE_FIELD_NAME:
        content = employee.postcode;
        break;
      case Employee.CITY_FIELD_NAME:
        content = employee.city;
        break;
      case Employee.PHONE_FIELD_NAME:
        content = employee.phone;
        break;
      default:
        throw new Error('Invalid field identifier');
    }
    return content;
  }

  /**
   * Gets all Employees from Service
   *
   * @returns Employees array as Observable
   */
  public getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>('/backend/employees', {
      headers: this.getHeaders(),
    });
  }

  /**
   * Gets asynchronously an employee by its id.
   *
   * @param id - of the employee
   * @returns employee as promise
   */
  public async getEmployeeById(id: number): Promise<Employee> {
    return await firstValueFrom(
      this.http.get<Employee>(`/backend/employees/${id}`, {
        headers: this.getHeaders(),
      })
    );
  }

  /**
   * Adds asynchronously an employee.
   *
   * @param employee - object to add
   * @returns employee callback as promise
   */
  public async addEmployee(employee: Employee): Promise<Employee> {
    if (employee.skillSet != undefined) {
      const qualifications = this.qualificationService.convertStringArrayToQualificationArray(employee.skillSet);
      await this.qualificationService.saveNotExistingQualifications(qualifications);
    }
    return firstValueFrom(this.http.post('/backend/employees', employee, { headers: this.getHeaders() }));
  }

  /**
   * Edits asynchronously an employee object.
   *
   * @param employee - to edit with matching id
   * @returns employee callback as promise
   */
  public async editEmployee(employee: Employee): Promise<Employee> {
    if (employee.id != undefined && employee.skillSet != undefined) {
      await this.updateQualificationsOfEmployee(employee, employee.skillSet);
    }
    return firstValueFrom(this.http.put(`/backend/employees/${employee.id}`, employee, { headers: this.getHeaders() }));
  }

  /**
   * Updates asynchronously qualifications of the employee to match the skills array
   * This method exists because the update route of the employee service somehow doesn't save modificated
   * skillLists, it only validates them.
   *
   * @param employee - to be updated
   * @param skills - array to be matched
   */
  private async updateQualificationsOfEmployee(employee: Employee, skills: string[]) {
    if (employee.id == undefined) {
      return;
    }
    const oldEmployeeData: Employee = await this.getEmployeeById(employee.id);
    const qualifications = this.qualificationService.convertStringArrayToQualificationArray(skills);
    await this.qualificationService.saveNotExistingQualifications(qualifications);
    const qualificationsToAdd: Qualification[] = this.getNotInEmployeeSkillSetContainedQualifications(
      oldEmployeeData,
      qualifications
    );
    this.bulkAddQualificationsToEmployee(employee.id, qualificationsToAdd);
    const qualificationsToRemove: Qualification[] = this.getNotInQualificationsContainedEmployeeSkills(
      oldEmployeeData,
      qualifications
    );
    this.bulkDeleteQualificationsFromEmployee(employee.id, qualificationsToRemove);
  }

  /**
   * Adds all Qualifications to the Employee that are included in the array
   *
   * @param employeeId - of the employee
   * @param qualifications - to add to the employee
   */
  public bulkAddQualificationsToEmployee(employeeId: number, qualifications: Qualification[]) {
    for (const qualification of qualifications) {
      this.addQualificationToEmployee(employeeId, qualification);
    }
  }

  /**
   * Adds asynchronously a qualification to the employee
   *
   * @param employeeId - of the employee
   * @param qualification - to add to the employee
   * @returns Promise with the added qualification
   */
  public async addQualificationToEmployee(employeeId: number, qualification: Qualification): Promise<Qualification> {
    return await firstValueFrom(
      this.http.post(`/backend/employees/${employeeId}/qualifications`, qualification, { headers: this.getHeaders() })
    );
  }

  /**
   * Deletes all Qualifications to the Employee that are included in the array
   *
   * @param employeeId - of the employee
   * @param qualifications - to remove from the employee
   */
  public bulkDeleteQualificationsFromEmployee(employeeId: number, qualificationsToRemove: Qualification[]) {
    for (const qualification of qualificationsToRemove) {
      this.deleteQualificationFromEmployee(employeeId, qualification);
    }
  }

  /**
   * Deletes asynchronously a qualification from the employee
   *
   * @param employeeId - of the employee
   * @param qualification - to add to the employee
   * @returns Promise with the added qualification
   */
  public async deleteQualificationFromEmployee(employeeId: number, qualification: Qualification) {
    await firstValueFrom(
      this.http.delete(`/backend/employees/${employeeId}/qualifications`, {
        headers: this.getHeaders(),
        body: qualification,
      })
    );
  }

  /**
   * Gets all qualifications from an qualification array that are not contained in the employees skillset
   *
   * @param employee - with skillset that eventually misses some entries from the qualification array
   * @param qualifications - array that includes all qualifications
   * @returns array with all qualiications that are matching the criteria
   */
  private getNotInEmployeeSkillSetContainedQualifications(
    employee: Employee,
    qualifications: Qualification[]
  ): Qualification[] {
    if (employee.skillSet != undefined) {
      return qualifications.filter((qualification) => !this.isSkillIncludedInEmployeeSkillSet(employee, qualification));
    }
    return [];
  }

  /**
   * Checks if the qualification is included in the skillset
   *
   * @param employee - thats skillset is checked
   * @param qualfication - that should be contained in the employees skillset
   * @returns boolean if the criteria is matching
   */
  private isSkillIncludedInEmployeeSkillSet(employee: Employee, qualification: Qualification): boolean {
    if (employee.skillSet != undefined && qualification.skill != undefined) {
      return employee.skillSet?.includes(qualification.skill);
    } else {
      return false;
    }
  }

  /**
   * Gets all Employee Qualifications that are not contained in the Qualification Array
   *
   * @param qualifications - that eventually misses some entries from the employee array
   * @param employee - with skillset that includes all qualifications of the employee
   * @returns array with entries that are included in the employee skillset but not in the qualifications array
   */
  private getNotInQualificationsContainedEmployeeSkills(
    employee: Employee,
    qualifications: Qualification[]
  ): Qualification[] {
    let result: Qualification[] = [];
    if (employee.skillSet != undefined) {
      const skillList = employee.skillSet.filter(
        (qualification) => !this.isEmployeeQualificationIncludedInQualificationSet(qualification, qualifications)
      );
      result = this.qualificationService.convertStringArrayToQualificationArray(skillList);
    }
    return result;
  }

  /**
   * Checks if employee qualification is included in the qualification array
   *
   * @param skill - that should be contained in the qualifications array
   * @param qualifications - array that is being checked
   */
  private isEmployeeQualificationIncludedInQualificationSet(skill: string, qualifications: Qualification[]): boolean {
    return qualifications.filter((entry) => entry.skill == skill).length != 0;
  }

  /**
   * Deletes Employees of an array that have an undefined id.
   *
   * @param employees - in an array
   */
  public async bulkDeleteEmployees(employees: Employee[]) {
    for (const employee of employees) {
      if (employee.id != undefined) {
        await this.deleteEmployee(employee.id);
      }
    }
  }

  /**
   * Deletes an employee by its id
   *
   * @param Employee - to delete
   */
  public async deleteEmployee(id: number) {
    await firstValueFrom(this.http.delete(`/backend/employees/${id}`, { headers: this.getHeaders() }));
  }

  /**
   * Gets required Headers for Employee related requests
   *
   * @returns headers for requests
   */
  private getHeaders(): HttpHeaders | { [header: string]: string | string[] } | undefined {
    return new HttpHeaders().set('Content-Type', 'application/json');
  }
}
