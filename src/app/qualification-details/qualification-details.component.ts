import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistoryService } from '../history.service';
import { Qualification } from '../Qualification';
import { QualificationService } from '../qualification.service';
import { QualificationEmployees } from '../QualificationEmployees';

@Component({
  selector: 'app-qualification-details',
  templateUrl: './qualification-details.component.html',
  styleUrls: ['./qualification-details.component.css'],
})
export class QualificationDetailsComponent implements OnInit {
  skill = '';
  qualification: Qualification | undefined;
  qualificationEmployees: QualificationEmployees | undefined;
  found = true;
  showSaveSuccess = false;
  failedMessage = '';
  failed = false;

  constructor(
    private route: ActivatedRoute,
    private qualificationService: QualificationService,
    private historyService: HistoryService
  ) {}

  /**
   * Initial fetch of qualification
   */
  ngOnInit(): void {
    this.getRequiredDataFromParams();
    this.fetchQualification(this.skill);
    if (this.found) {
      this.fetchQualificationEmployees(this.skill);
    }
  }

  /**
   * Goes back with the history service
   */
  goBack() {
    this.historyService.goBack();
  }

  /**
   * Deletes asynchronusly a qualification
   */
  async deleteQualification() {
    if (this.qualification != undefined && (await this.isQualificationDeletable(this.qualification))) {
      this.qualificationService.deleteQualification(this.qualification);
      this.goBack();
    }
  }

  /**
   * Checks asynchronusly if a qualification is assigned to any employee (deletable)
   *
   * @param qualification - to check
   * @returns boolean if the qualification is deletable
   *
   */
  private async isQualificationDeletable(qualification: Qualification) {
    if (await this.qualificationService.isQualificationAssignedToAnyEmployee(qualification)) {
      this.failedMessage = 'Die Qualifikation ist noch Mitarbeiter:innen zugewiesen.';
      this.failed = true;
      return false;
    }
    return true;
  }

  /**
   * Resets the deletion error of the confirmable deletion dialog
   */
  resetDeletionError() {
    this.failed = false;
    this.failedMessage = '';
  }

  /**
   * Gets required data from url params
   */
  private getRequiredDataFromParams() {
    const routeParams = this.route.snapshot.paramMap;
    this.skill = String(routeParams.get('id'));
    const routeQueries = this.route.snapshot.queryParamMap;
    if (routeQueries.has('saveSuccess')) {
      this.showSaveSuccess = routeQueries.get('saveSuccess') === 'true';
    }
  }

  /**
   * Fetches a certain qualification by its skill,
   * also, it will set the found switch, depending if the qualification was found.
   *
   * @param skill - the skill to get
   */
  private fetchQualification(skill: string) {
    this.qualificationService.getQualificationBySkill(skill).then((qualification) => {
      this.found = qualification != undefined;
      this.qualification = qualification;
    });
  }

  /**
   * Fetches QualificationEmployees with a certain skill
   *
   * @param skill - to get the qualification employees
   */
  private fetchQualificationEmployees(skill: string) {
    this.qualificationService.getQualificationEmployeesBySkill(skill).subscribe((qe) => {
      this.qualificationEmployees = qe;
    });
  }
}
