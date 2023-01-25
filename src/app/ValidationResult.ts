export class ValidationResult {
  constructor(public field?: string, public valid?: boolean, public message?: string) {
    field = '';
    valid = false;
    message = '';
  }

  public getValidationResultForField(
    validationResults: ValidationResult[],
    field: string
  ): ValidationResult | undefined {
    return validationResults.filter((result) => result.field === field)[0];
  }

  /**
   * Builds a validator which checks if a field is valid
   *
   * @param fieldGuiRep - gui representation of the field to build a user-friendly validation error message
   * @param fieldContent - content of the string to check
   * @returns {@link ValidationResult} object
   */
  public buildMandatoryStringValidator(fieldGuiRep: string, fieldContent: string | undefined): ValidationResult {
    if (fieldContent != undefined && fieldContent.length !== 0) {
      this.valid = true;
    } else {
      this.message = `Das Feld ${fieldGuiRep} muss ausgefüllt sein.`;
    }
    return this;
  }

  /**
   * Builds a validator which checks if a field has the required size
   *
   * @param fieldGuiRep - gui representation of the field to build a user-friendly validation error message
   * @param fieldContent - content of the string to check
   * @param minLength - minimal length of the field
   * @param maxLength - maximum length of the field
   * @returns {@link ValidationResult} object
   */
  public buildMinMaxLengthValidator(
    fieldGuiRep: string,
    fieldContent: string | undefined,
    minLength: number,
    maxLength: number
  ): ValidationResult {
    if (fieldContent == undefined) {
      this.message = `Das Feld ${fieldGuiRep} muss ausgefüllt sein.`;
    } else if (fieldContent.length < minLength) {
      this.message = `Das Feld ${fieldGuiRep} muss mindestens ${minLength} Zeichen lang sein.`;
    } else if (fieldContent.length > maxLength) {
      this.message = `Das Feld ${fieldGuiRep} darf maximal ${maxLength} Zeichen lang sein.`;
    } else {
      this.valid = true;
    }
    return this;
  }
}
