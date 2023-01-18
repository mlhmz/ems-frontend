import {Component} from '@angular/core';
import {EmployeeService} from "../employee.service";
import {Employee} from "../Employee";
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Qualification} from "../Qualification";
import {QualificationService} from "../qualification.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-employee-editor',
  templateUrl: './employee-editor.component.html',
  styleUrls: ['./employee-editor.component.css']
})
export class EmployeeEditorComponent {
  employee: Employee = new Employee();
  qualfications: Observable<Qualification[]>;
  edit: boolean = false;
  constructor(
    private employeeService: EmployeeService,
    private qualificationService: QualificationService,
    private route: ActivatedRoute
  ) {
    this.qualfications = qualificationService.getAllQualifications();
  }

  save() {

  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    if(routeParams.has('id')) {
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
