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
  qualification: Qualification | undefined;

  constructor(
    private route: ActivatedRoute,
    private qualificationService: QualificationService,
  ) {
  }

  ngOnInit(): void {
    this.fetchQualification(this.getDesignationFromParams());
  }


  private getDesignationFromParams() {
    const routeParams = this.route.snapshot.paramMap;
    const qualificationDesignation = String(routeParams.get('id'));
    console.log(qualificationDesignation);
    return qualificationDesignation;
  }

  private fetchQualification(qualificationDesignation: string) {
    this.qualificationService.getQualificationByDesignation(qualificationDesignation)
      .subscribe((qualification: Qualification) => this.qualification = qualification);
  }
}
