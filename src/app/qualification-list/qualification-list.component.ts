import { Component } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Qualification } from '../Qualification';
import { QualificationService } from '../qualification.service';

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
    private qualificationService: QualificationService) {
    this.qualifications$ = of([]);
    this.fetchData();
  }

  fetchData() {
    this.qualifications$ = this.qualificationService.getAllQualifications();
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
