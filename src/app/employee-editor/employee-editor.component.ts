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
  employee: Employee = new Employee();
  qualifications$: Observable<Qualification[]>;
  edit: boolean = false;

  saveMessage: string = '';
  saveSuccess: boolean = false;
  showSaveSuccess: boolean = false;
  constructor(
    private employeeService: EmployeeService,
    private qualificationService: QualificationService,
    private route: ActivatedRoute
  ) {
    this.employee.skillSet = [];
    this.qualifications$ = of([]);
    this.fetchData();
  }

  fetchData() {
    this.qualifications$ = this.qualificationService.getAllQualifications();
  }

  getTitle() {
    let title = "Mitarbeiter ";
    if (this.edit == true) {
      title += this.employee.id + " editieren";
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

  private saveEmployee() {
    this.employeeService.addEmployee(this.employee)
      .then(() => {
        this.saveMessage = 'Speichern erfolgreich!';
        this.saveSuccess = true;
      })
      .catch((err) => {
        this.saveMessage = 'Speichern fehlgeschlagen, Grund: ' + err;
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

  addNewQualification() {

  }

  addQualificationToEmployee(skill: string | undefined) {
    if (skill == undefined) {
      return;
    } else {
      this.employee.skillSet?.push(skill)
    }
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    if (routeParams.has('id')) {
      this.edit = true;
      this.fetchEmployee(this.getIdFromParams(routeParams));
    }
  }


  private getIdFromParams(routeParams: ParamMap) {
    return Number(routeParams.get('id'));
  }

  private fetchEmployee(employeeId: number) {
    this.employeeService.getEmployeeById(employeeId)
      .then(employee => this.employee = employee);
  }
}
