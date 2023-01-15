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
  bearer = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzUFQ0dldiNno5MnlQWk1EWnBqT1U0RjFVN0lwNi1ELUlqQWVGczJPbGU0In0.eyJleHAiOjE2NzM4MTE4NzksImlhdCI6MTY3MzgwODI3OSwianRpIjoiNzRjMWYyMDEtYjU5Yi00NmYzLWE4NDItNzdlYjA5YTg2MTJjIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay5zenV0LmRldi9hdXRoL3JlYWxtcy9zenV0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjU1NDZjZDIxLTk4NTQtNDMyZi1hNDY3LTRkZTNlZWRmNTg4OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImVtcGxveWVlLW1hbmFnZW1lbnQtc2VydmljZSIsInNlc3Npb25fc3RhdGUiOiI4NjhkMTg4Ni01YmU1LTQzOTMtOTk1Ni1hOTEzMDk3ZjE2MGMiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1zenV0IiwidW1hX2F1dGhvcml6YXRpb24iLCJ1c2VyIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXIifQ.ZXKhRgkmEoUedcZItoIhWmwXYaeLlrUq4Epkf3cvGFsy5FtwCYA11nrzwgbKR8dddu8Ge06XRXFwYvLwPEOneSncXU2gqpoW2pVsx_8fvI3j8L7fF1MD7_RFMaIwsjgjgQhG0-s2FZQy609tjl3km5DAb4-OpU9bOK1pTK41frhkOA4E2rwXdxhKt627DB95F_Tjm6KNMCg0RYFNX2sbVH3WDnc0PgN-RgTN1b1ZHq2IrrLWsRwopG9edPCO_XS2BYN26HvgvynlIMMQ71sKtzuoXik0oHXuDO4gkujWmkubFR76VJRmz0PLyalCuj1hbpcn0DH7wCxDIiTiYmgddw';
  qualifications$: Observable<Qualification[]>;
  searchValue: string = "";
  private searchMode: boolean = false;

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
    this.setSearchMode(false);
  }

  searchForString() {
    if (this.searchValue.length === 0) {
      this.fetchData();
      return;
    }

    this.qualifications$ = this.qualifications$.pipe(
      map(
        qualifications => qualifications.filter(qualification => this.isQualificationContentContainingString(this.searchValue, qualification))
      )
    );
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

  private isQualificationContentContainingString(text: string, qualification : Qualification) : boolean {
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
