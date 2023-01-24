import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { HistoryService } from '../history.service';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.css'],
})
export class StatusBarComponent {
  @Input()
  title: string = '';
  @Input()
  editable: string = 'false';
  @Input()
  editRoute: string = '';
  @Input()
  saveable: string = 'false';
  @Output()
  saveEmit: EventEmitter<any> = new EventEmitter<any>();

  constructor(private historyService: HistoryService) {}

  /**
   * Emits the save operation to the parent component
   */
  save() {
    this.saveEmit.emit();
  }

  /**
   * Goes back with the history service
   */
  goBack() {
    this.historyService.goBack();
  }
}
