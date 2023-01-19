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

  /**
   * Gets all qualifications and sets the search mode to false
   */
  fetchData() {
    this.qualifications$ = this.qualificationService.getAllQualifications();
    this.setSearchMode(false);
  }

  /**
   * Filters qualifications that include the {@link searchValue}.
   * In order to filter the observable, it will be piped and mapped.
   * Also, the {@link searchMode} will be set to true.
   * 
   * If the content is empty, {@link fetchData} will be executed.
   */
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

  /**
   * Checks if search mode is enabled
   * 
   * @returns if search mode is enabled
   */
  isSearchModeEnabled(): boolean {
    return this.searchMode;
  }

  /**
   * Sets the search mode state
   * 
   * @param state which the search mode should be set to
   */
  setSearchMode(state: boolean) {
    this.searchMode = state;
  }

  /**
   * Resets the search by setting the {@link searchValue} to false and
   */
  resetSearch() {
    this.setSearchMode(false);
    this.searchValue = "";
  }

  /**
   * Checks if the qualification content is containing the text string
   * 
   * @param text string to check if its content is included in the qualification skill
   * @qualification to check if the text is included in the skill
   * @returns boolean if text is included in qualification skill
   */
  private isQualificationContentContainingString(text: string, qualification : Qualification) : boolean {
    var skill: string | undefined = qualification.skill?.toLowerCase();
    return this.isValueContainingTextIgnoreCase(skill, text)
  }

  /**
   * Checks if value is containing text, while text is set to lower case
   * 
   * @param value to check if text is included
   * @param text to check if its content is included in the value string
   * @returns boolean if value is containing text
   */
  private isValueContainingTextIgnoreCase(value: string | undefined, text: string): boolean {
    if (value != undefined) {
      return value.includes(text.toLowerCase());
    }
    return false;
  }
}
