import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Qualification } from '../Qualification';
import { QualificationService } from '../qualification.service';

@Component({
  selector: 'app-qualification-editor',
  templateUrl: './qualification-editor.component.html',
  styleUrls: ['./qualification-editor.component.css'],
})
export class QualificationEditorComponent {
  qualification: Qualification;
  saveSuccess = false;
  saveMessage = '';
  callbackAlertShown = false;
  validatorShown = false;

  constructor(private qualificationService: QualificationService, private router: Router) {
    this.qualification = new Qualification();
  }

  /**
   * Saves asynchronusly a qualification and checks if it is valid and if it is already existing.
   */
  async save() {
    if (!this.qualificationService.isQualificationValid(this.qualification)) {
      this.validatorShown = true;
      this.showCallbackAlert('Speichern fehlgeschlagen, Grund: Die Daten sind nicht valide.', false);
      return;
    }
    if (await this.qualificationService.isQualificationExisting(this.qualification)) {
      this.showCallbackAlert('Speichern fehlgeschlagen, Grund: Die angegebene Qualifikation existiert bereits.', false);
      return;
    }
    this.qualificationService
      .saveQualification(this.qualification)
      .then(() => {
        this.showCallbackAlert('Speichern erfolgreich', true);
        this.router.navigateByUrl('/qualification/' + this.qualification.skill + '?saveSuccess=true');
      })
      .catch((err) =>
        this.showCallbackAlert(
          `Speichern fehlgeschlagen. Grund: ${err.error.message}. Falls Ihnen dies nicht weitergeholfen hat, kontaktieren Sie bitte den Support.`,
          false
        )
      );
  }

  /**
   * Gets the validation result of a field
   *
   * @param field - to get the validation result from
   */
  getFieldValidationResult(field: string) {
    if (this.validatorShown && !this.qualificationService.isQualificationValid(this.qualification)) {
      return this.qualificationService.getFieldValidationResult(field, this.qualification).message;
    } else {
      return '';
    }
  }

  /**
   * Fills and show callback alert
   *
   * @param saveMessage - for the callback
   * @param saveSuccess - for the callback to set it to green or red
   */
  private showCallbackAlert(saveMessage: string, saveSuccess: boolean) {
    this.saveMessage = saveMessage;
    this.saveSuccess = saveSuccess;
    this.callbackAlertShown = true;
  }
}
