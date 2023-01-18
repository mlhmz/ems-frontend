import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Employee } from '../Employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
  employee: Employee | undefined;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
  ) {
  }

  ngOnInit(): void {
    this.fetchEmployee(this.getIdFromParams());
  }


  private getIdFromParams() {
    const routeParams = this.route.snapshot.paramMap;
    const employeeId = Number(routeParams.get('id'));
    return employeeId;
  }

  private fetchEmployee(employeeId: number) {
    this.employeeService.getEmployeeById(employeeId)
      .subscribe((employee: Employee) => this.employee = employee);
  }
}
