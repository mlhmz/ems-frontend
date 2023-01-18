import { Component, OnInit } from '@angular/core';
import {filter, map, Observable, of} from "rxjs";
import {Employee} from "../Employee";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AuthService } from '../auth.service';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent {
  bearer = '';
  employees$: Observable<Employee[]>;
  searchValue: string = '';
  private searchMode: boolean = false;

  constructor(
    private http: HttpClient,
    private employeeService: EmployeeService
    ) {
    this.employees$ = of([]);
    this.fetchData();
  }

  fetchData() {
    this.employees$ = this.employeeService.getEmployees();
    this.resetSearch();
  }

  searchForString() {
    if (this.searchValue.length === 0) {
      this.fetchData();
      return;
    }

    this.employees$ = this.employees$.pipe(
      map(
        employees => employees.filter(employee => this.isEmployeeContentContainingString(this.searchValue, employee))
      )
    )
    this.setSearchMode(true);
  }

  isSearchModeEnabled() {
    return this.searchMode;
  }

  setSearchMode(state: boolean) {
    this.searchMode = state;
  }

  resetSearch() {
    this.setSearchMode(false);
    this.searchValue = "";
  }

  isEmployeeContentContainingString(text: string, employee: Employee) : boolean {
    var id: string | undefined = employee.id?.toString();
    var firstName: string | undefined = employee.firstName?.toLowerCase();
    var lastName: string | undefined = employee.lastName?.toLowerCase();
    return this.isValueContainingTextIgnoreCase(firstName, text) ||
    this.isValueContainingTextIgnoreCase(lastName, text) ||
    this.isIdEqualToString(id, text);
  }


  private isValueContainingTextIgnoreCase(value: string | undefined, text: string): boolean {
    if (value != undefined) {
      return value.includes(text.toLowerCase());
    }
    return false;
  }

  private isIdEqualToString(id: string | undefined, text: string): boolean {
    return id != undefined && id === text;
  }
}
