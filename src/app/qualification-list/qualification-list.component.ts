import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Qualification } from '../Qualification';

@Component({
  selector: 'app-qualification-list',
  templateUrl: './qualification-list.component.html',
  styleUrls: ['./qualification-list.component.css']
})
export class QualificationListComponent {
  bearer = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzUFQ0dldiNno5MnlQWk1EWnBqT1U0RjFVN0lwNi1ELUlqQWVGczJPbGU0In0.eyJleHAiOjE2NzM3OTQ0NjEsImlhdCI6MTY3Mzc5MDg2MSwianRpIjoiOTgxMWNiODgtOTRjMC00OWM2LWEzMGEtMWRjNzQ1YjFjNTdiIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay5zenV0LmRldi9hdXRoL3JlYWxtcy9zenV0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjU1NDZjZDIxLTk4NTQtNDMyZi1hNDY3LTRkZTNlZWRmNTg4OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImVtcGxveWVlLW1hbmFnZW1lbnQtc2VydmljZSIsInNlc3Npb25fc3RhdGUiOiIxNTVhZTE5Yi0yMjU0LTRiMjAtYmNiZi1jMmMxNWY2OGNiNDEiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1zenV0IiwidW1hX2F1dGhvcml6YXRpb24iLCJ1c2VyIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXIifQ.ZoefLURly1YaCYIeNiz8ybfDmpomoNLaW6yiX1FEQtCz9w7V4TpK0gb_r_JXHz4fgUVNH-ydJ1lpHRveSfA4VvQEb1Z8yzYdW3_tczexQtqV4omTcNu62AU4k4fen5BPJBhxUHwjLNkVcmF8DAhK4Mp9jsGwyHuF9e7n5lEpvK9cZDKU3K05V9eRpKgMk-4dy-hN-9RJvfN41qDWPEWjbsWCZuu4cLzeGww3iN8EiB6dRIShVEdZIpcsmimW_mfAoLqbmqn9bMxeE8ok_7bMjVb10qDNc6rOFiWEVlCQY68AFxa-u6YPU5_eagTC25EvlsnfEk5k8Tnmr4DAbW6_6w';
  qualifications$: Observable<Qualification[]>;

  constructor(private http: HttpClient) {
    this.qualifications$ = of([]);
    this.fetchData();
  }

  fetchData() {
    this.qualifications$ = this.http.get<Qualification[]>('/backend/qualifications', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${this.bearer}`)
    });
  }
}
