import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Qualification } from '../Qualification';

@Component({
  selector: 'app-qualification-list',
  templateUrl: './qualification-list.component.html',
  styleUrls: ['./qualification-list.component.css']
})
export class QualificationListComponent {
  bearer = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzUFQ0dldiNno5MnlQWk1EWnBqT1U0RjFVN0lwNi1ELUlqQWVGczJPbGU0In0.eyJleHAiOjE2NzM3OTk1MzgsImlhdCI6MTY3Mzc5NTkzOCwianRpIjoiZDNmNzg5N2YtM2Q5ZC00YTcwLTkwZmMtMWU1ZWIxN2FlMTlhIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay5zenV0LmRldi9hdXRoL3JlYWxtcy9zenV0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjU1NDZjZDIxLTk4NTQtNDMyZi1hNDY3LTRkZTNlZWRmNTg4OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImVtcGxveWVlLW1hbmFnZW1lbnQtc2VydmljZSIsInNlc3Npb25fc3RhdGUiOiJmZDdiNjZiYS1iMmEyLTRmOWMtYjdmMC1iODFmZTUwZjQzZmUiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1zenV0IiwidW1hX2F1dGhvcml6YXRpb24iLCJ1c2VyIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXIifQ.V4RlLfMTZm_Fkd2G-gyyCVTl_SJ6CnXz9rVZ428u6oE6dShF4KdoUtSSC_FIZAEPvgRJ2mgMDDNxbyqOubxbhIuuQvhvRVQ_UMACObboToF8TUgM3RMJRx-m47zIgqWTw3g-3PCNmx_8bEbs2w3p-x8xVIs88IoP_-YYMbsji9wsuWcP4uIs0u9f_x8QEG-79liRML6DfnjVQr0FtS9nNNgM-NxOIbhL3guXZKdN715GUssS9JFBllloHiXiJD7kddnBNBymooO1QlDWYvBIsgWiiVENyvHLMcuRWAtXVZZi0c5sxG1BDXx0DS4lly-ALKPQZHiJeRj-LpnEty4fDQ';
  qualifications$: Observable<Qualification[]>;
  searchValue: string = "";

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

  searchForString() {
    this.qualifications$ = this.qualifications$.pipe(
      map(
        qualifications => qualifications.filter(qualification => this.isQualificationContentContainingString(this.searchValue, qualification))
      )
    )
  }

  isQualificationContentContainingString(text: string, qualification : Qualification) : boolean {
    var designation: string | undefined = qualification.designation?.toLowerCase();
    return this.isValueContainingTextIgnoreCase(designation, text)
  }


  private isValueContainingTextIgnoreCase(value: string | undefined, text: string): boolean {
    if (value != undefined) {
      return value.includes(text.toLowerCase());
    }
    return false;
  }
}
