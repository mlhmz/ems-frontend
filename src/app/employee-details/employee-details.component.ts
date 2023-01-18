import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Employee } from '../Employee';
import { EmployeeService } from '../employee.service';
import { Qualification } from '../Qualification';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
  employee: Employee | undefined;
  qualifications: Qualification[];
  id: number | undefined;
  found: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
  ) {
    this.qualifications = []
  }

  ngOnInit(): void {
    this.getIdFromParams();
    if (this.id != undefined) {
      this.fetchEmployee(this.id);
      this.fetchQualifications(this.id)
    }
  }

  private getIdFromParams() {
    const routeParams = this.route.snapshot.paramMap;
    this.id = Number(routeParams.get('id'));
  }

  private fetchEmployee(id: number) {
    this.employeeService.getEmployeeById(id)
    .then(employee => this.employee = employee);
  }

  private fetchQualifications(id: number) {
    this.employeeService.getQualificationsByEmployeeId(id)
    .then(qualifications => this.qualifications = qualifications);
  }
}
