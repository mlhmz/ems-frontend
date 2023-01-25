import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Employee } from '../Employee';
import { EmployeeService } from '../employee.service';
import { Qualification } from '../Qualification';
import { QualificationService } from '../qualification.service';

@Component({
  selector: 'app-employee-editor',
  templateUrl: './employee-editor.component.html',
  styleUrls: ['./employee-editor.component.css'],
})
export class EmployeeEditorComponent implements OnInit {
  employeeId = 0;
  employee: Employee = new Employee();
  editable = false;
  saveMessage = '';
  saveSuccess = false;
  callbackAlertShown = false;
  tagInputValue = '';
  found = true;
  qualifications: Qualification[] = [];
  suggestions: Qualification[] = [];
  validatorShown = false;

  constructor(
    private employeeService: EmployeeService,
    private qualificationService: QualificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employee.skillSet = [];
    this.fetchData();
  }

  /**
   * Initializes the component by fetching the data
   */
  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    if (routeParams.has('id')) {
      this.editable = true;
      this.getIdFromParams(routeParams);
      this.fetchEmployee(this.employeeId);
    }
  }

  /**
   * Fetches all qualifications
   */
  fetchData() {
    firstValueFrom(this.qualificationService.getAllQualifications()).then(
      (qualifications) => (this.qualifications = qualifications)
    );
  }

  /**
   * Gets the title for the status bar
   */
  getTitle() {
    let title = 'Mitarbeiter ';
    if (this.editable == undefined) {
      return '';
    }
    if (this.editable == true) {
      title += this.employeeId + ' editieren';
    } else {
      title += 'erstellen';
    }
    return title;
  }

  /**
   * Saves employee, if {@link editable} is true, the employee will be just edited
   */
  save() {
    if (!this.employeeService.isEmployeeValid(this.employee)) {
      this.validatorShown = true;
      this.showCallbackAlert('Speichern fehlgeschlagen, Grund: Die Daten sind nicht valide.', false);
      return;
    }
    let req;
    if (this.editable) {
      req = this.editEmployee();
    } else {
      req = this.saveEmployee();
    }
    req
      .then((response) => {
        this.showCallbackAlert('Speichern erfolgreich!', true);
        this.router.navigateByUrl('/employee/' + response.id + '?saveSuccess=true');
      })
      .catch((err) =>
        this.showCallbackAlert(
          `Speichern fehlgeschlagen. Grund: ${err.error.message}. Falls Ihnen dies nicht weitergeholfen hat, kontaktieren Sie bitte den Support.`,
          false
        )
      );
  }

  /**
   * Gets the field validation result from the {@link employeeService}
   *
   * @param field - to get the validation result from
   */
  getFieldValidationResult(field: string) {
    if (this.validatorShown && !this.employeeService.isEmployeeValid(this.employee)) {
      return this.employeeService.getFieldValidationResult(field, this.employee).message;
    } else {
      return '';
    }
  }

  /**
   * Shows callback alert of the editor
   *
   * @param saveMessage - of the callback alet
   * @param saveSuccess - boolean, if set to false, an alert-danger message will be shown, else it is an
   *  alert-success message
   */
  private showCallbackAlert(saveMessage: string, saveSuccess: boolean) {
    this.saveMessage = saveMessage;
    this.saveSuccess = saveSuccess;
    this.callbackAlertShown = true;
  }

  /**
   * Adds skill to the {@link employee}
   *
   * @param skill - to add
   */
  addSkillToEmployee(skill: string | undefined) {
    if (skill != undefined && this.isEmployeeSkillSetNotIncludingSkill(skill)) {
      this.employee.skillSet?.push(skill);
    }
    this.tagInputValue = '';
    this.clearSuggestions();
  }

  /**
   * Removes a skill by filtering every skill that is not equal
   * to the skill that should be removed
   *
   * @param skill - string to check with
   */
  removeSkill(skill: string) {
    this.employee.skillSet = this.employee.skillSet?.filter((entry) => entry != skill);
  }

  /**
   * Conditionally removes the last skill of the employee skillSet
   * if the {@link tagInputValue} is empty
   */
  removeLastSkillIfTagInputValueIsEmpty() {
    if (this.tagInputValue.length == 0) {
      this.employee.skillSet?.pop();
    }
  }

  /**
   * Refreshes suggestions
   *
   * @param event - to trigger the refresh with
   */
  refreshSuggestions(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const input = element.value;
    const results = this.qualifications.filter((qualification) =>
      this.isQualificationContainingSkillValue(qualification, input)
    );
    this.suggestions = results.slice(-4);
    scrollTo(0, document.body.scrollHeight);
  }

  /**
   * Clears suggestions
   */
  clearSuggestions() {
    this.suggestions = [];
  }

  /**
   * Checks if the qualification is containing the input
   *
   * @param qualification - to check
   * @param input - to check
   * @returns boolean if criteria is met
   */
  private isQualificationContainingSkillValue(qualification: Qualification, input: string): boolean {
    if (this.employee.skillSet?.filter((entry) => entry === qualification.skill).length != 0) {
      return false;
    }
    if (qualification.skill != undefined && input != undefined && input.length != 0) {
      return qualification.skill?.toLowerCase().includes(input.toLowerCase());
    }
    return false;
  }

  /**
   * Checks if an employee skill set is not including a certain skill
   *
   * @param skill - string to check with
   * @returns boolean if skill is not included in skill set
   */
  private isEmployeeSkillSetNotIncludingSkill(skill: string): boolean {
    return this.employee.skillSet?.filter((entry) => entry == skill).length == 0;
  }

  /**
   * Gets id from params and stores it into {@link employeeId}
   *
   * @param routeParams - {@link ParamMap} to get the employee id from
   */
  private getIdFromParams(routeParams: ParamMap) {
    this.employeeId = Number(routeParams.get('id'));
  }

  /**
   * Fetches employee by id
   *
   * @param employeeId - of the employee to fetch
   */
  private fetchEmployee(employeeId: number) {
    this.employeeService
      .getEmployeeById(employeeId)
      .then((employee) => {
        this.employee = employee;
        this.validatorShown = true;
      })
      .catch(() => (this.found = false));
  }

  /**
   * Saves an employee and sets {@link saveMessage} as well as {@link saveSuccess}
   */
  private async saveEmployee(): Promise<Employee> {
    return await this.employeeService.addEmployee(this.employee);
  }

  /**
   * Edits an employee and sets {@link saveMessage} as well as {@link saveSuccess}
   */
  private async editEmployee(): Promise<Employee> {
    return await this.employeeService.editEmployee(this.employee);
  }
}
