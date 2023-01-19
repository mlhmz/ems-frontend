import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HistoryService } from '../history.service';
import { Qualification } from '../Qualification';
import { QualificationService } from '../qualification.service';
import { QualificationEmployees } from '../QualificationEmployees';

@Component({
  selector: 'app-qualification-details',
  templateUrl: './qualification-details.component.html',
  styleUrls: ['./qualification-details.component.css']
})
export class QualificationDetailsComponent {
  skill: string = '';
  qualification: Qualification | undefined;
  qualificationEmployees: QualificationEmployees | undefined;
  found: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private qualificationService: QualificationService,
    private historyService: HistoryService,
  ) {
  }

  /**
   * Initial fetch of qualification
   */
  ngOnInit(): void {
    this.getSkillFromParams()
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
   * Gets the skill from the url params
  */
 private getSkillFromParams() {
   const routeParams = this.route.snapshot.paramMap;
   this.skill = String(routeParams.get('id'));
  }
  
  /**
   * Fetches a certain qualification by its skill,
   * also, it will set the found switch, depending if the qualification was found.
   * 
   * @param skill the skill to get
  */
 private fetchQualification(skill: string) {
   this.qualificationService.getQualificationBySkill(skill)
   .then(qualification => {
     this.found = qualification != undefined;
     this.qualification = qualification
    })
  }

  private fetchQualificationEmployees(skill: string) {
    this.qualificationService.getQualificationEmployeesBySkill(skill)
    .subscribe(
      qe => {
        this.qualificationEmployees = qe;
      }
    )
  }
}
