import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmableDeleteComponent } from './confirmable-delete.component';

describe('ConfirmableDeleteComponent', () => {
  let component: ConfirmableDeleteComponent;
  let fixture: ComponentFixture<ConfirmableDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmableDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmableDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
