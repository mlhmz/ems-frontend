import { Component } from '@angular/core';
import { EmployeeService } from "../employee.service";
import { Employee } from "../Employee";
import { ActivatedRoute, ParamMap } from '@angular/router';
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
  edit: boolean = false;
  saveMessage: string = '';
  saveSuccess: boolean = false;
  showSaveSuccess: boolean = false;
  tagInputValue: string = '';

  constructor(
    private employeeService: EmployeeService,
    private qualificationService: QualificationService,
    private route: ActivatedRoute
  ) {
    this.employee.skillSet = [];
    this.qualifications$ = of([]);
    this.fetchData();
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    if (routeParams.has('id')) {
      this.edit = true;
      this.getIdFromParams(routeParams)
      this.fetchEmployee(this.employeeId);
    }
  }

  fetchData() {
    this.qualifications$ = this.qualificationService.getAllQualifications();
  }

  getTitle() {
    let title = "Mitarbeiter ";
    if (this.edit == undefined) {
      return "";
    }
    if (this.edit == true) {
      title += this.employeeId + " editieren";
    } else {
      title += "erstellen";
    }
    return title;
  }

  save() {
    if (this.edit) {
      this.editEmployee();
    } else {
      this.saveEmployee();
    }
    this.showSaveSuccess = true;
    //ToDo: return to editor details after save?
  }

  addQualificationToEmployee(skill: string) {
    if (this.isEmployeeSkillSetNotIncludingSkill(skill)) {
      this.employee.skillSet?.push(skill)
    }
    this.tagInputValue = "";
  }

  addNewQualification() {

  }

  removeSkill(skill: string) {
    this.employee.skillSet = this.employee.skillSet?.filter(entry => entry != skill);
  }

  removeLastSkillIfTagInputValueIsEmpty() {
    if (this.tagInputValue.length == 0) {
      this.employee.skillSet?.pop();
    }
  }

  private isEmployeeSkillSetNotIncludingSkill(skill: string): boolean {
    return this.employee.skillSet?.filter(entry => entry == skill).length == 0;
  }

  private getIdFromParams(routeParams: ParamMap) {
    this.employeeId = Number(routeParams.get('id'));
  }

  private fetchEmployee(employeeId: number) {
    this.employeeService.getEmployeeById(employeeId)
      .then(employee => this.employee = employee);
  }

  private saveEmployee() {
    this.employeeService.addEmployee(this.employee)
      .then(() => {
        this.saveMessage = 'Speichern erfolgreich!';
        this.saveSuccess = true;
      })
      .catch((err) => {
        this.saveMessage = 'Speichern fehlgeschlagen, Grund: ' + err.message;
        this.saveSuccess = false;
      });
  }
  
  private editEmployee() {
    this.employeeService.editEmployee(this.employee)
      .then(() => {
        this.saveMessage = 'Speichern erfolgreich!';
        this.saveSuccess = true;
      }
      )
      .catch((err) => {
        this.saveMessage = 'Speichern fehlgeschlagen, Grund: ' + err.message;
        this.saveSuccess = false;
      });
  }
}
