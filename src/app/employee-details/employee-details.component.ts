import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '../Employee';
import { EmployeeService } from '../employee.service';
import { HistoryService } from '../history.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
})
export class EmployeeDetailsComponent implements OnInit {
  employee: Employee | undefined;
  id: number | undefined;
  found = true;
  showSaveSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private historyService: HistoryService
  ) {}

  /**
   * Initial employee fetching
   */
  ngOnInit(): void {
    this.getRequiredDataFromParams();
    if (this.id != undefined) {
      this.fetchEmployee(this.id);
    }
  }

  /**
   * Goes back to previous route
   */
  goBack(): void {
    this.historyService.goBack();
  }

  /**
   * gets the id from the params
   */
  private getRequiredDataFromParams() {
    const routeParams = this.route.snapshot.paramMap;
    this.id = Number(routeParams.get('id'));
    const routeQueries = this.route.snapshot.queryParamMap;
    if (routeQueries.has('saveSuccess')) {
      this.showSaveSuccess = routeQueries.get('saveSuccess') === 'true';
    }
  }

  /**
   * Deletes an employee by its id
   */
  deleteEmployee(id: number | undefined) {
    if (id != undefined) {
      this.employeeService.deleteEmployee(id).then(() => this.goBack());
    }
  }

  /**
   * fetches an employee by its id and sets {@link found}
   * to false if the employee couldn't be found
   *
   * @param id - of the employee
   */
  private fetchEmployee(id: number) {
    this.employeeService
      .getEmployeeById(id)
      .then((employee) => (this.employee = employee))
      .catch(() => (this.found = false));
  }
}
