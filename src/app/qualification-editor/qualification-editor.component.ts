import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Qualification } from '../Qualification';
import { QualificationService } from '../qualification.service';

@Component({
  selector: 'app-qualification-editor',
  templateUrl: './qualification-editor.component.html',
  styleUrls: ['./qualification-editor.component.css']
})
export class QualificationEditorComponent {
  qualification: Qualification;
  saveSuccess: boolean = false;
  saveMessage: string = "";
  callbackAlertShown: boolean = false;

  constructor(
    private qualificationService: QualificationService,
    private router: Router,
  ) {
    this.qualification = new Qualification();
  }

  save() {
    this.qualificationService.saveQualification(this.qualification)
      .then(() => {
        this.showCallbackAlert("Speichern erfolgreich", true);
        this.router.navigateByUrl("/qualification/" + this.qualification.skill + "?saveSuccess=true")
      }
      )
      .catch(() => this.showCallbackAlert("Speichern fehlgeschlagen", false))
  }

  private showCallbackAlert(saveMessage: string, saveSuccess: boolean) {
    this.saveMessage = saveMessage;
    this.saveSuccess = saveSuccess;
    this.callbackAlertShown = true;
  }
}
