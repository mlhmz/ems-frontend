import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationEditorComponent } from './qualification-editor.component';

describe('QualificationEditorComponent', () => {
  let component: QualificationEditorComponent;
  let fixture: ComponentFixture<QualificationEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualificationEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualificationEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
