import { Component, OnInit } from '@angular/core';
import {filter, map, Observable, of} from "rxjs";
import {Employee} from "../Employee";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent {
  bearer = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzUFQ0dldiNno5MnlQWk1EWnBqT1U0RjFVN0lwNi1ELUlqQWVGczJPbGU0In0.eyJleHAiOjE2NzM3OTk1MzgsImlhdCI6MTY3Mzc5NTkzOCwianRpIjoiZDNmNzg5N2YtM2Q5ZC00YTcwLTkwZmMtMWU1ZWIxN2FlMTlhIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay5zenV0LmRldi9hdXRoL3JlYWxtcy9zenV0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjU1NDZjZDIxLTk4NTQtNDMyZi1hNDY3LTRkZTNlZWRmNTg4OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImVtcGxveWVlLW1hbmFnZW1lbnQtc2VydmljZSIsInNlc3Npb25fc3RhdGUiOiJmZDdiNjZiYS1iMmEyLTRmOWMtYjdmMC1iODFmZTUwZjQzZmUiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1zenV0IiwidW1hX2F1dGhvcml6YXRpb24iLCJ1c2VyIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXIifQ.V4RlLfMTZm_Fkd2G-gyyCVTl_SJ6CnXz9rVZ428u6oE6dShF4KdoUtSSC_FIZAEPvgRJ2mgMDDNxbyqOubxbhIuuQvhvRVQ_UMACObboToF8TUgM3RMJRx-m47zIgqWTw3g-3PCNmx_8bEbs2w3p-x8xVIs88IoP_-YYMbsji9wsuWcP4uIs0u9f_x8QEG-79liRML6DfnjVQr0FtS9nNNgM-NxOIbhL3guXZKdN715GUssS9JFBllloHiXiJD7kddnBNBymooO1QlDWYvBIsgWiiVENyvHLMcuRWAtXVZZi0c5sxG1BDXx0DS4lly-ALKPQZHiJeRj-LpnEty4fDQ';
  employees$: Observable<Employee[]>;
  searchValue: string = "";

  constructor(private http: HttpClient) {
    this.employees$ = of([]);
    this.fetchData();
  }

  fetchData() {
    this.employees$ = this.http.get<Employee[]>('/backend/employees', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${this.bearer}`)
    });
  }

  searchForString() {
    this.employees$ = this.employees$.pipe(
      map(
        employees => employees.filter(employee => this.isEmployeeContentContainingString(this.searchValue, employee))
      )
    )
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
