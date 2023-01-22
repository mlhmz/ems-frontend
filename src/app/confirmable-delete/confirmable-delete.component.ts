import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmable-delete',
  templateUrl: './confirmable-delete.component.html',
  styleUrls: ['./confirmable-delete.component.css']
})
export class ConfirmableDeleteComponent {
  @Input()
  alignButtonRight: string = "";
  @Input()
  message: string = "";
  @Input()
  failedMessage: string = '';
  @Input()
  failed: boolean = false;
  @Output()
  deleteEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  resetErrorEmit: EventEmitter<any> = new EventEmitter<any>();
  dialogShown: boolean = false;

  delete() {
    this.dialogShown = true;
  }

  cancel() {
    this.dialogShown = false;
    this.resetErrorEmit.emit();
  }

  confirmDelete() {
    this.deleteEmit.emit();
  }

}
