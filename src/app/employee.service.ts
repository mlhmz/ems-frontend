import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { firstValueFrom, Observable } from 'rxjs';
import { Employee } from './Employee';
import { AuthService } from './auth.service';
import { Qualification } from './Qualification';

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

  public async getEmployeeById(id: number): Promise<Employee> {
    return await firstValueFrom(this.http.get<Employee>(`/backend/employees/${id}`, {
      headers: this.getHeaders()
    }));
  }

  public async getQualificationsByEmployeeId(id: number): Promise<Qualification[]> {
    return await firstValueFrom(this.http.get<Qualification[]>(`/backend/employees/${id}/qualifications`, {
      headers: this.getHeaders()
    }))
    .then((res: any) => {
      return res.skillSet;
    })
  }

  private getHeaders(): HttpHeaders | { [header: string]: string | string[]; } | undefined {
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.bearer}`);
  }
}
