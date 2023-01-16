import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { AuthService } from '../auth.service';
import { Qualification } from '../Qualification';

@Component({
  selector: 'app-qualification-list',
  templateUrl: './qualification-list.component.html',
  styleUrls: ['./qualification-list.component.css']
})
export class QualificationListComponent {
  bearer = '';
  qualifications$: Observable<Qualification[]>;
  searchValue: string = '';
  private searchMode: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService) {
    this.qualifications$ = of([]);
    this.bearer = authService.getToken();
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
