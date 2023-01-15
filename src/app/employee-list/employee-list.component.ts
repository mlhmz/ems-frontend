import { Component, OnInit } from '@angular/core';
import {Observable, of} from "rxjs";
import {Employee} from "../Employee";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent {

  bearer = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzUFQ0dldiNno5MnlQWk1EWnBqT1U0RjFVN0lwNi1ELUlqQWVGczJPbGU0In0.eyJleHAiOjE2NzM3OTA0NTksImlhdCI6MTY3Mzc4Njg1OSwianRpIjoiMDQ2YzI0ZDktYmY2Ni00MDI4LWE0OTItMzgxZjVjNWYwNmQ4IiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay5zenV0LmRldi9hdXRoL3JlYWxtcy9zenV0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjU1NDZjZDIxLTk4NTQtNDMyZi1hNDY3LTRkZTNlZWRmNTg4OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImVtcGxveWVlLW1hbmFnZW1lbnQtc2VydmljZSIsInNlc3Npb25fc3RhdGUiOiIzNTE5N2Y1MS1kMmEzLTQzNGEtYjM4Mi0wMjk3ZWFkMWI5MDMiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1zenV0IiwidW1hX2F1dGhvcml6YXRpb24iLCJ1c2VyIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXIifQ.P3uOhiAI4Gw2GajEd4CQPI08lW_DOmiEaoXwrZDtGIMf8fcDZNePECj7mV-x3Gos2M3TJkWaqL990kTr0QasgAHy5HYVLVjwzWdAeWLzGpbF0FZpabEXZj3IgzIhzXj8ZpNUpBDVhUDDa5e4o2YIdYp3Ta4oJxiEl256YTMumrIsa1J1YiDr-zLefkXfFlJIUc0NMjJf-F5nurXgE3ciAzzcoDJ_8Wa3O0I9TO1y4Idp37OAo3mYnH8-Z65_IrWY3pLZ1m74pfLc2wcnW_EdB6ug1FlLuCLaWdzMypSAS2vzv7oE9TEIK6y6it74tEfoA7mUye6UutAOhjs07yZmTQ';
  employees$: Observable<Employee[]>;

  constructor(private http: HttpClient) {
    this.employees$ = of([]);
    this.fetchData();
  }

  fetchData() {
    this.employees$ = this.http.get<Employee[]>('/backend', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${this.bearer}`)
    });
  }

}
