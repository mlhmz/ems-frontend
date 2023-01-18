import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Qualification } from '../Qualification';
import { QualificationService } from '../qualification.service';

@Component({
  selector: 'app-qualification-details',
  templateUrl: './qualification-details.component.html',
  styleUrls: ['./qualification-details.component.css']
})
export class QualificationDetailsComponent {
  qualificationParam: string = '';
  qualification: Qualification | undefined;
  found: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private qualificationService: QualificationService,
  ) {
  }

  ngOnInit(): void {
    this.getDesignationFromParams()
    this.fetchQualification(this.qualificationParam);
  }


  private getDesignationFromParams() {
    const routeParams = this.route.snapshot.paramMap;
    this.qualificationParam = String(routeParams.get('id'));
  }

  private fetchQualification(qualificationDesignation: string) {
    this.qualificationService.getQualificationByDesignation(qualificationDesignation)
    .then(qualification => {
      this.found = qualification != undefined;
      this.qualification = qualification
    })
  }
}
