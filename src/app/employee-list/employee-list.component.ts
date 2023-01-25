import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { Employee } from '../Employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent {
  bearer = '';
  employees$: Observable<Employee[]>;
  searchValue = '';
  employeeSelection: Employee[] = [];
  private searchMode = false;

  constructor(private employeeService: EmployeeService, private router: Router) {
    this.employees$ = of([]);
    this.fetchData();
  }

  /**
   * Gets all employees and resets the search.
   */
  fetchData() {
    this.employees$ = this.employeeService.getEmployees();
    this.resetSearch();
  }

  /**
   * Goes to an employee with the router
   *
   * @param id - of the employee
   */
  goToEmployee(id: number | undefined) {
    if (id != undefined) {
      this.router.navigateByUrl('/employee/' + id);
    }
  }

  /**
   * Selects / unselects an employee in the {@link employeeSelection}
   *
   * @param employee - to select or unselect
   */
  selectEmployee(employee: Employee) {
    if (this.isEmployeeContainedInSelection(employee)) {
      this.employeeSelection = this.employeeSelection.filter((entry) => entry != employee);
    } else {
      this.employeeSelection.push(employee);
    }
  }

  /**
   * Checks if the employee is contained in the selection
   *
   * @param employee - to check with
   * @returns boolean if employee is contained in selection
   */
  isEmployeeContainedInSelection(employee: Employee): boolean {
    return this.employeeSelection.filter((entry) => entry == employee).length != 0;
  }

  /**
   * Checks if any entry is selected
   *
   * @returns boolean if criteria is met
   */
  isAnythingSelected(): boolean {
    return this.employeeSelection.length != 0;
  }

  /**
   * Clears {@link employeeSelection}
   */
  clearSelection() {
    this.employeeSelection = [];
  }

  /**
   * Deletes every employee from the employee selection
   */
  deleteEmployeeSelection() {
    this.employeeService.bulkDeleteEmployees(this.employeeSelection).then(() => {
      this.clearSelection();
      this.fetchData();
    });
  }

  /**
   * Gets delete confirmation message.
   * If the {@link employeeSelection} size is over 1, the message will be shown as
   * plural.
   *
   * @returns string with the message
   */
  getDeleteConfirmationMessage(): string {
    if (this.employeeSelection.length == 1) {
      return 'Sollen die Mitarbeiter:innen wirklich gelöscht werden?';
    } else {
      return `Sollen die ${this.employeeSelection.length} ausgewählten Mitarbeiter:innen wirklich gelöscht werden?`;
    }
  }

  /**
   * Filters employees by the {@link searchValue}.
   * The filtering successes by checking if the first name or the last name includes the search value.
   * Also, it will be checked if the value equals the id.
   * In order to filter the observable, it will be piped and mapped.
   * Also, the {@link searchMode} will be set to true.
   *
   * If the content is empty, {@link fetchData} will be executed.
   */
  searchForString() {
    if (this.searchValue.length === 0) {
      this.fetchData();
      return;
    }

    this.employees$ = this.employees$.pipe(
      map((employees) =>
        employees.filter((employee) => this.isEmployeeContentContainingString(this.searchValue, employee))
      )
    );
    this.setSearchMode(true);
  }

  /**
   * Checks if search mode is enabled
   *
   * @returns if search mode is enabled
   */
  isSearchModeEnabled() {
    return this.searchMode;
  }

  /**
   * Sets the search mode state
   *
   * @param state - which the search mode should be set to
   */
  setSearchMode(state: boolean) {
    this.searchMode = state;
  }

  /**
   * Resets the search by setting the {@link searchValue} to false and
   */
  resetSearch() {
    this.setSearchMode(false);
    this.searchValue = '';
  }

  /**
   * Checks if the employee content is containing the text string.
   * The check successes by checking if text is including the first name and last name and
   * if it equals the id
   *
   * @param text - string to check if its content is included in the qualification skill
   * @param employee - to check if the text is included in the skill
   * @returns boolean if text is included in qualification skill
   */
  isEmployeeContentContainingString(text: string, employee: Employee): boolean {
    const id: string | undefined = employee.id?.toString();
    const firstName: string | undefined = employee.firstName?.toLowerCase();
    const lastName: string | undefined = employee.lastName?.toLowerCase();
    return (
      this.isValueContainingTextIgnoreCase(firstName, text) ||
      this.isValueContainingTextIgnoreCase(lastName, text) ||
      this.isIdEqualToString(id, text)
    );
  }

  /**
   * Checks if value is containing text, while text is set to lower case
   *
   * @param value - to check if text is included
   * @param text - to check if its content is included in the value string
   * @returns boolean if the value is containing the text
   */
  private isValueContainingTextIgnoreCase(value: string | undefined, text: string): boolean {
    if (value != undefined) {
      return value.includes(text.toLowerCase());
    }
    return false;
  }

  /**
   * Checks if the id is equal to the text string
   *
   * @returns boolean if the value is containing the text
   */
  private isIdEqualToString(id: string | undefined, text: string): boolean {
    return id != undefined && id === text;
  }
}
