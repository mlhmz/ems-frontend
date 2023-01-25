import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { Qualification } from '../Qualification';
import { QualificationService } from '../qualification.service';

@Component({
  selector: 'app-qualification-list',
  templateUrl: './qualification-list.component.html',
  styleUrls: ['./qualification-list.component.css'],
})
export class QualificationListComponent {
  qualifications$: Observable<Qualification[]>;
  qualificationSelection: Qualification[] = [];
  searchValue = '';
  failedMessage = '';
  failed = false;
  private searchMode = false;

  constructor(private qualificationService: QualificationService, private router: Router) {
    this.qualifications$ = of([]);
    this.fetchData();
  }

  /**
   * Gets all qualifications and resets the search
   */
  fetchData() {
    this.qualifications$ = this.qualificationService.getAllQualifications();
    this.setSearchMode(false);
  }

  /**
   * Goes to an employee with the router
   *
   * @param id - of the employee
   */
  goToQualification(id: string | undefined) {
    if (id != undefined) {
      this.router.navigateByUrl('/qualification/' + id);
    }
  }

  selectQualification(qualification: Qualification) {
    if (this.isQualificationContainedInSelection(qualification)) {
      this.qualificationSelection = this.qualificationSelection.filter((entry) => entry != qualification);
    } else {
      this.qualificationSelection.push(qualification);
    }
  }

  /**
   * Checks if the qualification is contained in the selection
   *
   * @param qualification - to check
   * @returns boolean if qualification is met
   */
  isQualificationContainedInSelection(qualification: Qualification): boolean {
    return this.qualificationSelection.filter((entry) => entry == qualification).length != 0;
  }

  /**
   * checks if anything is selected
   *
   * @returns boolean if anything is selected
   */
  isAnythingSelected(): boolean {
    return this.qualificationSelection.length != 0;
  }

  /**
   * Clears qualification selection
   */
  clearSelection() {
    this.qualificationSelection = [];
  }

  /**
   * Deletes asynchronusly the qualification selection
   */
  async deleteQualificationSelection() {
    if (await this.isSelectionDeletable()) {
      this.qualificationService.bulkDeleteQualifications(this.qualificationSelection).then(() => {
        this.clearSelection();
        this.fetchData();
      });
    }
  }

  /**
   * Checks asynchronusly if any qualification of the selection is assigned to any employee (deletable)
   *
   * @param qualification - to check
   * @returns boolean if the qualification is deletable
   *
   */
  private async isSelectionDeletable() {
    for (const selection of this.qualificationSelection) {
      if (await this.qualificationService.isQualificationAssignedToAnyEmployee(selection)) {
        this.failedMessage = this.getQualificationNotDeletableMessage();
        this.failed = true;
        return false;
      }
    }
    return true;
  }

  /**
   * Checks for plural and gets by the result of the check the message
   *
   * @returns the message as string
   */
  private getQualificationNotDeletableMessage(): string {
    if (this.qualificationSelection.length == 1) {
      return 'Die Qualifikation ist noch Mitarbeiter:innen zugewiesen.';
    } else {
      return 'Die Qualifikationen sind noch Mitarbeiter:innen zugewiesen';
    }
  }

  /**
   * Checks asynchronusly if a qualification is deletable
   */
  resetDeletionError() {
    this.failed = false;
    this.failedMessage = '';
  }

  /**
   * Gets qualification deletion message and checks
   * if it is singular or plural
   *
   * @returns qualification deletion message as string
   */
  getDeleteConfirmationMessage(): string {
    if (this.qualificationSelection.length == 1) {
      return 'Soll die Qualifikation wirklich gelöscht werden?';
    } else {
      return `Sollen die ${this.qualificationSelection.length} ausgewählten Qualifikationen wirklich gelöscht werden`;
    }
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
      map((qualifications) =>
        qualifications.filter((qualification) =>
          this.isQualificationContentContainingString(this.searchValue, qualification)
        )
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
   * @param state - which the search mode should be set to
   */
  setSearchMode(state: boolean) {
    this.searchMode = state;
  }

  /**
   * Resets the search by setting the {@link searchValue} to false and
   */
  resetSearch() {
    this.setSearchMode(false);
    this.searchValue = '';
  }

  /**
   * Checks if the qualification content is containing the text string
   *
   * @param text - string to check if its content is included in the qualification skill
   * @param qualification - to check if the text is included in the skill
   * @returns boolean if text is included in qualification skill
   */
  private isQualificationContentContainingString(text: string, qualification: Qualification): boolean {
    const skill: string | undefined = qualification.skill?.toLowerCase();
    return this.isValueContainingTextIgnoreCase(skill, text);
  }

  /**
   * Checks if value is containing text, while text is set to lower case
   *
   * @param value - to check if text is included
   * @param text - to check if its content is included in the value string
   * @returns boolean if value is containing text
   */
  private isValueContainingTextIgnoreCase(value: string | undefined, text: string): boolean {
    if (value != undefined) {
      return value.includes(text.toLowerCase());
    }
    return false;
  }
}
