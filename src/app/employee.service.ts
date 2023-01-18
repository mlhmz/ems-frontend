import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { firstValueFrom, Observable } from 'rxjs';
import { Employee } from './Employee';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private bearer: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { 
    this.bearer = authService.getToken();
  }

  public getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>('/backend/employees', {
      headers: this.getHeaders()
    });
  }

  public getEmployeeById(id: number): Promise<Employee> {
    return firstValueFrom(this.http.get<Employee>(`/backend/employees/${id}`, {
      headers: this.getHeaders()
    }));
  }

  private getHeaders(): HttpHeaders | { [header: string]: string | string[]; } | undefined {
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.bearer}`);
  }
}
