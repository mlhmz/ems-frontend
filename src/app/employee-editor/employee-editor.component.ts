import { Component } from '@angular/core';
import { EmployeeService } from "../employee.service";
import { Employee } from "../Employee";
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Qualification } from "../Qualification";
import { QualificationService } from "../qualification.service";
import { Observable, of } from "rxjs";

//ToDo: Validation der Eingaben?

@Component({
  selector: 'app-employee-editor',
  templateUrl: './employee-editor.component.html',
  styleUrls: ['./employee-editor.component.css']
})
export class EmployeeEditorComponent {
  employeeId: number = 0;
  employee: Employee = new Employee();
  qualifications$: Observable<Qualification[]>;
  editable: boolean = false;
  saveMessage: string = '';
  saveSuccess: boolean = false;
  callbackAlertShown: boolean = false;
  tagInputValue: string = '';
  found: boolean = true;

  constructor(
    private employeeService: EmployeeService,
    private qualificationService: QualificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employee.skillSet = [];
    this.qualifications$ = of([]);
    this.fetchData();
  }

  /**
   * Initializes the component by fetching the data
   */
  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    if (routeParams.has('id')) {
      this.editable = true;
      this.getIdFromParams(routeParams)
      this.fetchEmployee(this.employeeId);
    }
  }

  /**
   * Fetches all qualifications
   */
  fetchData() {
    this.qualifications$ = this.qualificationService.getAllQualifications();
  }

  /**
   * Gets the title for the status bar
   */
  getTitle() {
    let title = "Mitarbeiter ";
    if (this.editable == undefined) {
      return "";
    }
    if (this.editable == true) {
      title += this.employeeId + " editieren";
    } else {
      title += "erstellen";
    }
    return title;
  }

  /**
   * Saves employee, if {@link editable} is true, the employee will be just edited
   */
  save() {
    let req;
    if (this.editable) {
      req = this.editEmployee();
    } else {
      req = this.saveEmployee();
    }
    req.then(() => {
      this.showCallbackAlert('Speichern erfolgreich!', true);
      this.router.navigateByUrl("/employee/" + this.employeeId + "?saveSuccess=true")
    }
    )
      .catch((err) => {
        this.showCallbackAlert('Speichern fehlgeschlagen, Grund: ' + err.message, false);
      });
    //ToDo: return to editor details after save?
  }

  private showCallbackAlert(saveMessage: string, saveSuccess: boolean) {
    this.saveMessage = saveMessage;
    this.saveSuccess = saveSuccess;
    this.callbackAlertShown = true;
  }

  /**
   * Adds skill to the {@link employee}
   * 
   * @param skill to add
   */
  addSkillToEmployee(skill: string) {
    if (this.isEmployeeSkillSetNotIncludingSkill(skill)) {
      this.employee.skillSet?.push(skill)
    }
    this.tagInputValue = "";
  }

  /**
   * Adds a new qualification
   */
  addNewQualification() {
    throw new Error('not implemented');
  }

  /**
   * Removes a skill by filtering every skill that is not equal
   * to the skill that should be removed
   * 
   * @param skill string to check with
   */
  removeSkill(skill: string) {
    this.employee.skillSet = this.employee.skillSet?.filter(entry => entry != skill);
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
   * Checks if an employee skill set is not including a certain skill
   * 
   * @param skill string to check with
   * @returns boolean if skill is not included in skill set
   */
  private isEmployeeSkillSetNotIncludingSkill(skill: string): boolean {
    return this.employee.skillSet?.filter(entry => entry == skill).length == 0;
  }

  /**
   * Gets id from params and stores it into {@link employeeId}
   * 
   * @param routeParams {@link ParamMap} to get the employee id from
   */
  private getIdFromParams(routeParams: ParamMap) {
    this.employeeId = Number(routeParams.get('id'));
  }

  /**
   * Fetches employee by id
   * 
   * @param employeeId of the employee to fetch
   */
  private fetchEmployee(employeeId: number) {
    this.employeeService.getEmployeeById(employeeId)
      .then(employee => this.employee = employee)
      .catch(() => this.found = false);
  }

  /**
   * Saves an employee and sets {@link saveMessage} as well as {@link saveSuccess}
   */
  private async saveEmployee() {
    await this.employeeService.addEmployee(this.employee)
  }

  /**
   * Edits an employee and sets {@link saveMessage} as well as {@link saveSuccess}
   */
  private async editEmployee() {
    await this.employeeService.editEmployee(this.employee)
  }
}
